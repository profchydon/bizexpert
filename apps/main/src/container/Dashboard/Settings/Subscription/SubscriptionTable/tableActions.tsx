const SubscriptionTableActions: React.FC<{
  item: Record<string, string>;
  onDownload: () => void;
}> = ({ item, onDownload }) => {
  return (
    <>
      <p onClick={onDownload}>Download All</p>
    </>
  );
};

export default SubscriptionTableActions;
