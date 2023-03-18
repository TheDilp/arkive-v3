import { DefaultMapType } from "../../types/ItemTypes/mapTypes";
import { IconEnum } from "./GeneralDefaults";

export const DefaultMap: DefaultMapType = {
  expanded: false,
  folder: false,
  image: "",
  parentId: null,
  icon: IconEnum.map,
  isPublic: false,
  tags: [],
  title: "New Map",
};
