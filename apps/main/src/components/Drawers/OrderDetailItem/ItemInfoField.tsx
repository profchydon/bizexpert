import React from "react";

interface Props {
  label: string;
  value: string;
  href?: string;
}

const ItemInfoField: React.FC<Props> = ({ label, value, href }) => (
  <div className="flex flex-1 flex-col gap-1">
    <p className="text-xs font-medium text-[#475467]">{label}</p>
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
      >
        {value}
      </a>
    ) : (
      <p className="text-sm text-[#475467]">{value}</p>
    )}
  </div>
);

export default ItemInfoField;
