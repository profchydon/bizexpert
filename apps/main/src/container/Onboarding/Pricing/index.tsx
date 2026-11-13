import React from "react";
import Title from "./Title";
import CardContainer from "./Card";

const Pricing = () => {
  return (
    <div className="w-full py-12 flex flex-col items-center">
      <div className="w-full max-w-7xl h-auto justify-center m-auto flex flex-col gap-16 xl:gap-0 xl:flex-row xl:justify-between px-8 ">
        <Title />
        <CardContainer />
      </div>
    </div>
  );
};

export default Pricing;
