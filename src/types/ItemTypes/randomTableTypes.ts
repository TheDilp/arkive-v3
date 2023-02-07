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
  random_table_options: RandomTableOptionType[];
}

export type RandomTableCreateType = CreateType<RandomTableType>;
export type RandomTableOptionCreateType = Partial<RandomTableOptionType>;

export type DefaultRandomTableType = Pick<RandomTableType, "title" | "project_id">;
export type DefaultRandomTableOptionType = Pick<RandomTableOptionType, "title" | "description">;
