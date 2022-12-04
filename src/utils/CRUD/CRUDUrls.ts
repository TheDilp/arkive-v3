import { baseURLS, createURLS, deleteURLs, getURLS, updateURLs } from "../../types/CRUDenums";
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
  if (type === "map_layers") return `${baseURLS.baseServer}${createURLS.createMapLayer}`;
  return null;
};
export const updateURL = (id: string, type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${updateURLs.updateDocument}${id}`;
  if (type === "maps") return `${baseURLS.baseServer}${updateURLs.updateMap}${id}`;
  if (type === "map_pins") return `${baseURLS.baseServer}${updateURLs.updateMapPin}${id}`;
  if (type === "map_layers") return `${baseURLS.baseServer}${updateURLs.updateMapLayer}${id}`;
  return null;
};

export const deleteURL = (id: string, type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${deleteURLs.deleteDocument}${id}`;
  if (type === "maps") return `${baseURLS.baseServer}${deleteURLs.deleteMap}${id}`;
  if (type === "map_pins") return `${baseURLS.baseServer}${deleteURLs.deleteMapPin}${id}`;
  if (type === "map_layers") return `${baseURLS.baseServer}${deleteURLs.deleteMapLayer}${id}`;
  return null;
};
