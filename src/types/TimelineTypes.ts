import { TimelineAgeType } from "./TimelineAgeTypes";
import { TimelineEventType } from "./TimelineEventTypes";

export type TimelineType = {
  id: string;
  title: string;
  project_id: string;
  folder: boolean;
  expanded: boolean;
  sort: number;
  public: boolean;
  timeline_events: TimelineEventType[];
  timeline_ages: TimelineAgeType[];
  defaultOrientation: "horizontal" | "vertical";
  defaultDetails: "detailed" | "simple";
  parent: { id: string; title: string } | null;
};

export type TimelineCreateType = {
  id: string;
  title: string;
  project_id: string;
  folder: boolean;
  parent: string | null;
  expanded: boolean;
};

export type TimelineUpdateType = {
  id: string;
  project_id: string;
  title?: string;
  expanded?: boolean;
  sort?: number;
  public?: boolean;
  parent?: string | null;
  defaultOrientation?: "horizontal" | "vertical";
  defaultDetails?: "detailed" | "simple";
};

export type TimelineItemDisplayDialogProps = {
  id: string;
  title: string;
  parent: string;
  folder: boolean;
  depth: number;
  public: boolean;
  show: boolean;
  defaultOrientation: "horizontal" | "vertical";
  defaultDetails: "detailed" | "simple";
};
