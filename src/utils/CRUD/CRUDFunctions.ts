import { baseURLS, getURLS } from "../../types/CRUDenums";
import { AvailableItemTypes } from "../../types/generalTypes";
import { getURL } from "./CRUDUrls";

export const getItems = async (project_id: string, type: AvailableItemTypes) => {
  const url = getURL(project_id as string, type);
  if (url)
    return (
      await fetch(url, {
        method: "GET",
      })
    ).json();
  return null;
};
export const getTags = async (project_id: string, type: AvailableItemTypes) =>
  (
    await fetch(`${baseURLS.baseServer}${getURLS.getAllTags}${type}/${project_id}`, {
      method: "GET",
    })
  ).json();

export const getSearchTags = async (project_id: string, query: string) =>
  (
    await fetch(`${baseURLS.baseServer}${getURLS.getAllTags}${project_id}`, {
      method: "POST",
      body: JSON.stringify({ query }),
    })
  ).json();
