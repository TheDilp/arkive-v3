import {
  autoPlacement,
  autoUpdate,
  inline,
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react-dom-interactions";
import { cloneElement, useState } from "react";

interface Props {
  label: string | JSX.Element;
  children: JSX.Element;
  disabled?: boolean;
}

export function Tooltip({ children, label, disabled }: Props) {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [inline(), autoPlacement()],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      handleClose: safePolygon(),
      delay: {
        open: 500,
      },
    }),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
      {!disabled && open && (
        <div
          {...getFloatingProps({
            ref: floating,
            className: "Tooltip",
            style: {
              width: "30rem",
              position: "fixed",
              top: y ?? "",
              left: x ?? "",
              zIndex: 9999,
            },
          })}>
          {label}
        </div>
      )}
    </>
  );
}
