import { NodeModel } from "@minoru/react-dnd-treeview";
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
export const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

export const passwordRegex =
  /"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"/g;

export const boardNodeShapes = [
  "ellipse",
  "triangle",
  "round-triangle",
  "rectangle",
  "round-rectangle",
  "bottom-round-rectangle",
  "cut-rectangle",
  "barrel",
  "rhomboid",
  "diamond",
  "round-diamond",
  "pentagon",
  "round-pentagon",
  "hexagon",
  "round-hexagon",
  "concave-hexagon",
  "heptagon",
  "round-heptagon",
  "octagon",
  "round-octagon",
  "star",
];
export const boardNodeFontSizes = [
  10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46,
  48, 50, 52, 54, 56, 58, 60,
];

export const edgehandlesSettings = {
  canConnect: function (sourceNode: any, targetNode: any) {
    // whether an edge can be created between source and target
    return !sourceNode.same(targetNode); // e.g. disallow loops
  },
  edgeParams: function (sourceNode: any, targetNode: any) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    return {
      class: "eh-ghost-edge",
      data: {
        source: sourceNode.id(),
        target: targetNode.id(),
        label: " ",
        tags: [],
        style: {
          lineColor: "#ffffff",
          lineStyle: "solid",
          curveStyle: "straight",
        },
      },
    };
  },
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
};
