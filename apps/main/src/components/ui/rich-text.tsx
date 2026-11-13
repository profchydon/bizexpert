import { cn } from "@/lib/utils";
import { sanitizeRichTextHtml } from "@/utils/sanitizeHtml";

interface RichTextProps {
  html: string;
  className?: string;
}

const RichText: React.FC<RichTextProps> = ({ html, className }) => {
  const clean = sanitizeRichTextHtml(html);

  if (!clean) {
    return null;
  }

  return (
    <div
      className={cn(
        "[&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:text-blue-600 [&_a]:underline [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default RichText;
