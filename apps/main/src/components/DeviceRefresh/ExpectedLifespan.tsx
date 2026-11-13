import React from "react";
import { differenceInMonths, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  expectedLifespan: string;
  startDate: string;
  isDue: boolean;
}

const parseLifespan = (input: string): number => {
  const yearMatch = input.match(/(\d+)\s*year/);
  const monthMatch = input.match(/(\d+)\s*month/);

  const years = yearMatch ? parseInt(yearMatch[1], 10) : 0;
  const months = monthMatch ? parseInt(monthMatch[1], 10) : 0;

  return years * 12 + months;
};

const ExpectedLifespan: React.FC<Props> = ({
  expectedLifespan,
  startDate,
  isDue,
}) => {
  const now = new Date();
  const start = new Date(startDate);

  const totalMonths = parseLifespan(expectedLifespan);
  const usedMonths = differenceInMonths(now, start);
  const usedDays = differenceInDays(now, start);
  const isZeroLifespan = totalMonths <= 0;

  const approxPartialMonth = (usedDays % 30) / 30;
  const progress = isZeroLifespan
    ? 1
    : Math.min((usedMonths + approxPartialMonth) / totalMonths, 1);

  const isNearExpiry = progress >= 0.9;

  const totalYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  return (
    <div
      className={cn(
        "w-full rounded-xl p-2 text-white shadow-xs",
        isDue && isNearExpiry ? "bg-utility-error-600" : "bg-utility-gray-600",
      )}
    >
      <div
        className={cn(
          "rounded-lg border border-white/80 p-2",
          isDue && isNearExpiry
            ? "bg-utility-error-500"
            : "bg-utility-gray-500",
        )}
      >
        <p className="text-xs mb-2">Expected lifespan</p>
        {isZeroLifespan ? (
          <p className="text-xs font-semibold text-error-200">
            Lifespan duration is zero
          </p>
        ) : (
          <p className="text-sm font-semibold">
            {usedMonths > 0 && (
              <>
                {usedMonths} {usedMonths === 1 ? "Month" : "Months"}
                {usedDays > 0 && " and "}
              </>
            )}
            {usedDays > 0 && (
              <>
                {usedDays} {usedDays === 1 ? "day" : "days"}
              </>
            )}
            {usedMonths === 0 && usedDays === 0 && "0 days"} of usage
          </p>
        )}

        <div className="mb-2 mt-4 h-2 w-full rounded-full bg-white/30">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              isDue && isNearExpiry
                ? "bg-utility-error-700"
                : "bg-utility-gray-700",
            )}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {!isZeroLifespan && (
          <p className="text-right text-sm">
            {totalYears} {totalYears === 1 ? "year" : "years"} and{" "}
            {remainingMonths} {remainingMonths === 1 ? "month" : "months"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpectedLifespan;
