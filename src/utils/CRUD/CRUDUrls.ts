import { baseURLS, createURLS, deleteURLs, getURLS, updateURLs } from "../../types/CRUDenums";
import { AllAvailableTypes, AvailableItemTypes } from "../../types/generalTypes";

export const getURL = (project_id: string, type: AvailableItemTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${getURLS.getAllDocuments}${project_id}`;
  if (type === "maps") return `${baseURLS.baseServer}${getURLS.getAllMaps}${project_id}`;
  if (type === "boards") return `${baseURLS.baseServer}${getURLS.getAllBoards}${project_id}`;
  return null;
};
export const createURL = (type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${createURLS.createDocument}`;
  if (type === "maps") return `${baseURLS.baseServer}${createURLS.createMap}`;
  if (type === "boards") return `${baseURLS.baseServer}${createURLS.createBoard}`;
  if (type === "map_pins") return `${baseURLS.baseServer}${createURLS.createMapPin}`;
  if (type === "map_layers") return `${baseURLS.baseServer}${createURLS.createMapLayer}`;
  if (type === "nodes") return `${baseURLS.baseServer}${createURLS.createNode}`;
  if (type === "edges") return `${baseURLS.baseServer}${createURLS.createEdge}`;
  return null;
};
export const updateURL = (id: string, type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${updateURLs.updateDocument}${id}`;
  if (type === "maps") return `${baseURLS.baseServer}${updateURLs.updateMap}${id}`;
  if (type === "boards") return `${baseURLS.baseServer}${updateURLs.updateBoard}${id}`;
  if (type === "map_pins") return `${baseURLS.baseServer}${updateURLs.updateMapPin}${id}`;
  if (type === "map_layers") return `${baseURLS.baseServer}${updateURLs.updateMapLayer}${id}`;
  if (type === "nodes") return `${baseURLS.baseServer}${updateURLs.updateNode}${id}`;
  if (type === "edges") return `${baseURLS.baseServer}${updateURLs.updateEdge}${id}`;
  return null;
};

export const deleteURL = (id: string, type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${deleteURLs.deleteDocument}${id}`;
  if (type === "maps") return `${baseURLS.baseServer}${deleteURLs.deleteMap}${id}`;
  if (type === "map_pins") return `${baseURLS.baseServer}${deleteURLs.deleteMapPin}${id}`;
  if (type === "map_layers") return `${baseURLS.baseServer}${deleteURLs.deleteMapLayer}${id}`;
  if (type === "nodes") return `${baseURLS.baseServer}${deleteURLs.deleteNode}${id}`;
  if (type === "edges") return `${baseURLS.baseServer}${deleteURLs.deleteEdge}${id}`;
  return null;
};

export const updateManyURL = (type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}updatemanydocuments`;
  if (type === "maps") return `${baseURLS.baseServer}updatemanymaps`;
  if (type === "boards") return `${baseURLS.baseServer}updatemanyboards`;
  if (type === "nodes") return `${baseURLS.baseServer}updatemanynodes`;
  if (type === "edges") return `${baseURLS.baseServer}updatemanyedges`;
  return null;
};
export const deleteManyURL = (type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}deletemanydocuments`;
  if (type === "maps") return `${baseURLS.baseServer}deletemanymaps`;
  if (type === "boards") return `${baseURLS.baseServer}deletemanyboards`;
  if (type === "nodes") return `${baseURLS.baseServer}deletemanynodes`;
  if (type === "edges") return `${baseURLS.baseServer}deletemanyedges`;
  return null;
};
