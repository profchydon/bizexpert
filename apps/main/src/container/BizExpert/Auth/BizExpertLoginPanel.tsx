import { MapPin, ShoppingCart, Warehouse, type LucideIcon } from "lucide-react";
import {
  bizExpertLoginBrandClass,
  bizExpertLoginHeadlineClass,
  bizExpertLoginHighlightBodyClass,
  bizExpertLoginHighlightIconClass,
  bizExpertLoginHighlightRowClass,
  bizExpertLoginHighlightsClass,
  bizExpertLoginHighlightTitleClass,
  bizExpertLoginLeadClass,
  bizExpertLoginPanelClass,
  bizExpertLoginPanelFootClass,
  bizExpertLoginPanelGlowBottomClass,
  bizExpertLoginPanelGlowTopClass,
  bizExpertLoginPanelInnerClass,
} from "./bizExpertLoginClasses";
import {
  bizExpertLoginHighlights,
  type BizExpertLoginHighlightId,
} from "./bizExpertLoginHighlights";

const highlightIcons: Record<BizExpertLoginHighlightId, LucideIcon> = {
  stores: MapPin,
  stock: Warehouse,
  sales: ShoppingCart,
};

export function BizExpertLoginPanel() {
  return (
    <aside className={bizExpertLoginPanelClass}>
      <div className={bizExpertLoginPanelGlowTopClass} />
      <div className={bizExpertLoginPanelGlowBottomClass} />
      <div className={bizExpertLoginPanelInnerClass}>
        <div>
          <p className={bizExpertLoginBrandClass}>BizExpert</p>
          <h2 className={bizExpertLoginHeadlineClass}>
            Inventory and sales for every store
          </h2>
          <p className={bizExpertLoginLeadClass}>
            Track stock, record sales, and run locations from one place.
          </p>
          <ul className={bizExpertLoginHighlightsClass}>
            {bizExpertLoginHighlights.map((item) => {
              const Icon = highlightIcons[item.id];
              return (
                <li key={item.id} className={bizExpertLoginHighlightRowClass}>
                  <span className={bizExpertLoginHighlightIconClass}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className={bizExpertLoginHighlightTitleClass}>
                      {item.title}
                    </p>
                    <p className={bizExpertLoginHighlightBodyClass}>
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <p className={bizExpertLoginPanelFootClass}>
          Built for Nigerian wholesalers and retailers.
        </p>
      </div>
    </aside>
  );
}
