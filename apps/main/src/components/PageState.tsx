import React from "react";
import Loader from "./Loader";

interface Props {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}
const PageState: React.FC<React.PropsWithChildren<Props>> = ({
  isError,
  errorMessage = "Oops, Something went wrong!!!",
  isLoading,
  children,
}) => {
  if (isLoading) {
    return (
      <div className="grid place-content-center py-20">
        <Loader />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="grid place-content-center py-20">{errorMessage}</div>
    );
  }
  return children;
};

export default PageState;
