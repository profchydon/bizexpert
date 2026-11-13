import type { ReactNode } from "react";
import {
  parseAiChatMarkdown,
  type AiChatBlock,
  type AiChatInline,
} from "./parseAiChatMarkdown";
import { aiChatMarkdownClass } from "./aiChatClasses";

function Inline({ nodes }: { nodes: AiChatInline[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === "strong") {
          return <strong key={index}>{node.value}</strong>;
        }
        if (node.type === "em") {
          return <em key={index}>{node.value}</em>;
        }
        if (node.type === "code") {
          return <code key={index}>{node.value}</code>;
        }
        return <span key={index}>{node.value}</span>;
      })}
    </>
  );
}

function Block({ block }: { block: AiChatBlock }) {
  if (block.type === "h") {
    return (
      <p className="font-semibold text-gray-900">
        <Inline nodes={block.children} />
      </p>
    );
  }
  if (block.type === "ul" || block.type === "ol") {
    const List = block.type === "ul" ? "ul" : "ol";
    return (
      <List>
        {block.items.map((item, index) => (
          <li key={index}>
            <Inline nodes={item} />
          </li>
        ))}
      </List>
    );
  }
  return (
    <p>
      {block.lines.map((line, index) => (
        <span key={index}>
          {index > 0 ? <br /> : null}
          <Inline nodes={line} />
        </span>
      ))}
    </p>
  );
}

export function AiChatMarkdown({ text }: { text: string }): ReactNode {
  const blocks = parseAiChatMarkdown(text);
  if (!blocks.length) return text;
  return (
    <div className={aiChatMarkdownClass}>
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}
