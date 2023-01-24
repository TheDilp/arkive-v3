import { DocumentType } from "./documentTypes";
import { BaseItemType } from "./generalTypes";

export type CardType = {
  id: string;
  sort: number;

  document: DocumentType;
  documentsId: string;

  sectionsId: string;
};

export type SectionType = {
  id: string;
  title: string;
  size: string;
  parentId: string;
  cards: CardType[];
};
export type DefaultSectionType = Pick<SectionType, "title" | "size">;

export interface ScreenType extends BaseItemType {
  id: string;
  title: string;
  sections: SectionType[];
}
export type ScreenCreateType = Partial<Omit<ScreenType, "project_id">>;
export type DefaultScreenType = Pick<ScreenType, "title" | "project_id">;
