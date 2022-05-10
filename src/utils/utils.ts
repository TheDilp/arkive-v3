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
export const boardEdgeCurveStyles = [
  "unbundled-bezier",
  "taxi",
  "straight-triangle",
  "straight",
];
export const boardEdgeLineStyles = ["solid", "dashed", "dotted"];

export const boardEdgeTaxiDirections = [
  "auto",
  "vertical",
  "horizontal",
  "upward",
  "downward",
  "leftward",
  "rightward",
];
export const edgeTargetArrowShapes = [
  {
    label: "Triangle",
    value: "triangle",
  },
  {
    label: "Triangle-tee",
    value: "triangle-tee",
  },
  {
    label: "Triangle-cross",
    value: "triangle-cross",
  },
  {
    label: "Triangle-backcurve",
    value: "triangle-backcurve",
  },
  {
    label: "Circle-triangle",
    value: "circle-triangle",
  },
  {
    label: "Vee",
    value: "vee",
  },
  {
    label: "Tee",
    value: "tee",
  },
  {
    label: "Circle",
    value: "circle",
  },
  {
    label: "Diamond",
    value: "diamond",
  },
  {
    label: "Chevron",
    value: "chevron",
  },
  {
    label: "None",
    value: "none",
  },
];
export const boardNodeFontSizes = [
  10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46,
  48, 50, 52, 54, 56, 58, 60,
];
export const edgehandlesSettings = {
  canConnect: function (sourceNode: any, targetNode: any) {
    return (
      !sourceNode.outgoers().includes(targetNode) &&
      !sourceNode.same(targetNode)
    );
    // whether an edge can be created between source and target
    // e.g. disallow loops
  },
  edgeParams: function (sourceNode: any, targetNode: any) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    return {
      class: "eh-ghost-edge",
      data: {
        source: sourceNode.id(),
        target: targetNode.id(),
        curveStyle: "straight",
        lineStyle: "solid",
        lineColor: "#1e1e1e",
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
export const cytoscapeStylesheet = [
  {
    selector: "node[classes]",
    style: {
      shape: "data(type)",
      width: "data(width)",
      height: "data(height)",
      "font-size": "data(fontSize)",
      "font-family": "Lato",
      label: "data(label)",
      color: "white",
      "text-outline-color": "black",
      "text-outline-width": "2px",
      "background-image": "data(backgroundImage)",
      "background-fit": "cover",
      "background-clip": "node",
      "background-color": "data(backgroundColor)",
      "text-halign": "data(textHAlign)",
      "text-valign": "data(textVAlign)",
    },
  },
  {
    selector: "node[class = '.eh-presumptive-target']",
    style: {
      shape: "rectangle",
      width: "50rem",
      height: "50rem",
      "font-size": "20rem",
      label: "TARGET",
      color: "white",
      "text-outline-color": "black",
      "text-outline-width": "2px",
      "overlay-color": "lightblue",
      "overlay-opacity": "0",
    },
  },
  {
    selector: ".eh-ghost-node",
    style: {
      shape: "square",
      width: "50",
      height: "50",
      "font-size": "16",
      label: "New Edge",
      color: "red",
      "text-outline-color": "black",
      "text-outline-width": "2px",
      "text-halign": "center",
      "text-valign": "top",
      opacity: 0,
    },
  },
  {
    // Edges in general
    selector: "edge[classes]",
    style: {
      label: "data(label)",
      color: "white",
      "text-outline-color": "black",
      "text-outline-width": "2px",
      "target-arrow-shape": "data(targetArrowShape)",
      "arrow-scale": 2,
      "target-arrow-color": "data(lineColor)",
      "line-color": "data(lineColor)",
      "line-style": "data(lineStyle)",
      "line-dash-pattern": [5, 10],
      "taxi-turn": "data(taxiTurn)",
      "taxi-direction": "data(taxiDirection)",
      "curve-style": "data(curveStyle)",
      "text-rotation": "autorotate",
      "control-point-distances": "data(controlPointDistances)",
      "control-point-weights": "data(controlPointWeights)",
    },
  },
  {
    selector: ".eh-ghost-edge",
    style: {
      "target-arrow-shape": "triangle-backcurve",
      "target-arrow-color": "cyan",
      "line-color": "cyan",
      "line-style": "solid",
      "line-dash-pattern": [5, 10],
      "curve-style": "straight",
      "taxi-turn": "100",
      "taxi-direction": "auto",
      label: "",
      "control-point-distances": "10",
      "control-point-weights": "0.5",
    },
  },
  {
    selector: ".eh-preview",
    style: {
      "target-arrow-shape": "triangle-backcurve",
      "target-arrow-color": "cyan",
      "line-color": "cyan",
      "line-style": "solid",
      "line-dash-pattern": [5, 10],
      "curve-style": "straight",
      "taxi-turn": "100",
      "taxi-direction": "auto",
      label: "",
      "control-point-distances": "10",
      "control-point-weights": "0.5",
    },
  },

  // Classes for highlighting
  {
    selector: ".edgeHighlight",
    style: {
      "target-arrow-shape": "triangle-backcurve",
      "target-arrow-color": "cyan",
      "line-color": "cyan",
      "line-style": "solid",
      "line-dash-pattern": [5, 10],
      "curve-style": "straight",
    },
  },
  {
    selector: ".nodeHighlight",
    style: {
      "background-image-opacity": 0,
      "background-color": "cyan",
      padding: "15px",
    },
  },
  {
    selector: ".selectedHighlight",
    style: {
      "background-image-opacity": 0,
      "background-color": "yellow",
    },
  },
];
