"use client";

import ViewNavigateButton from "@/components/ViewNavigateButton";

const AllEquipmentsTableActions: React.FC<{
  viewHref: string;
  onEdit?: () => void;
}> = ({ viewHref, onEdit }) => {
  return (
    <div className="flex flex-row gap-2">
      <ViewNavigateButton
        href={viewHref}
        className="font-semibold text-[#003999]"
        testId="equipmentstableaction-button"
      />
      {onEdit ? (
        <button
          type="button"
          className="text-sm font-semibold text-primary-700"
          onClick={onEdit}
          data-testid="equipmentstableaction-button-2"
        >
          Edit
        </button>
      ) : null}
    </div>
  );
};

export default AllEquipmentsTableActions;
