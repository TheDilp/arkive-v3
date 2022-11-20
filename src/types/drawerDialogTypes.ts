import { AvailableItemTypes } from "./generalTypes";

export type DrawerAtomType = {
  id: null | string;
  type: null | AvailableItemTypes;
  drawerSize?: "sm" | "md" | "lg";
  position?: "left" | "right" | "top" | "bottom";
  modal?: boolean;
  fullscreen?: boolean;
  exceptions: {
    fromTemplate?: boolean;
    createTemplate?: boolean;
  };
  show: boolean;
};
