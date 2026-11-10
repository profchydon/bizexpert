import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { Business, User, WhatsappIdentity } from "@prisma/client";
import { AnalyticsService } from "../analytics/analytics.service";
import { InventoryService } from "../inventory/inventory.service";
import { PendingActionsService } from "../pending-actions/pending-actions.service";
import { PrismaService } from "../prisma/prisma.service";
import { executeAiTool } from "./ai-execute";
import { runAiFallback } from "./ai-fallback";
import { sanitizeChatHistory, type ChatTurn } from "./ai-history";
import { stripEmojis } from "./strip-emojis";
import { AI_TOOLS } from "./ai-tools";

type ChatInput = {
  user: User;
  business: Business;
  identity: WhatsappIdentity;
  messageText: string;
  history?: ChatTurn[];
  channel: "whatsapp" | "dashboard";
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly analyticsService: AnalyticsService,
    private readonly pendingActionsService: PendingActionsService,
    private readonly inventoryService: InventoryService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn(
        "OPENAI_API_KEY not set — AI features will use fallback mode",
      );
    }
  }

  async handleWhatsAppMessage(
    user: User,
    business: Business,
    _phone: string,
    messageText: string,
    identity: WhatsappIdentity,
  ): Promise<string> {
    return this.handleChatMessage({
      user,
      business,
      identity,
      messageText,
      channel: "whatsapp",
    });
  }

  async handleChatMessage(input: ChatInput): Promise<string> {
    const ctx = {
      user: input.user,
      business: input.business,
      identity: input.identity,
    };
    if (!this.openai) {
      return stripEmojis(
        await runAiFallback(input.messageText, ctx, this.analyticsService),
      );
    }

    const locations = await this.prisma.location.findMany({
      where: { businessId: input.business.id, isActive: true },
    });
    const surface =
      input.channel === "dashboard" ? "the dashboard chat" : "WhatsApp";
    const systemPrompt = [
      `You are the BizExpert AI assistant for *${input.business.name}*.`,
      `You help the user manage inventory and sales through ${surface}.`,
      `User: ${input.user.name}`,
      `Locations: ${locations.map((l) => `${l.name} (${l.type})`).join(", ")}`,
      `Currency: Nigerian Naira (₦).`,
      `For read queries, call the appropriate analytics tool and format the result in markdown (headings, bold, lists).`,
      `Do not use emojis.`,
      `For write operations (sale, stock receipt, transfer), ALWAYS preview first — never execute without explicit user confirmation.`,
      `If the user sends "CONFIRM [ID]" or similar, call confirm_pending_action with the ID.`,
      `If location is ambiguous, ask for clarification.`,
      `Keep responses concise. Use ₦ for currency.`,
    ].join("\n");

    const history = sanitizeChatHistory(input.history);
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map((turn) => ({ role: turn.role, content: turn.content })),
      { role: "user", content: input.messageText },
    ];
    const model = this.configService.get<string>("OPENAI_MODEL", "gpt-4o");
    let finalResponse = "";
    const deps = {
      analyticsService: this.analyticsService,
      pendingActionsService: this.pendingActionsService,
      inventoryService: this.inventoryService,
      logger: this.logger,
    };

    for (let i = 0; i < 5; i++) {
      const completion = await this.openai.chat.completions.create({
        model,
        messages,
        tools: AI_TOOLS,
        tool_choice: "auto",
        max_tokens: 1024,
      });
      const choice = completion.choices[0];
      if (
        choice.finish_reason === "stop" ||
        !choice.message.tool_calls?.length
      ) {
        finalResponse = choice.message.content ?? "Done.";
        break;
      }
      messages.push(choice.message);
      for (const toolCall of choice.message.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments);
        const result = await executeAiTool(
          toolCall.function.name,
          args,
          ctx,
          deps,
        );
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }
    }

    return stripEmojis(
      finalResponse || "Sorry, I could not process your request.",
    );
  }
}
