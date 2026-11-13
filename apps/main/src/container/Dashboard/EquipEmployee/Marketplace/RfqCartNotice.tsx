const RFQ_CART_NOTICE =
  "You have RFQ items in your cart. Clear them before adding marketplace items.";

interface RfqCartNoticeProps {
  className?: string;
}

const RfqCartNotice: React.FC<RfqCartNoticeProps> = ({ className }) => (
  <p className={className ?? "text-xs leading-5 text-error-600"}>
    {RFQ_CART_NOTICE}
  </p>
);

export { RFQ_CART_NOTICE };
export default RfqCartNotice;
