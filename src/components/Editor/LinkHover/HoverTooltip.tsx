import { cloneElement, useState } from "react";
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss,
  autoPlacement,
  inline,
  safePolygon,
} from "@floating-ui/react-dom-interactions";

interface Props {
  label: string | JSX.Element;
  placement?: Placement;
  children: JSX.Element;
}

export const HoverTooltip = ({
  children,
  label,
  placement = "right",
}: Props) => {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [inline(), autoPlacement()],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      handleClose: safePolygon(),
    }),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context, {
      outsidePointerDown: true,
    }),
  ]);

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: reference, ...children.props })
      )}
      {open && (
        <div
          {...getFloatingProps({
            ref: floating,
            className: "Tooltip",
            style: {
              width: "30rem",
              position: "fixed",
              top: y ?? "",
              left: x ?? "",
              zIndex: 5555,
            },
          })}
        >
          {label}
        </div>
      )}
    </>
  );
};
