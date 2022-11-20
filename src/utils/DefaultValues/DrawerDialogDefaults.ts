import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { DialogAtomType } from "../Atoms/atoms";

export const DefaultDrawer: DrawerAtomType = {
  drawerSize: "sm",
  exceptions: {},
  fullscreen: false,
  id: null,
  modal: false,
  position: "left",
  show: false,
  type: null,
};
export const DefaultDialog: DialogAtomType = {
  fullscreen: false,
  id: null,
  modal: false,
  position: "left",
  show: false,
  type: null,
};
