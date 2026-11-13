import { CheckCircle2 } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";

export function OfficeDonePanel({
  name,
  parentName,
}: {
  name: string;
  parentName: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <FeaturedIcon
        icon={CheckCircle2}
        size="lg"
        color="success"
        theme="light"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {name || "Office"} is active
        </h3>
        <p className="mt-1 max-w-sm text-sm text-gray-600">
          It operates under {parentName || "its parent entity"}, inherits its
          currency, and is ready for assets and employees. It now counts toward
          that entity&apos;s office limit.
        </p>
      </div>
    </div>
  );
}
