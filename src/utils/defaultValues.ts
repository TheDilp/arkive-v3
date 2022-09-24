// Default empty props for dialogs

import { NodeUpdateDialogType } from "../types/BoardTypes";

export const DocItemDisplayDialogDefault = {
  id: "",
  title: "",
  show: false,
  folder: false,
  depth: 0,
  template: false,
  parent: "",
};

export const BoardUpdateDialogDefault = {
  id: "",
  title: "",
  defaultNodeColor: "#595959",
  defaultEdgeColor: "#595959",
  parent: "",
  folder: false,
  depth: 0,
  show: false,
  showTemplates: false,
  expanded: false,
  public: false,
};

export const NodeUpdateDialogDefault: NodeUpdateDialogType = {
  id: "",
  label: "",
  type: "rectangle",
  doc_id: undefined,
  width: 50,
  height: 50,
  fontSize: 16,
  fontColor: "#ffffff",
  fontFamily: "Lato",
  customImage: { id: "", title: "", link: "", type: "Image" as const },
  textHAlign: "center" as const,
  textVAlign: "top" as const,
  backgroundColor: "#595959",
  backgroundOpacity: 1,
  zIndex: 1,
  show: false,
  template: false,
};

export const EdgeUpdateDialogDefault = {
  id: "",
  label: "",
  curveStyle: "straight",
  lineStyle: "solid",
  lineColor: "#595959",
  fontColor: "#ffffff",
  fontFamily: "Lato",
  fontSize: 16,
  controlPointDistances: 0,
  controlPointWeights: 0,
  taxiDirection: "auto",
  taxiTurn: 0,
  targetArrowShape: "triangle",
  zIndex: 1,
  show: false,
};

export const MapDialogDefault = {
  id: "",
  title: "",
  map_image: { id: "", title: "", link: "", type: "Image" as const },
  map_layers: [],
  parent: "",
  show: false,
  folder: false,
  depth: 0,
  public: false,
};
export const TimelineItemDisplayDialogDefault = {
  id: "",
  title: "",
  parent: "",
  show: false,
  folder: false,
  depth: 0,
  public: false,
  defaultOrientation: "horizontal" as const,
  defaultDetails: "detailed" as const,
};

export const MapMarkerDialogDefault = {
  id: "",
  text: "",
  icon: "mdi:user",
  color: "#ffffff",
  backgroundColor: "#000000",
  doc_id: undefined,
  map_link: undefined,
  public: true,
  show: false,
};

export const DocumentCreateDefault = {
  title: "New Document",
  folder: false,
  template: false,
  icon: "mdi:file",
  image: undefined,
  parent: null,
  content: null,
  categories: [],
};

export const MapCreateDefault = {
  id: "",
  title: "New Map",
  map_image: undefined,
  parent: undefined,
  sort: 999,
  folder: false,
  expanded: false,
};

export const TimelineCreateDefault = {
  expanded: false,
  public: false,
  timeline_events: [],
  timeline_ages: [],
  defaultDetails: "detailed" as const,
  defaultOrientation: "horizontal" as const,
};

export const TimelineEventCreateDefault = {
  id: "",
  timeline_id: "",
  title: "New Timeline Event",
  description: undefined,
  age: undefined,
  start_day: undefined,
  start_month: undefined,
  start_year: 0,
  end_day: undefined,
  end_month: undefined,
  end_year: 0,
  icon: "mdi:chart-timeline-variant",
  image: undefined,
  doc_id: undefined,
  map_id: undefined,
  eventBgColor: "#1e1e1e",
  styleType: "background" as const,
  public: false,
};
