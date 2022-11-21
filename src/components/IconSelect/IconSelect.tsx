import React, { cloneElement, useMemo, useState } from "react";
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useClick,
  FloatingFocusManager,
} from "@floating-ui/react-dom-interactions";
import { mergeRefs } from "react-merge-refs";
import { v4 } from "uuid";
import IconSelectList from "./IconSelectList";
import { IconSelectMenuType } from "../../types/generalTypes";

interface Props {
  placement?: Placement;
  children: JSX.Element;
  disabled?: boolean;
  setIcon: (newIcon: string) => void;
}

export const IconSelect = ({ children, setIcon, placement, disabled }: Props) => {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, strategy, context } = useFloating({
    middleware: [offset(5), flip(), shift()],
    onOpenChange: setOpen,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  });

  const id = v4();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context, {
      enabled: !disabled,
    }),
    useRole(context),
    useDismiss(context),
  ]);

  // Preserve the consumer's ref
  const ref = useMemo(() => mergeRefs([reference, (children as any).ref]), [reference, children]);

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref, ...children.props }))}
      {open && (
        <FloatingFocusManager context={context} modal={false} order={["reference", "content"]} returnFocus={false}>
          <div
            ref={floating}
            className="p-0 z-50 rounded"
            style={{
              left: x ?? 0,
              position: strategy,
              top: y ?? 0,
            }}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            {...getFloatingProps()}>
            <IconSelectList close={() => setOpen(false)} setIcon={setIcon} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};
