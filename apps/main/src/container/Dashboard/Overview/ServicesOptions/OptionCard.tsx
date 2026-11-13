import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useAppDispatch } from "@/store";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { openSafeRedirectUrl } from "@/utils/auth/isSafeRedirectUrl";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { resolveOptionCardAction } from "./optionCardAction";

interface Props {
  icon: string;
  name: string;
  description: React.ReactNode | string;
  status: React.ReactNode;
  link: string | undefined;
  slug: string;
  country_id: string;
  country_name: string;
  country_code: string;
}

const OptionCard: React.FC<Props> = ({
  description,
  icon,
  name,
  link,
  status,
  slug,
  country_id,
  country_name,
  country_code,
}) => {
  const { push, isPending } = useTransitionRouter();
  const dispatch = useAppDispatch();

  const storeCountryAndRoutePath = (path: string) => {
    const country = {
      id: country_id,
      name: country_name,
      code: country_code,
    };
    dispatch(setCountry(country));
    dispatch(setSelectedEmployees([]));
    push(path);
  };
  return (
    <div className="h-full">
      <Card className="shadow-xl border gap-6">
        <CardContent className="flex flex-row items-center pt-4 gap-x-6">
          <div className="flex items-center rounded-lg w-36 h-28">
            <Image src={icon} width={144} height={120} alt="image-icon" />
          </div>
          <div className="flex flex-col gap-y-2 ">
            <span className="font-semibold text-primary-700 text-lg">
              {name}
            </span>
            <span className="text-sm text-[#535862] font-normal">
              {capitalizeFirstLetter(description as string)}
            </span>
            <div className="font-semibold text-[30px] text-white ">
              {status === "active" && (
                <Button
                  onClick={() => {
                    const action = resolveOptionCardAction(link, slug);

                    if (action.type === "external") {
                      if (!openSafeRedirectUrl(action.url)) {
                        displayErrorMessage(
                          "We couldn't open this service.",
                          "The service address was not a valid http or https URL.",
                        );
                      }
                      return;
                    }

                    if (action.type === "internal") {
                      if (action.storeCountry) {
                        storeCountryAndRoutePath(action.path);
                        return;
                      }
                      push(action.path);
                      return;
                    }

                    if (action.type === "invalid") {
                      displayErrorMessage(
                        "We couldn't open this service.",
                        "The service address was not a valid http or https URL.",
                      );
                    }
                  }}
                  disabled={status !== "active"}
                  isLoading={isPending}
                  className="gap-x-2"
                  data-testid="optioncard-button"
                >
                  {name} <ArrowRight className="w-5 text-white" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptionCard;
