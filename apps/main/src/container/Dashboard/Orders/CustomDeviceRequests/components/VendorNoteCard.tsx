import { MessageSquareMore } from "lucide-react";

interface VendorNoteCardProps {
  note: string;
}

export default function VendorNoteCard({
  note,
}: Readonly<VendorNoteCardProps>) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-3">
        <MessageSquareMore className="size-4 text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">Vendor Note</span>
      </div>
      <div className="px-3 py-3">
        <p className="text-sm leading-relaxed text-gray-600">{note}</p>
      </div>
    </div>
  );
}
