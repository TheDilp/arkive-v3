import { AllAvailableTypes, AvailableItemTypes } from "./generalTypes";

export type DrawerAtomType = {
  id: null | string;
  type: null | AllAvailableTypes | "full_search" | "many_nodes" | "many_edges" | "mention" | "insert_word";
  drawerSize?: "sm" | "md" | "lg";
  position?: "left" | "right" | "top" | "bottom";
  modal?: boolean;
  fullscreen?: boolean;
  exceptions: {
    fromTemplate?: boolean;
    createTemplate?: boolean;
    eventDescription?: boolean;
  };
  data?: {
    [key: string]: any;
  };
  show: boolean;
};

export type DialogAtomType = {
  id: null | string;
  type: null | AvailableItemTypes;
  position?: "left" | "right" | "top" | "bottom";
  modal?: boolean;
  fullscreen?: boolean;
  show: boolean;
  data?: {
    [key: string]: any;
  };
};
