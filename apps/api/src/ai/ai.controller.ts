import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BusinessAccessGuard } from "../common/guards/business-access.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { AiService } from "./ai.service";
import { dashboardChatIdentity } from "./ai-identity";
import { ChatMessageDto } from "./chat-message.dto";

@ApiTags("AI")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller("businesses/:businessId/ai")
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  @Post("chat")
  @ApiOperation({ summary: "Send a dashboard AI chat message" })
  async chat(
    @CurrentUser() jwt: { id: string },
    @Param("businessId") businessId: string,
    @Body() dto: ChatMessageDto,
  ) {
    const [user, business] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({ where: { id: jwt.id } }),
      this.prisma.business.findUniqueOrThrow({ where: { id: businessId } }),
    ]);
    const reply = await this.aiService.handleChatMessage({
      user,
      business,
      identity: dashboardChatIdentity(user, business),
      messageText: dto.message.trim(),
      history: dto.history,
      channel: "dashboard",
    });
    return { reply };
  }
}
