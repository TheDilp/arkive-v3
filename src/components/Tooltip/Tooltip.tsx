/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {
  autoPlacement,
  autoUpdate,
  inline,
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
  content: string | JSX.Element;
  children: JSX.Element;
  disabled?: boolean;
  isClickable?: boolean;
  closeOnClick?: boolean;
}

export function Tooltip({ children, content, disabled, isClickable, closeOnClick }: Props) {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [inline(), autoPlacement()],
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
        <span
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
        </span>
      )}
    </>
  );
}
