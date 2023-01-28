/* eslint-disable no-use-before-define */
import { BaseItemType } from "../generalTypes";

export type WordType = {
  id: string;
  title: string;
  translation: string;
  language: DictionaryType;
};

export interface DictionaryType extends BaseItemType {
  words: WordType[];
}

export type DictionaryCreateType = Partial<Omit<DictionaryType, "project_id">>;

export type DefaultDictionaryType = Pick<DictionaryType, "title" | "project_id">;
