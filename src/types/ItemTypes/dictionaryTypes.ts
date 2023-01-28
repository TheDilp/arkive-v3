/* eslint-disable no-use-before-define */
import { BaseItemType } from "../generalTypes";

export type WordType = {
  id: string;
  title: string;
  description?: string;
  translation: string;
  dictionary: DictionaryType;
  parentId: string;
};
export type DefaultWordType = Pick<WordType, "title" | "parentId">;

export type WordCreateType = Partial<Omit<WordType, "parentId">>;

export interface DictionaryType extends BaseItemType {
  words: WordType[];
}

export type DictionaryCreateType = Partial<Omit<DictionaryType, "project_id">>;

export type DefaultDictionaryType = Pick<DictionaryType, "title" | "project_id">;
