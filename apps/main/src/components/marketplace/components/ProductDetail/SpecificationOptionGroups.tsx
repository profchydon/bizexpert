import { cn } from "../../utils/cn";
import { getSpecPreview } from "../../utils/spec";
import type { MarketplaceSpecification } from "../../types";

export interface SpecificationOptionGroupsProps {
  productName: string;
  specifications?: MarketplaceSpecification[];
  specId?: string;
  onSelectSpec: (specId: string) => void;
}

export const SpecificationOptionGroups = ({
  productName,
  specifications,
  specId,
  onSelectSpec,
}: SpecificationOptionGroupsProps) => {
  if (!specifications || specifications.length === 0) {
    return null;
  }

  return (
    <div className="mp-grid mp-grid-cols-1 mp-items-stretch mp-gap-4 sm:mp-grid-cols-2 xl:mp-grid-cols-3">
      {specifications.map((specification, index) => {
        const isSelected = specification?.id === specId;

        return (
          <button
            type="button"
            key={specification?.id ?? index}
            className={cn(
              "mp-flex mp-h-full mp-w-full mp-min-w-0 mp-overflow-hidden mp-flex-col mp-rounded-xl mp-border mp-border-gray-200 mp-bg-white mp-p-4 mp-text-left mp-shadow-none mp-ring-0 mp-transition",
              "hover:mp-border-gray-300 hover:mp-shadow-sm",
              isSelected &&
                "mp-border-[var(--mp-primary,#085DE8)] mp-ring-2 mp-ring-[var(--mp-primary,#085DE8)]/20 mp-shadow-sm",
            )}
            aria-pressed={isSelected}
            onClick={() => {
              if (specification?.id) {
                onSelectSpec(specification.id);
              }
            }}
          >
            <div className="mp-mb-3 mp-flex mp-min-h-[86px] mp-items-start mp-justify-between mp-gap-3">
              <div className="mp-min-w-0 mp-pr-1">
                <p className="mp-text-xs mp-font-medium mp-text-gray-600">
                  Specification {index + 1}
                </p>
                <p
                  className="mp-mt-1 mp-line-clamp-2 mp-text-sm mp-font-semibold mp-leading-6 mp-text-gray-900"
                  title={`${productName} ${getSpecPreview(specification.spec, 4)}`}
                >
                  {productName} {getSpecPreview(specification.spec, 4)}
                </p>
              </div>

              <div className="mp-mt-0.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="mp-h-4 mp-w-4 mp-rounded mp-border-gray-300 mp-text-[var(--mp-primary,#085DE8)]"
                  aria-hidden
                />
              </div>
            </div>

            <div className="mp-mb-4 mp-flex mp-min-h-[64px] mp-min-w-0 mp-flex-wrap mp-content-start mp-gap-1.5">
              {specification.spec.slice(0, 4).map((spec) => (
                <span
                  key={`${specification.id}-${spec.name}`}
                  className="mp-max-w-full mp-rounded-full mp-bg-gray-50 mp-px-2 mp-py-0.5 mp-text-xs mp-font-medium mp-text-gray-700 mp-ring-1 mp-ring-inset mp-ring-gray-200 mp-whitespace-normal mp-break-words"
                >
                  {spec.value}
                </span>
              ))}
            </div>

            <div className="mp-mt-auto mp-border-t mp-border-gray-200 mp-pt-3">
              <div className="mp-space-y-1">
                {specification.spec.slice(0, 2).map((spec) => (
                  <p
                    key={`${specification.id}-${spec.name}-kv`}
                    className="mp-break-words mp-text-xs mp-text-gray-600"
                  >
                    <span className="mp-font-semibold mp-text-gray-700">
                      {spec.name}:
                    </span>{" "}
                    {spec.value}
                  </p>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
