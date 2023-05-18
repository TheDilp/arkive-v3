import { BoardType, NodeType } from "./boardTypes";
import { EventType } from "./calendarTypes";
import { DictionaryType, WordType } from "./dictionaryTypes";
import { MapPinType, MapType } from "./mapTypes";

export type EntityFieldType = {
  id: string;
  title: string;
  type: string;
  entity_id: string;
  options: string[];
};
export type EntityType = {
  id: string;
  title: string;
  description?: string;
  fields: EntityFieldType[];
};

export type FieldValueType = {
  id: string;

  field_id: string;
  value: string;

  documents: DocumentType[];
  maps: MapType[];
  map_pins: MapPinType[];
  boards: BoardType[];
  nodes: NodeType[];
  events: EventType[];
  dictionaries: DictionaryType[];
  words: WordType[];
};

export type EntityInstanceType = {
  id: string;
  entity_id: string;
  field_values: FieldValueType[];
};
