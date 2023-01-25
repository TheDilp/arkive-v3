import { DocumentType } from "./documentTypes";
import { BaseItemType } from "./generalTypes";

export type CardType = {
  id: string;
  sort: number;
  expanded: boolean;

  document: DocumentType;
  documentsId: string;

  parentId: string;
};
export type CardCreateType = Partial<Omit<CardType, "cards" | "parentId">> & { id: string; parentId: string };
export type DefaultCardType = Pick<CardType, "id" | "parentId">;

export type SectionType = {
  id: string;
  title: string;
  size: string;
  parentId: string;
  cards: CardType[];
};
export type SectionCreateType = Partial<Omit<SectionType, "cards" | "parentId">> & { id: string; parentId: string };
export type DefaultSectionType = Pick<SectionType, "id" | "parentId" | "title" | "size">;

export interface ScreenType extends BaseItemType {
  id: string;
  title: string;
  sections: SectionType[];
}
export type ScreenCreateType = Partial<Omit<ScreenType, "project_id">>;
export type DefaultScreenType = Pick<ScreenType, "title" | "project_id">;
