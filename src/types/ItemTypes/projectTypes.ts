/* eslint-disable no-use-before-define */
import { PermissionCategoriesType, RolePermissionsType } from "../generalTypes";
import { UserType } from "../userTypes";
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
  resource_type: PermissionCategoriesType;
  resource_id?: string;
  permission: RolePermissionsType;
};

export type ProjectType = {
  id: string;
  title: string;
  image?: string;
  owner_id: string;
  members: UserType[];
  permissions: PermissionType[];
  swatches: SwatchType[];
  roles: RoleType[];
};

export interface ProjectDetails {
  id: string;
  title: string;
  image: string | null;
  owner: UserType;
  members: UserType[];
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

export type RoleType = {
  id: string;
  title: string;
  description?: string;
  project: ProjectType;
  project_id: string;

  view_documents: boolean;
  edit_documents: boolean;
  view_maps: boolean;
  edit_maps: boolean;
  view_boards: boolean;
  edit_boards: boolean;
  view_calendars: boolean;
  edit_calendars: boolean;
  view_timelines: boolean;
  edit_timelines: boolean;
  view_screens: boolean;
  edit_screens: boolean;
  view_dictionaries: boolean;
  edit_dictionaries: boolean;
  view_random_tables: boolean;
  edit_random_tables: boolean;
  edit_tags: boolean;
  edit_alter_names: boolean;
  upload_assets: boolean;
  delete_assets: boolean;
};

export type RoleCreateType = Partial<RoleType> & { title: string; project_id: string };
