import React, { useState } from "react";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  maxLength = 150,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;
  const displayText = expanded ? text : text.slice(0, maxLength);

  return (
    <div className={className}>
      <p>
        {displayText}
        {isLong && !expanded && "..."}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-blue-500 hover:underline text-xs"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
