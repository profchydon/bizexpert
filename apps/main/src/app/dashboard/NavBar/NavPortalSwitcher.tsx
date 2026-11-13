"use client";

import { useState } from "react";
import { DotsGrid, Loading02 } from "@untitledui/icons";
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
} from "react-aria-components";
import { useGetAuthPortalsQuery } from "@/api/baseQueries/userApi/getAuthPortals";
import {
  type PortalKey,
  portalAuthorizationPaths,
  useGetPortalAuthorizationUrlMutation,
} from "@/api/baseQueries/authFlowApi/portalAuthorization";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { showApiError } from "@/utils/showApiError";
import { cx } from "@/utils/cx";
import { navBarIconButtonClass } from "./navBarIconButtonClass";

const PORTALS: { key: PortalKey; label: string }[] = [
  { key: "company", label: "Company" },
  { key: "vendor", label: "Vendor" },
  { key: "msp", label: "MSP" },
  { key: "admin", label: "Admin" },
];

const CURRENT_PORTAL: PortalKey = "company";

const gridColsClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

const RaydaMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M29.5796 27.5187H25.9476L22.8567 24.4717L21.0296 22.6701C21.7125 22.1562 22.3277 21.5591 22.8592 20.8959C24.2396 19.1729 25.0638 17.0001 25.0638 14.6407C25.0638 9.07065 20.4658 4.53799 14.8154 4.53799C9.16505 4.53799 4.56702 9.07065 4.56702 14.6407C4.56702 19.7824 8.48468 24.0409 13.5319 24.6648V22.1074C9.90497 21.5029 7.13404 18.3852 7.13404 14.6407C7.13404 10.4653 10.5798 7.06852 14.8154 7.06852C19.0511 7.06852 22.4968 10.4653 22.4968 14.6407C22.4968 16.3025 21.9507 17.8419 21.027 19.0898C20.5203 19.7749 19.9 20.3749 19.1924 20.8596L17.333 19.0261C18.0875 18.6027 18.7255 17.9957 19.1772 17.2668C19.6542 16.5005 19.9273 15.6 19.9273 14.6382C19.9273 11.8579 17.6333 9.59656 14.8129 9.59656C11.9925 9.59656 9.69854 11.8579 9.69854 14.6382C9.69854 16.9802 11.3273 18.9554 13.5294 19.5182V16.804C12.7748 16.3682 12.2681 15.5607 12.2681 14.6357C12.2681 13.2506 13.4077 12.1246 14.8154 12.1246C16.2231 12.1246 17.3602 13.2481 17.3602 14.6357C17.3602 15.5607 16.8535 16.3682 16.0989 16.804V30H13.5319V27.2078C7.06439 26.5714 2 21.175 2 14.6357C2 7.66807 7.7498 2 14.8179 2C21.8861 2 27.6334 7.66807 27.6334 14.6357C27.6334 17.6946 26.526 20.5018 24.6838 22.69L29.5796 27.5187Z"
      fill="#0C66FF"
    />
  </svg>
);

const NavPortalSwitcher = () => {
  const { data } = useGetAuthPortalsQuery();
  const available = data?.data?.available_portals;
  const portals = PORTALS.filter(({ key }) => available?.[key]);
  const [getPortalAuthorizationUrl] = useGetPortalAuthorizationUrlMutation();
  const [openingPortal, setOpeningPortal] = useState<PortalKey | null>(null);

  const openPortal = async (portal: PortalKey, label: string) => {
    if (openingPortal) return;

    // Open the tab synchronously so the browser treats it as user-initiated,
    // then point it at the SSO URL once the authorization call resolves.
    const tab = window.open("", "_blank");
    if (!tab) {
      displayErrorMessage(`Allow pop-ups to open the ${label} portal.`);
      return;
    }
    tab.opener = null;

    setOpeningPortal(portal);
    try {
      const res = await getPortalAuthorizationUrl(
        portalAuthorizationPaths[portal],
      ).unwrap();
      tab.location.href = res.data.redirect_url;
    } catch (error) {
      tab.close();
      showApiError(error);
    } finally {
      setOpeningPortal(null);
    }
  };

  if (portals.length === 0) return null;

  return (
    <AriaDialogTrigger>
      <AriaButton
        aria-label="Switch Rayda portal"
        data-testid="navbar-portal-switcher-button"
        className={cx(
          navBarIconButtonClass,
          "cursor-pointer outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-white/40 data-[pressed]:bg-white/10 data-[pressed]:text-gray-200",
        )}
      >
        <DotsGrid className="size-5" />
      </AriaButton>

      <AriaPopover
        placement="bottom end"
        offset={18}
        className={({ isEntering, isExiting }) =>
          cx(
            "z-[103] w-[296px] origin-(--trigger-anchor-point) rounded-2xl bg-primary p-2 shadow-xl ring-1 ring-secondary_alt will-change-transform",
            isEntering &&
              "duration-150 ease-out animate-in fade-in zoom-in-95 slide-in-from-top-1",
            isExiting &&
              "duration-100 ease-in animate-out fade-out zoom-out-95 slide-out-to-top-1",
          )
        }
      >
        <AriaDialog aria-label="Rayda portals" className="outline-none">
          <div className="flex items-center justify-between px-3 pt-2 pb-3">
            <p className="text-sm font-semibold text-primary">Your portals</p>
            <span className="text-xs text-tertiary">
              {portals.length} available
            </span>
          </div>

          <ul
            className={cx(
              "grid gap-1 rounded-xl bg-secondary p-2",
              gridColsClass[Math.min(portals.length, 3)],
            )}
          >
            {portals.map(({ key, label }) => {
              const isCurrent = key === CURRENT_PORTAL;
              const isOpening = openingPortal === key;

              return (
                <li key={key}>
                  <button
                    type="button"
                    aria-current={isCurrent ? "page" : undefined}
                    aria-busy={isOpening || undefined}
                    title={`Open ${label} portal in a new tab`}
                    disabled={!!openingPortal}
                    onClick={() => openPortal(key, label)}
                    data-testid={`navbar-portal-${key}`}
                    className={cx(
                      "group flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl px-2 py-3.5 outline-none transition duration-100 ease-linear enabled:hover:bg-primary focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed",
                      isCurrent && "bg-primary shadow-xs ring-1 ring-secondary",
                      openingPortal && !isOpening && "opacity-60",
                    )}
                  >
                    <span className="relative flex size-12 items-center justify-center rounded-full bg-primary shadow-xs ring-1 ring-secondary transition duration-100 ease-linear group-enabled:group-hover:scale-105">
                      {isOpening ? (
                        <Loading02 className="size-6 animate-spin text-fg-brand-primary" />
                      ) : (
                        <RaydaMark className="size-7" />
                      )}
                      {isCurrent && (
                        <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-brand-solid ring-2 ring-white" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-secondary">
                      {label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </AriaDialog>
      </AriaPopover>
    </AriaDialogTrigger>
  );
};

export default NavPortalSwitcher;
