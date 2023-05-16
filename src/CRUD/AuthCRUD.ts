import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

import { baseURLS, createURLS } from "../types/CRUDenums";
import { UserType } from "../types/userTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { toaster } from "../utils/toast";

export const useCreateUser = () => {
  return useMutation(async (newUserData: Pick<UserType, "email" | "nickname" | "auth_id">) =>
    FetchFunction({ url: `${baseURLS.baseServer}${createURLS.createUser}`, method: "POST", body: JSON.stringify(newUserData) }),
  );
};

export function useGetUser(id: string, options?: UseQueryOptions, isPublic?: boolean) {
  const { data, isLoading, isFetching } = useQuery<UserType>({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id) return null;
      const url = isPublic ? `${baseURLS.baseServer}publicuser/${id}` : `${baseURLS.baseServer}user/${id}`;
      if (url) {
        return FetchFunction({ url, method: "GET" });
      }

      return null;
    },
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    onSuccess: options?.onSuccess,
  });
  return { data, isLoading, isFetching };
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updateItemValues: Partial<UserType>) => {
      if (updateItemValues.id) {
        const url = `${baseURLS.baseServer}updateuser`;
        if (url) return FetchFunction({ url, body: JSON.stringify(updateItemValues), method: "POST" });
      }
      return null;
    },
    {
      onSuccess: (_, variables) => {
        toaster("success", "Profile successfully updated.");
        queryClient.setQueryData<UserType>(["user", variables?.id], (oldData) => {
          if (oldData) return { ...oldData, ...variables };
          return oldData;
        });
      },
    },
  );
};
