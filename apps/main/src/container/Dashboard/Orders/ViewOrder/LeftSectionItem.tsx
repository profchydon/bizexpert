import React from "react";

interface Props {
  title: string;
  description: string | React.ReactNode;
}
const LeftSectionItem: React.FC<Props> = ({ description, title }) => {
  return (
    <div className="flex flex-col gap-y-1">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-lg font-medium">{description}</span>
    </div>
  );
};

export default LeftSectionItem;
