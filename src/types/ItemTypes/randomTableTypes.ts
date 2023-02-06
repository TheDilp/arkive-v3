import { BaseItemType } from "../generalTypes";

export type RandomTableOptionType = {
  id: string;
  title: string;
  description?: string;
  parentId: string;
  sort: number;
};

export interface RandomTableType extends BaseItemType {
  id: string;
  title: string;
  isShared: boolean;
}
