import React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const SummaryCard: React.FC<Props> = ({ description, icon, title }) => {
  return (
    <div className="relative rounded-xl border border-border-secondary bg-gray-900 px-6 pt-8 pb-6 text-center shadow-sm">
      <div className="absolute -top-7 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-8 border-gray-700 bg-gray-600">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-300">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-white sm:text-display-sm">
        {description}
      </p>
    </div>
  );
};

export default SummaryCard;
