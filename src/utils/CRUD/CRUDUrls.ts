import { baseURLS, deleteURLs, getURLS, updateURLs } from "../../types/CRUDenums";
import { AllAvailableTypes, AvailableItemTypes } from "../../types/generalTypes";

export const getURL = (project_id: string, type: AvailableItemTypes) => {
  return `${baseURLS.baseServer}getall${type}/${project_id}`;
};
export const getSingleURL = (type: AvailableItemTypes) => {
  if (type === "documents") return `${baseURLS.baseServer}${getURLS.getSingleDocument}`;
  if (type === "maps") return `${baseURLS.baseServer}${getURLS.getSingleMap}`;
  if (type === "boards") return `${baseURLS.baseServer}${getURLS.getSingleBoard}`;
  if (type === "screens") return `${baseURLS.baseServer}${getURLS.getSingleScreen}`;
  if (type === "dictionaries") return `${baseURLS.baseServer}${getURLS.getSingleDictionary}`;
  if (type === "calendars") return `${baseURLS.baseServer}${getURLS.getSingleCalendar}`;
  if (type === "timelines") return `${baseURLS.baseServer}${getURLS.getSingleTimeline}`;
  if (type === "randomtables") return `${baseURLS.baseServer}${getURLS.getSingleRandomTable}`;

  return null;
};
export const createURL = (type: AllAvailableTypes) => {
  if (type !== "dictionaries") {
    const urlType = type;

    return `${baseURLS.baseServer}create${urlType.slice(0, -1).replace("_", "")}`; // Replace is for random_tables
  }
  return `${baseURLS.baseServer}createdictionary`;
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
  if (type === "calendars") return `${baseURLS.baseServer}${updateURLs.updateCalendar}`;
  if (type === "timelines") return `${baseURLS.baseServer}${updateURLs.updateTimeline}`;
  if (type === "eras") return `${baseURLS.baseServer}${updateURLs.updateEra}`;
  if (type === "months") return `${baseURLS.baseServer}${updateURLs.updateMonth}`;
  if (type === "events") return `${baseURLS.baseServer}${updateURLs.updateEvent}`;
  if (type === "dictionaries") return `${baseURLS.baseServer}${updateURLs.updateDictionary}`;
  if (type === "randomtables") return `${baseURLS.baseServer}${updateURLs.updateRandomTable}`;
  if (type === "randomtableoptions") return `${baseURLS.baseServer}${updateURLs.updateRandomTableOption}`;
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
  if (type === "calendars") return `${baseURLS.baseServer}${deleteURLs.deleteCalendar}`;
  if (type === "timelines") return `${baseURLS.baseServer}${deleteURLs.deleteTimeline}`;
  if (type === "eras") return `${baseURLS.baseServer}${deleteURLs.deleteEra}`;
  if (type === "events") return `${baseURLS.baseServer}${deleteURLs.deleteEvent}`;
  if (type === "randomtables") return `${baseURLS.baseServer}${deleteURLs.deleteRandomTable}`;
  if (type === "randomtableoptions") return `${baseURLS.baseServer}${deleteURLs.deleteRandomTableOption}`;
  if (type === "alter_names") return `${baseURLS.baseServer}${deleteURLs.deleteAlterName}`;
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
  return `${image}`;
};

export const getMapImageLink = (image: string) => {
  return `${image}`;
};

export const getPublicURL = (type: AvailableItemTypes) => {
  if (type !== "dictionaries") {
    const urlType = type;

    return `${baseURLS.baseServer}getpublic${urlType.slice(0, -1)}`;
  }
  return `${baseURLS.baseServer}getpublicdictionary`;
};
