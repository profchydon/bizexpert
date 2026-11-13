import React, { useState } from "react";

const HeadingCard = () => {
  return (
    <div>
      <div className="font-semibold text-base text-gray-900">
        Select Country
      </div>
      <span className="font-normal text-gray-600 text-sm">
        Choose a country to view detailed information.
      </span>
    </div>
  );
};

export default HeadingCard;
