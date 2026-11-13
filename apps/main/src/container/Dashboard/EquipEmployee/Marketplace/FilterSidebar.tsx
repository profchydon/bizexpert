import React from "react";
import FilterActions, { FilterActionsProps } from "./FilterActions";

type Props = FilterActionsProps;

const FilterSidebar: React.FC<Props> = (props) => {
  return <FilterActions {...props} />;
};

export default FilterSidebar;
