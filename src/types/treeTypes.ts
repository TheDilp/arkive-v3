import { AllAvailableTypes, AllItemsType, AllSubItemsType } from "./generalTypes";

export type SidebarTreeItemType = {
  data?: null | Partial<AllItemsType | AllSubItemsType>;
  type: null | AllAvailableTypes;
  folder: boolean;
  template: boolean;
};

export type SortIndexes = {
  id: string;
  parentId: string | null;
  sort: number;
}[];
