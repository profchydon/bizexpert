import { useEffect, useState } from "react";
import { GuidedTooltip } from "@/components/guided-tooltip";

const STORAGE_KEY = "rayda_marketplace_country_tip_seen";

const MarketplaceCountryTip = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (globalThis.window !== undefined && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <GuidedTooltip
      step={0}
      total={1}
      title="Select a country"
      description="Choose the country you want to find devices in."
      dotPosition="top-right"
      className="absolute -left-[25rem] top-6 z-50"
      resolveLabel="Got it"
      onDone={() => {
        localStorage.setItem(STORAGE_KEY, "true");
        setVisible(false);
      }}
    />
  );
};

export default MarketplaceCountryTip;
