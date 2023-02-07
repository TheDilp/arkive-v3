import { BaseItemType } from "../generalTypes";
import { CreateType } from "./utilTypes";

export type RandomTableOptionType = {
  id: string;
  title: string;
  description: string;
  parentId: string;
  sort: number;
};

export interface RandomTableType extends BaseItemType {
  id: string;
  title: string;
  description?: string;
  isShared: boolean;
}

export type RandomTableCreateType = CreateType<RandomTableType>;

export type DefaultRandomTableType = Pick<RandomTableType, "title" | "project_id">;
