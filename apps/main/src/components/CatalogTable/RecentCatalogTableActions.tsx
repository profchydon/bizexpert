import ViewNavigateButton from "@/components/ViewNavigateButton";

const RecentCatalogTableActions: React.FC<{
  viewHref: string;
}> = ({ viewHref }) => {
  return (
    <div className="grid place-content-end">
      <ViewNavigateButton
        href={viewHref}
        className="font-semibold"
        testId="recentcatalogtableactions-button"
      />
    </div>
  );
};

export default RecentCatalogTableActions;
