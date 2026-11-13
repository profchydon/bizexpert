import Image from "next/image";
import { bank_note } from "@/assets/icons";
import formatAmount from "@/utils/formatAmount";

interface Props {
  amount: string | number;
  symbol: string;
}

const CatalogBudgetAmount = ({ amount, symbol }: Props) => (
  <div className="inline-flex w-fit items-center overflow-hidden rounded-md border border-gray-200">
    <div className="bg-white px-2 py-1.5">
      <Image src={bank_note} alt="budget" width={16} height={16} />
    </div>
    <span className="my-1 mr-1 block rounded-md bg-primary-50 px-3 py-1 text-sm font-medium text-primary-900">
      {symbol}
      {formatAmount(amount)}
    </span>
  </div>
);

export default CatalogBudgetAmount;
