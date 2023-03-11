import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { cloneElement, useMemo, useState } from "react";
import { mergeRefs } from "react-merge-refs";

import IconSelectList from "./IconSelectList";

interface Props {
  children: JSX.Element;
  setIcon: (newIcon: string) => void;
  placement?: Placement;
  disabled?: boolean;
}

export function IconSelect({ children, setIcon, placement, disabled }: Props) {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, strategy, context } = useFloating({
    middleware: [offset(5), flip(), shift()],
    onOpenChange: setOpen,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  });

  const id = crypto.randomUUID();
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
            aria-describedby={descriptionId}
            aria-labelledby={labelId}
            className="z-50 rounded p-0"
            style={{
              left: x ?? 0,
              position: strategy,
              top: y ?? 0,
            }}
            {...getFloatingProps()}>
            <IconSelectList close={() => setOpen(false)} setIcon={setIcon} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}
