import { baseURLS, createURLS, deleteURLs, getURLS, updateURLs } from "../../types/CRUDenums";
import { AllAvailableTypes, AvailableItemTypes } from "../../types/generalTypes";

export const getURL = (project_id: string, type: AvailableItemTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${getURLS.getAllDocuments}${project_id}`;
  if (type === "maps") return `${baseURLS.baseServer}${getURLS.getAllMaps}${project_id}`;
  if (type === "boards") return `${baseURLS.baseServer}${getURLS.getAllBoards}${project_id}`;
  if (type === "screens") return `${baseURLS.baseServer}${getURLS.getAllScreens}${project_id}`;
  if (type === "dictionaries") return `${baseURLS.baseServer}${getURLS.getAllDictionaries}${project_id}`;
  return null;
};
export const getSingleURL = (type: AvailableItemTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${getURLS.getSingleDocument}`;
  if (type === "maps") return `${baseURLS.baseServer}${getURLS.getSingleMap}`;
  if (type === "boards") return `${baseURLS.baseServer}${getURLS.getSingleBoard}`;
  if (type === "screens") return `${baseURLS.baseServer}${getURLS.getSingleScreen}`;
  if (type === "dictionaries") return `${baseURLS.baseServer}${getURLS.getSingleDictionary}`;

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
  if (type === "screens") return `${baseURLS.baseServer}${createURLS.createScreen}`;
  if (type === "sections") return `${baseURLS.baseServer}${createURLS.createSection}`;
  if (type === "cards") return `${baseURLS.baseServer}${createURLS.createCard}`;
  if (type === "dictionaries") return `${baseURLS.baseServer}${createURLS.createDictionary}`;
  if (type === "words") return `${baseURLS.baseServer}${createURLS.createWord}`;
  return null;
};
export const updateURL = (type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${updateURLs.updateDocument}`;
  if (type === "maps") return `${baseURLS.baseServer}${updateURLs.updateMap}`;
  if (type === "boards") return `${baseURLS.baseServer}${updateURLs.updateBoard}`;
  if (type === "map_pins") return `${baseURLS.baseServer}${updateURLs.updateMapPin}`;
  if (type === "map_layers") return `${baseURLS.baseServer}${updateURLs.updateMapLayer}`;
  if (type === "nodes") return `${baseURLS.baseServer}${updateURLs.updateNode}`;
  if (type === "edges") return `${baseURLS.baseServer}${updateURLs.updateEdge}`;
  if (type === "screens") return `${baseURLS.baseServer}${updateURLs.updateScreen}`;
  if (type === "sections") return `${baseURLS.baseServer}${updateURLs.updateSection}`;
  if (type === "cards") return `${baseURLS.baseServer}${updateURLs.updateCard}`;
  if (type === "words") return `${baseURLS.baseServer}${updateURLs.updateWord}`;
  return null;
};

export const deleteURL = (type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${deleteURLs.deleteDocument}`;
  if (type === "maps") return `${baseURLS.baseServer}${deleteURLs.deleteMap}`;
  if (type === "map_pins") return `${baseURLS.baseServer}${deleteURLs.deleteMapPin}`;
  if (type === "map_layers") return `${baseURLS.baseServer}${deleteURLs.deleteMapLayer}`;
  if (type === "boards") return `${baseURLS.baseServer}${deleteURLs.deleteBoard}`;
  if (type === "nodes") return `${baseURLS.baseServer}${deleteURLs.deleteNode}`;
  if (type === "edges") return `${baseURLS.baseServer}${deleteURLs.deleteEdge}`;
  if (type === "screens") return `${baseURLS.baseServer}${deleteURLs.deleteScreen}`;
  if (type === "sections") return `${baseURLS.baseServer}${deleteURLs.deleteSection}`;
  if (type === "cards") return `${baseURLS.baseServer}${deleteURLs.deleteCard}`;
  if (type === "words") return `${baseURLS.baseServer}${deleteURLs.deleteWord}`;
  return null;
};

export const sortURL = (type: AllAvailableTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${updateURLs.sortDocuments}`;
  if (type === "maps") return `${baseURLS.baseServer}${updateURLs.sortMaps}`;
  if (type === "boards") return `${baseURLS.baseServer}${updateURLs.sortBoards}`;
  if (type === "screens") return `${baseURLS.baseServer}${updateURLs.sortScreens}`;
  if (type === "sections") return `${baseURLS.baseServer}${updateURLs.sortSections}`;
  if (type === "cards") return `${baseURLS.baseServer}${updateURLs.sortCards}`;
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
  if (type === "sections") return `${baseURLS.baseServer}deletemanysections`;
  return null;
};

export const getImageLink = (image: string) => {
  return `${baseURLS.baseImageHost}${image}`;
};

export const getMapImageLink = (image: string) => {
  return `${baseURLS.baseImageHost}${image}`;
};
