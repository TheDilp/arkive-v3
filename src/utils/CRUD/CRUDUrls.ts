import { baseURLS } from "../../types/CRUDenums";
import { AllAvailableTypes, AvailableItemTypes } from "../../types/generalTypes";

export const getURL = (project_id: string, type: AvailableItemTypes) => {
  return `${baseURLS.baseServer}getall${type}/${project_id}`;
};
export const getSingleURL = (type: AvailableItemTypes) => {
  if (type === "dictionaries") return `${baseURLS.baseServer}getsingledictionary`;
  if (type === "entities") return `${baseURLS.baseServer}getsingleentity`;
  return `${baseURLS.baseServer}getsingle${type.slice(0, -1)}`;
};
export const createURL = (type: AllAvailableTypes) => {
  if (type === "dictionaries") return `${baseURLS.baseServer}createdictionary`;
  if (type === "entities") return `${baseURLS.baseServer}createentity`;
  if (type === "entityinstances") return `${baseURLS.baseServer}createentityinstance`;

  return `${baseURLS.baseServer}create${type.slice(0, -1).replace("_", "")}`; // Replace is for random_tables
};
export const updateURL = (type: AllAvailableTypes) => {
  if (type === "dictionaries") return `${baseURLS.baseServer}updatedictionary`;
  return `${baseURLS.baseServer}update${type.slice(0, -1).replace("_", "")}`;
};

export const deleteURL = (type: AllAvailableTypes) => {
  if (type === "dictionaries") return `${baseURLS.baseServer}deletedictionary`;
  return `${baseURLS.baseServer}delete${type.slice(0, -1).replace("_", "")}`;
};

export const sortURL = (type: AllAvailableTypes) => {
  if (type === "dictionaries") return `${baseURLS.baseServer}sortdictionaries`;
  return `${baseURLS.baseServer}sort${type.replace("_", "")}`;
};

export const updateManyURL = (type: AllAvailableTypes) => {
  if (type === "dictionaries") return `${baseURLS.baseServer}updatemanydictionaries`;
  return `${baseURLS.baseServer}updatemany${type.replace("_", "")}`;
};
export const deleteManyURL = (type: AllAvailableTypes) => {
  if (type === "dictionaries") return `${baseURLS.baseServer}deletemanydictionaries`;
  return `${baseURLS.baseServer}deletemany${type.replace("_", "")}`;
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
