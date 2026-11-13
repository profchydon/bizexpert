import Image from "next/image";
import { emptyEquipment_grey } from "@/assets/icons";

type Props = {
  title: string;
  description: string;
};

const EmployeeDetailEmptyState = ({ title, description }: Props) => {
  return (
    <div className="grid place-content-center px-6 py-10">
      <Image src={emptyEquipment_grey} alt="" className="mx-auto" aria-hidden />
      <div className="mt-5 flex flex-col text-center">
        <h3 className="text-md font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm text-tertiary">{description}</p>
      </div>
    </div>
  );
};

export default EmployeeDetailEmptyState;
