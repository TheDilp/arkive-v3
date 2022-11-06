import { baseURLS } from "../types/enums";

export const getFunction = async (url: string) => {
  const data = await fetch(`${baseURLS.baseServer}${url}`, {
    method: "GET",
  });

  return data;
};

export const createFunction = async (url: string, body: object) => {
  const test = await fetch(`${baseURLS.baseServer}${url}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  console.log(await test.json());
};
