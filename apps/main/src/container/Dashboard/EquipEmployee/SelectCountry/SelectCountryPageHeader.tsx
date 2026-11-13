import routes from "@/routes";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SelectCountryPageHeader = () => {
  return (
    <div className="w-full page-px">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold text-gray-900">
            Equip employee
          </h1>
          <p className="text-base leading-6 text-gray-600">
            Select a country to continue to marketplace and see local stock,
            delivery, and pricing.
          </p>
        </div>

        <Separator />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          href={routes.EQUIP_EMPLOYEE}
          className="text-gray-500 transition hover:text-gray-700"
        >
          <Home className="h-5 w-5" />
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-300" />

        <span className="text-sm font-semibold text-primary-600">
          Select country
        </span>
      </div>
    </div>
  );
};

export default SelectCountryPageHeader;
