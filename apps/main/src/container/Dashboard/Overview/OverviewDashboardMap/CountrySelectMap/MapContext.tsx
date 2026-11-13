import React, { useState } from "react";
import { SingleSelectValue } from "@/components/ui/autocomplete";
interface MapContextInterface {
  changeDefaultCountry: (country: SingleSelectValue | null) => void;
  defaultCountry: SingleSelectValue | null;
}
const MapCtx = React.createContext<MapContextInterface>(
  {} as MapContextInterface,
);
const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [defaultCountry, setDefaultCountry] =
    useState<SingleSelectValue | null>(null);
  const changeDefaultCountry = (country: SingleSelectValue | null) => {
    setDefaultCountry(country);
  };
  const contextValue = React.useMemo(
    () => ({
      defaultCountry,
      changeDefaultCountry,
    }),
    [defaultCountry, changeDefaultCountry],
  );

  return <MapCtx.Provider value={contextValue}>{children}</MapCtx.Provider>;
};
export const useMapContext = () => {
  const context = React.useContext(MapCtx);
  if (context === null) {
    throw new Error("useProject must be used within a Project Provider");
  }
  return context;
};
export default MapContextProvider;
