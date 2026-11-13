import React from "react";
import {
  overviewSectionDescriptionClass,
  overviewSectionHeadingClass,
} from "../../overviewTableClasses";

const GlobalPresenceMapHeader = () => {
  return (
    <div className="absolute left-4 top-4 z-10 hidden max-w-[calc(100vw-2rem)] rounded-lg border border-border-secondary bg-primary p-4 shadow-xl sm:left-6 sm:top-6 md:block sm:w-[490px]">
      <h3 className={`${overviewSectionHeadingClass} text-md`}>
        Global Presence
      </h3>
      <p className={overviewSectionDescriptionClass}>
        Hover over a country to see employees, equipment and storage details
      </p>
    </div>
  );
};

export default GlobalPresenceMapHeader;
