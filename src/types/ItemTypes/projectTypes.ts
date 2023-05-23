import { PermissionAccessLevels, PermissionCategoriesType } from "../generalTypes";
import { RoleType, UserType } from "../userTypes";
import { BoardType } from "./boardTypes";
import { CalendarType } from "./calendarTypes";
import { DictionaryType } from "./dictionaryTypes";
import { DocumentType } from "./documentTypes";
import { MapType } from "./mapTypes";
import { RandomTableType } from "./randomTableTypes";
import { ScreenType } from "./screenTypes";
import { TimelineType } from "./timelineTypes";

export type SwatchType = {
  id: string;
  title?: string;
  color: string;
};

export type PermissionType = {
  id: string;
  role: RoleType;
  role_id: String;
  resource_type: PermissionCategoriesType;
  resource_id?: string;
  permission: PermissionAccessLevels;
};

export type ProjectType = {
  id: string;
  title: string;
  image?: string;
  owner_id: string;
  members: UserType[];
  permissions: PermissionType[];
  swatches: SwatchType[];
};

export interface ProjectDetails {
  id: string;
  title: string;
  image: string | null;
  owner: UserType;
  members: { member: UserType; user_id: string }[];
  _count: {
    documents: number;
    maps: number;
    boards: number;
    calendars: number;
    timelines: number;
    screens: number;
    dictionaries: number;
    random_tables: number;
  };
  documents: DocumentType[];
  maps: MapType[];
  boards: BoardType[];
  calendars: CalendarType[];
  timelines: TimelineType[];
  screens: ScreenType[];
  dictionaries: DictionaryType[];
  random_tables: RandomTableType[];
}
