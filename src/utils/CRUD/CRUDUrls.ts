import { baseURLS, createURLS, getURLS, updateURLs } from "../../types/CRUDenums";
import { AllAvailableTypes, AvailableItemTypes } from "../../types/generalTypes";

export const getURL = (project_id: string, type: AvailableItemTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${getURLS.getAllDocuments}${project_id}`;
  if (type === "maps") return `${baseURLS.baseServer}${getURLS.getAllMaps}${project_id}`;
  return null;
};
export const createURL = (type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${createURLS.createDocument}`;
  if (type === "maps") return `${baseURLS.baseServer}${createURLS.createMap}`;
  if (type === "map_pins") return `${baseURLS.baseServer}${createURLS.createMapPin}`;
  return null;
};
export const updateURL = (id: string, type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${updateURLs.updateDocument}${id}`;
  if (type === "maps") return `${baseURLS.baseServer}${updateURLs.updateMap}${id}`;
  return null;
};
