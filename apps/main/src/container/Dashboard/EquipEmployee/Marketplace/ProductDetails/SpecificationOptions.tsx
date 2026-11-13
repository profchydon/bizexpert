import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { IAsset } from "@/types/assets";

interface SpecificationOptionsProps {
  assetDetail: IAsset;
  specId?: string;
  onSelectSpec: (id: string) => void;
}

const SpecificationOptions: React.FC<SpecificationOptionsProps> = ({
  assetDetail,
  specId,
  onSelectSpec,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
      {assetDetail?.specifications?.map((spec) => {
        const specPropsLabel = spec?.spec.map((prop) => prop.value).join(" ");

        return (
          <button
            type="button"
            key={spec?.id}
            className={cn(
              "w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-4 text-left transition hover:border-gray-400",
              spec?.id === specId && "border-primary-200 shadow-xs",
            )}
            onClick={() => {
              if (spec?.id) {
                onSelectSpec(spec.id);
              }
            }}
          >
            <div className="mb-5 flex items-start justify-between gap-3 text-xs text-gray-900">
              <div
                className="line-clamp-2"
                title={`${assetDetail.name} ${specPropsLabel}`}
              >
                {assetDetail.name} {specPropsLabel}
              </div>

              <Checkbox
                checked={spec?.id === specId}
                data-testid="specificationoptions-checkbox"
              />
            </div>

            <div className="flex flex-col gap-3 text-xs">
              {spec?.spec?.map((prop) => (
                <div className="flex justify-between" key={prop.name}>
                  <span className="font-semibold text-gray-900">
                    {prop.name}:
                  </span>
                  <span className="capitalize text-gray-700">{prop.value}</span>
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SpecificationOptions;
