/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {
  autoPlacement,
  autoUpdate,
  inline,
  offset,
  Placement,
  safePolygon,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { cloneElement, useState } from "react";

interface Props {
  allowedPlacements?: Placement[];
  content: string | JSX.Element | null;
  children: JSX.Element;
  disabled?: boolean;
  isClickable?: boolean;
  closeOnClick?: boolean;
  customOffset?: { mainAxis?: number; crossAxis?: number };
}

export function Tooltip({ allowedPlacements, children, content, disabled, isClickable, closeOnClick, customOffset }: Props) {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [inline(), autoPlacement({ allowedPlacements }), offset(customOffset)],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled: !isClickable ?? true,
      handleClose: safePolygon(),
      delay: {
        open: 500,
      },
    }),
    useClick(context, {
      enabled: isClickable || false,
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
          onClick={() => {
            if (closeOnClick) {
              setOpen((prev) => !prev);
            }
          }}
          onKeyDown={() => {}}
          role="tooltip"
          tabIndex={-1}
          {...getFloatingProps({
            ref: floating,
            className: "Tooltip",
            style: {
              position: "fixed",
              top: y ?? "",
              left: x ?? "",
              zIndex: 9999,
            },
          })}>
          {content}
        </div>
      )}
    </>
  );
}
