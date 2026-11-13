import * as React from "react";
import { cn } from "@/lib/utils";
import circle_icon from "@/assets/icons/circle_step_icon.svg";
import check_icon from "@/assets/icons/check_step_icon.svg";

const Timeline = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("flex flex-col pt-4  space-y-4", className)}
    {...props}
  />
));
Timeline.displayName = "Timeline";

const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("relative flex flex-col pt-0 [&>*]:mb-3", className)}
    {...props}
  />
));
TimelineItem.displayName = "TimelineItem";

const TimelineTime = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "absolute  top-[42px] left-[34px] flex items-center text-sm font-normal leading-none text-secondary-foreground",
      className,
    )}
    {...props}
  />
));
TimelineTime.displayName = "TimelineTime";

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute top-[17px] left-[11px] -translate-x-1/2 translate-y-2 h-14 w-1 bg-[#004CCC]",
      className,
    )}
    {...props}
  />
));
TimelineConnector.displayName = "TimelineConnector";

const TimelineConnect = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute top-[17px] left-[11px] -translate-x-1/2 translate-y-2 h-14 w-1 bg-[#EAECF0]",
      className,
    )}
    {...props}
  />
));
TimelineConnect.displayName = "TimelineConnect";

const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-x-3 pb-3 text-[#003999]", className)}
    {...props}
  />
));
TimelineHeader.displayName = "TimelineHeader";

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight text-secondary-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));
TimelineTitle.displayName = "CardTitle";

const TimelineIcon = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    alt=""
    src={circle_icon.src}
    className={cn("flex flex-col size-6", className)}
    {...props}
  />
));

TimelineIcon.displayName = "TimelineIcon";

const TimelineCheck = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    alt=""
    src={check_icon.src}
    className={cn("flex flex-col ", className)}
    {...props}
  />
));

TimelineIcon.displayName = "TimelineIcon";

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "absolute top-[21px] left-[34px] flex items-center text-sm max-w-sm text-[#004CCC]",
      className,
    )}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-row items-center gap-y-2", className)}
    {...props}
  />
));
TimelineContent.displayName = "TimelineContent";

export {
  Timeline,
  TimelineItem,
  TimelineConnect,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
  TimelineCheck,
};
