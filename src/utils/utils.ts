import { NodeModel } from "@minoru/react-dnd-treeview";
import React, { useEffect } from "react";
import { toast, ToastOptions } from "react-toastify";
const defaultToastConfig: ToastOptions = {
  autoClose: 1250,
  theme: "dark",
};
export const toastSuccess = (message: string) =>
  toast.success(message, defaultToastConfig);
export const toastError = (message: string) =>
  toast.error(message, defaultToastConfig);
export const toastWarn = (message: string) =>
  toast.warn(message, defaultToastConfig);
// Filter autocomplete for categories
export const searchCategory = (
  event: any,
  categories: string[],
  setFilteredCategories: (categories: string[]) => void
) => {
  setTimeout(() => {
    let _filteredCategories;
    if (!event.query.trim().length) {
      _filteredCategories = [...categories];
    } else {
      _filteredCategories = categories.filter((category) => {
        return category.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }

    setFilteredCategories(_filteredCategories);
  }, 250);
};
// Get depth of node in tree in editor view
export const getDepth = (
  tree: NodeModel[],
  id: number | string,
  depth = 0
): number => {
  const target: NodeModel | undefined = tree.find((node) => node.id === id);

  if (target) {
    return getDepth(tree, target.parent, depth + 1);
  }

  return depth;
};
// Custom hook for detecting if user clicked outside of element (ref)
export function useOnClickOutside(ref: any, handler: (event: any) => void) {
  useEffect(
    () => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}
