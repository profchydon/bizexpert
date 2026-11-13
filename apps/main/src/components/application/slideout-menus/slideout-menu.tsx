"use client";

import {
  type ComponentPropsWithRef,
  type ReactNode,
  type RefAttributes,
  createContext,
  useContext,
} from "react";
import { DotsGrid } from "@untitledui/icons";
import type {
  DialogProps as AriaDialogProps,
  ModalOverlayProps as AriaModalOverlayProps,
  ModalRenderProps as AriaModalRenderProps,
} from "react-aria-components";
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { CloseButton } from "@/components/base/buttons/close-button";
import { useSlideoutResize } from "@/hooks/useSlideoutResize";
import { SLIDEOUT_MENU_OVERLAY_CLASS } from "@/utils/drawerOverlayStacking";
import { cx } from "@/utils/cx";

type ResizeHandlers = {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
};
type SlideoutCtx = {
  resize: ResizeHandlers;
  isEntering?: boolean;
  isExiting?: boolean;
};
const Ctx = createContext<SlideoutCtx | null>(null);

interface ModalOverlayProps
  extends AriaModalOverlayProps, RefAttributes<HTMLDivElement> {}

export const ModalOverlay = (props: ModalOverlayProps) => (
  <AriaModalOverlay
    {...props}
    className={(state) =>
      cx(
        "fixed inset-0 flex min-h-dvh w-full items-stretch justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10",
        SLIDEOUT_MENU_OVERLAY_CLASS,
        state.isEntering && "duration-300 animate-in fade-in",
        state.isExiting && "duration-500 animate-out fade-out",
        typeof props.className === "function"
          ? props.className(state)
          : props.className,
      )
    }
  />
);
ModalOverlay.displayName = "ModalOverlay";

interface ModalProps
  extends AriaModalOverlayProps, RefAttributes<HTMLDivElement> {}

export const Modal = ({ children, ...props }: ModalProps) => (
  <AriaModal
    {...props}
    className={(state) =>
      cx(
        "relative inset-y-0 right-0 h-full shrink-0 overflow-visible shadow-xl transition",
        state.isEntering && "duration-300 animate-in slide-in-from-right",
        state.isExiting && "duration-500 animate-out slide-out-to-right",
        typeof props.className === "function"
          ? props.className(state)
          : props.className,
      )
    }
  >
    {children}
  </AriaModal>
);
Modal.displayName = "Modal";

interface DialogProps extends AriaDialogProps, RefAttributes<HTMLElement> {}

export const Dialog = ({ children, ...props }: DialogProps) => {
  const ctx = useContext(Ctx);
  return (
    <AriaDialog
      role="dialog"
      {...props}
      className={cx(
        "relative flex size-full w-full flex-col overflow-visible bg-primary ring-1 ring-secondary_alt outline-hidden",
        props.className,
      )}
    >
      {(renderProps) => (
        <>
          <div
            className="absolute top-1/2 left-0 z-10 hidden -translate-x-full -translate-y-1/2 cursor-col-resize touch-none md:block"
            data-slideout-handle
            data-ready={(!ctx?.isEntering && !ctx?.isExiting) || undefined}
            onPointerDown={ctx?.resize.onPointerDown}
            onPointerMove={ctx?.resize.onPointerMove}
            onPointerUp={ctx?.resize.onPointerUp}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-8 w-5 items-center justify-center rounded-l-lg border border-r-0 border-secondary bg-primary shadow-md">
              <DotsGrid className="size-3.5 text-quaternary" />
            </div>
          </div>
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            {typeof children === "function" ? children(renderProps) : children}
          </div>
        </>
      )}
    </AriaDialog>
  );
};
Dialog.displayName = "Dialog";

interface SlideoutMenuProps
  extends
    Omit<AriaModalOverlayProps, "children">,
    RefAttributes<HTMLDivElement> {
  children:
    | ReactNode
    | ((children: AriaModalRenderProps & { close: () => void }) => ReactNode);
  dialogClassName?: string;
  ariaLabel?: string;
  resizeOptions?: { min?: number; max?: number; initial?: number };
}

const Menu = ({
  children,
  dialogClassName,
  ariaLabel = "Detail panel",
  resizeOptions,
  ...props
}: SlideoutMenuProps) => {
  const resize = useSlideoutResize(resizeOptions);
  return (
    <ModalOverlay
      {...props}
      data-slideout-resizable
      style={{ "--slideout-width": `${resize.width}px` } as React.CSSProperties}
    >
      <Modal
        style={{ width: resize.width, maxWidth: resize.width }}
        className={(state) =>
          cx(
            typeof props.className === "function"
              ? props.className(state)
              : props.className,
          )
        }
      >
        {(state) => (
          <Ctx.Provider
            value={{
              resize: resize.handlers,
              isEntering: state.isEntering,
              isExiting: state.isExiting,
            }}
          >
            <Dialog
              aria-label={ariaLabel}
              className={dialogClassName}
              data-testid="slideout-menu-dialog"
            >
              {({ close }) =>
                typeof children === "function"
                  ? children({ ...state, close })
                  : children
              }
            </Dialog>
          </Ctx.Provider>
        )}
      </Modal>
    </ModalOverlay>
  );
};
Menu.displayName = "SlideoutMenu";

const Content = ({ role = "main", ...props }: ComponentPropsWithRef<"div">) => {
  return (
    <div
      role={role}
      {...props}
      className={cx(
        "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-auto px-4 pt-6 pb-6 md:px-6",
        props.className,
      )}
    />
  );
};
Content.displayName = "SlideoutContent";

interface SlideoutHeaderProps extends ComponentPropsWithRef<"header"> {
  onClose?: () => void;
}

const Header = ({
  className,
  children,
  onClose,
  ...props
}: SlideoutHeaderProps) => {
  return (
    <header
      {...props}
      className={cx(
        "relative z-1 w-full shrink-0 px-4 pt-6 md:px-6",
        className,
      )}
    >
      {children}
      <CloseButton
        size="md"
        className="absolute top-3 right-3 shrink-0"
        onClick={onClose}
      />
    </header>
  );
};
Header.displayName = "SlideoutHeader";

const Footer = (props: ComponentPropsWithRef<"footer">) => {
  return (
    <footer
      {...props}
      className={cx(
        "w-full shrink-0 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
        props.className,
      )}
    />
  );
};
Footer.displayName = "SlideoutFooter";

const SlideoutMenu = Object.assign(Menu, {
  displayName: "SlideoutMenu",
  Trigger: AriaDialogTrigger,
  Content,
  Header,
  Footer,
});

export { SlideoutMenu };
