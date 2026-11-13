import RichText from "@/components/ui/rich-text";
import { Separator } from "@/components/ui/separator";
import { IAsset, ISpecification } from "@/types/assets";
import createQueryString from "@/utils/createQueryString";
import { isRichTextEmpty } from "@/utils/sanitizeHtml";
import { usePathname, useRouter } from "next/navigation";
import SpecificationOptions from "./SpecificationOptions";
import TechnicalSpecificationsTable from "./TechnicalSpecificationsTable";

interface ProductDetailsBodyProps {
  assetDetail: IAsset;
  currentSpec?: ISpecification;
  specId?: string;
}

const ProductDetailsBody: React.FC<ProductDetailsBodyProps> = ({
  assetDetail,
  currentSpec,
  specId,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Separator className="mt-6" />
      <div className="my-7">
        <h3 className="mb-3 text-[18px] leading-6 font-semibold tracking-[0.12em] text-gray-700 uppercase">
          Description
        </h3>
        {isRichTextEmpty(assetDetail?.description) ? (
          <p className="max-w-[72ch] text-lg leading-8 font-normal text-gray-600">
            Built for day-to-day reliability, this device combines performance,
            portability, and enterprise-grade compatibility for distributed
            teams.
          </p>
        ) : (
          <RichText
            html={assetDetail?.description ?? ""}
            className="max-w-[72ch] text-lg leading-8 font-normal text-gray-600"
          />
        )}
      </div>

      <Separator />

      <div className="mt-6 flex flex-col gap-y-5">
        <div>
          <h3 className="mb-3 text-base font-semibold text-gray-900">
            Specifications
          </h3>

          <SpecificationOptions
            assetDetail={assetDetail}
            specId={specId}
            onSelectSpec={(selectedSpecId: string) =>
              router.push(
                `${pathname}?${createQueryString("specId", selectedSpecId)}`,
                { scroll: false },
              )
            }
          />
        </div>

        <TechnicalSpecificationsTable specs={currentSpec?.spec || []} />
      </div>
    </>
  );
};

export default ProductDetailsBody;
