import { useMutation } from "@tanstack/react-query";

import { baseURLS, createURLS } from "../types/CRUDenums";
import { UserType } from "../types/userTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";

export const useCreateUser = () => {
  return useMutation(async (newUserData: Pick<UserType, "email" | "nickname" | "auth_id">) =>
    FetchFunction({ url: `${baseURLS.baseServer}${createURLS.createUser}`, method: "POST", body: JSON.stringify(newUserData) }),
  );
};
