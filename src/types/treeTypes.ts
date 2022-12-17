import { DocumentType } from "./documentTypes";
import { AllAvailableTypes } from "./generalTypes";
import { MapLayerType, MapType } from "./mapTypes";

export type SidebarTreeItemType = {
  data?: null | Partial<DocumentType | MapType | MapLayerType>;
  type: null | AllAvailableTypes;
  folder: boolean;
  template: boolean;
};

export type SortIndexes = {
  id: string;
  parent: string | null;
  sort: number;
}[];
