import React from "react";

interface Props {
  title: string;
  description: string | React.ReactNode;
}
const ListItem: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-y-1">
      <span className="text-sm text-gray-500 font-medium">{title}</span>
      <span className="text-base text-gray-700 font-medium">{description}</span>
    </div>
  );
};

export default ListItem;
