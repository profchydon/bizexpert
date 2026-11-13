"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { Fragment, createContext, useContext } from "react";
import type {
  TabListProps as AriaTabListProps,
  TabProps as AriaTabProps,
  TabRenderProps as AriaTabRenderProps,
} from "react-aria-components";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  TabsContext,
  useSlottedContext,
} from "react-aria-components";
import type { BadgeColors } from "@/components/base/badges/badge-types";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import {
  getHorizontalStyles,
  getTabBadgeColor,
  getTabStyles,
  tabSizes,
  type HorizontalTabType,
  type TabVisualType,
} from "./tab-styles";

type Orientation = "horizontal" | "vertical";

interface TabListComponentProps<
  T extends object,
  K extends Orientation,
> extends AriaTabListProps<T> {
  size?: keyof typeof tabSizes;
  type?: K extends "horizontal" ? HorizontalTabType : TabVisualType;
  orientation?: K;
  items: T[];
  fullWidth?: boolean;
}

interface TabComponentProps extends AriaTabProps {
  label?: ReactNode;
  children?: ReactNode | ((props: AriaTabRenderProps) => ReactNode);
  badge?: number | string;
  badgeColor?: BadgeColors;
}

const TabListContext = createContext<
  Omit<TabListComponentProps<TabComponentProps, Orientation>, "items">
>({
  size: "sm",
  type: "button-brand",
});

export const TabList = <T extends Orientation>({
  size = "sm",
  type = "button-brand",
  orientation: orientationProp,
  fullWidth,
  className,
  children,
  ...otherProps
}: TabListComponentProps<TabComponentProps, T>) => {
  const context = useSlottedContext(TabsContext);
  const orientation = orientationProp ?? context?.orientation ?? "horizontal";

  return (
    <TabListContext.Provider value={{ size, type, orientation, fullWidth }}>
      <AriaTabList
        {...otherProps}
        className={(state) =>
          cx(
            "group flex",
            getHorizontalStyles({
              size,
              fullWidth,
            })[type as HorizontalTabType],
            orientation === "vertical" && "w-max flex-col",
            orientation === "horizontal" &&
              type === "underline" &&
              "relative before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border-secondary",
            typeof className === "function" ? className(state) : className,
          )
        }
      >
        {children ?? ((item) => <Tab {...item}>{item.children}</Tab>)}
      </AriaTabList>
    </TabListContext.Provider>
  );
};

export const TabPanel = (props: ComponentPropsWithRef<typeof AriaTabPanel>) => (
  <AriaTabPanel
    {...props}
    className={(state) =>
      cx(
        "outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
        typeof props.className === "function"
          ? props.className(state)
          : props.className,
      )
    }
  />
);

export const Tab = (props: TabComponentProps) => {
  const { label, children, badge, badgeColor, ...otherProps } = props;
  const {
    size = "sm",
    type = "button-brand",
    fullWidth,
  } = useContext(TabListContext);
  const tabType = (type ?? "button-brand") as TabVisualType;

  return (
    <AriaTab
      {...otherProps}
      className={(prop) =>
        cx(
          "z-10 flex h-max items-center justify-center gap-2 rounded-md whitespace-nowrap text-quaternary transition duration-100 ease-linear",
          prop.isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          "group-orientation-vertical:justify-start",
          fullWidth && "w-full flex-1",
          tabSizes[size][tabType as keyof (typeof tabSizes)["sm"]],
          getTabStyles(prop)[tabType],
          typeof props.className === "function"
            ? props.className(prop)
            : props.className,
        )
      }
    >
      {(state) => (
        <Fragment>
          {typeof children === "function" ? children(state) : children || label}
          {badge ? (
            <Badge
              size={size}
              type="pill-color"
              color={
                badgeColor ?? (getTabBadgeColor(state, tabType) as BadgeColors)
              }
              className={cx(
                "hidden transition-inherit-all md:flex",
                size === "sm" && "-my-px",
              )}
            >
              {badge}
            </Badge>
          ) : null}
        </Fragment>
      )}
    </AriaTab>
  );
};

export const Tabs = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof AriaTabs>) => (
  <AriaTabs
    keyboardActivation="manual"
    {...props}
    className={(state) =>
      cx(
        "flex w-full flex-col",
        typeof className === "function" ? className(state) : className,
      )
    }
  />
);

Tabs.Panel = TabPanel;
Tabs.List = TabList;
Tabs.Item = Tab;
