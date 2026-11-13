import { Button } from "@/components/ui/button";
import { equipmentHashCodeHref } from "./equipmentHashCodeHref";

type Props = {
  hashCode: string | undefined;
};

const EquipmentAssociatedDocuments = ({ hashCode }: Props) => {
  const href = equipmentHashCodeHref(hashCode);

  return (
    <div className="grid place-content-start gap-4 my-auto w-full pt-4 border-t">
      <div className="flex flex-row  ">
        <div className="flex flex-col">
          <span className="font-medium text-sm">Associated Documents</span>
          <span className="font-normal text-sm text-black">
            View/download files associated with this equippment
          </span>
        </div>
      </div>
      {href ? (
        <div className="flex flex-row justify-between border rounded-md items-center text-sm p-4 ">
          <span className="font-medium">Hashcode.zip</span>
          <a href={href} download="Hashcode.zip" rel="noopener noreferrer">
            <Button
              className="font-medium p-0 text-blue-600 gap-x-2"
              variant="ghost"
              data-testid="equipmentassociateddocuments-button"
            >
              Download
            </Button>
          </a>
        </div>
      ) : (
        <div className="mt-3 grid place-content-center text-sm">
          No associated documents.
        </div>
      )}
    </div>
  );
};

export default EquipmentAssociatedDocuments;
