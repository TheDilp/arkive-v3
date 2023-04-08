import { DefaultMapType } from "../../types/ItemTypes/mapTypes";
import { IconEnum } from "./GeneralDefaults";

export const DefaultMap: DefaultMapType = {
  folder: false,
  image: "",
  clusterPins: false,
  parentId: null,
  icon: IconEnum.map,
  isPublic: false,
  tags: [],
  title: "New Map",
};
