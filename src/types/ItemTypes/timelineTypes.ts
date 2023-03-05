import { BaseItemType } from "../generalTypes";

export interface TimelineType extends BaseItemType {
  id: string;
  title: string;

  parent?: TimelineType;
}
