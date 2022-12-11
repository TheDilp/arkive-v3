import { DefaultBoardType, DefaultEdgeType, DefaultNodeType } from "../../types/boardTypes";

export const DefaultBoard: DefaultBoardType = {
  title: "",
  folder: false,
  public: false,
  expanded: false,
  sort: 0,
  parent: null,
  tags: [],
  defaultNodeColor: "#595959",
  defaultEdgeColor: "#595959",
};

export const DefaultEdge: DefaultEdgeType = {
  id: "",
  parent: "",
  curveStyle: "straight",
  lineColor: "#595959",
  lineStyle: "solid",
  fontColor: "#ffffff",
  fontFamily: "Lato",
  fontSize: 16,
  controlPointDistances: -100,
  controlPointWeights: 0.5,
  taxiDirection: "auto",
  taxiTurn: 50,
  targetArrowShape: "triangle",
  zIndex: 1,
};
export const DefaultNode: DefaultNodeType = {
  id: "",
  parent: "",
  width: 50,
  height: 50,
  x: 0,
  y: 0,
  type: "rectangle",
  fontSize: 16,
  fontColor: "#ffffff",
  fontFamily: "Lato",
  textHAlign: "center",
  textVAlign: "top",
  backgroundColor: "#595959",
  backgroundOpacity: 1,
  locked: false,
  template: false,
  zIndex: 1,
};
export const ColorPresets = [
  "000000",
  "1E1E1E",
  "121212",
  "690707",
  "392E3A",
  "304233",
  "9D0208",
  "6A4C93",
  "4E4E56",
  "2C6E49",
  "D90429",
  "595959",
  "1982C4",
  "DA635D",
  "F45B69",
  "FF595E",
  "43AA8B",
  "8AC926",
  "8B9766",
  "FFBA08",
  "669BBC",
  "F4A261",
  "FFCA3A",
  "F4D03F",
  "B1938B",
  "FFD6FF",
  "F5DFBB",
  "DCD0C0",
  "F7F7F7",
  "FFFFFF",
];

export const cytoscapeStylesheet = [
  // Nodes in general
  {
    selector: "node[classes]",
    style: {
      shape: "data(type)",
      width: "data(width)",
      height: "data(height)",
      "font-size": "data(fontSize)",
      "font-family": "data(fontFamily)",
      label: "data(label)",
      color: "data(fontColor)",
      "text-outline-color": "black",
      "text-outline-width": "2px",
      "background-image": "data(backgroundImage)",
      "background-fit": "cover",
      "background-clip": "node",
      "background-color": "data(backgroundColor)",
      "background-opacity": "data(backgroundOpacity)",
      "text-halign": "data(textHAlign)",
      "text-valign": "data(textVAlign)",
      "text-wrap": "wrap",
      "text-max-width": "data(width)",
      "z-index": "data(zIndex)",
      "z-index-compare": "data(zIndexCompare)",
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
  // Edges in general
  {
    selector: "edge[classes]",
    style: {
      label: "data(label)",
      color: "data(fontColor)",
      "font-family": "data(fontFamily)",
      "font-size": "data(fontSize)",
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
      "z-index": "data(zIndex)",
      "z-index-compare": "manual",
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
    selector: ":selected",
    style: {
      "overlay-color": "green",
      "overlay-padding": 5,
      "overlay-opacity": 0.5,
      "line-color": "green",
      "target-arrow-color": "green",
    },
  },

  {
    selector: "node[classes != 'boardNode publicBoardNode']:locked, edge[classes != 'boardEdge publicBoardEdge']:locked",
    style: {
      "underlay-color": "red",
      "underlay-padding": 2,
      "underlay-opacity": 0.25,
      "border-opacity": 0.25,
    },
  },
  {
    selector: ":grabbed",
    style: {
      "line-color": "green",
      "target-arrow-color": "green",
      "overlay-color": "lightgreen",
    },
  },
  {
    selector: ".incomingEdgeHighlight",
    style: {
      "target-arrow-shape": "triangle-backcurve",
      "target-arrow-color": "blue",
      "line-color": "blue",
      "line-style": "dotted",
      "line-dash-pattern": [5, 10],
      "curve-style": "straight",
    },
  },
  {
    selector: ".incomingNodeHighlight",
    style: {
      "border-width": 4,
      "border-color": "blue",
      padding: "15px",
    },
  },
  {
    selector: ".outgoingEdgeHighlight",
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
    selector: ".outgoingNodeHighlight",
    style: {
      "border-width": 4,
      "border-color": "cyan",
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
