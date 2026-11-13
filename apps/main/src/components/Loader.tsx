import React from "react";
import { TailSpin } from "react-loader-spinner";

interface Props {
  height?: string;
  width?: string;
}
const Loader: React.FC<Props> = ({ height = "60", width = "60" }) => {
  return (
    <TailSpin
      visible={true}
      height={height}
      width={width}
      color="#003999"
      ariaLabel="tail-spin-loading"
      radius="0.5"
    />
  );
};

export default Loader;
