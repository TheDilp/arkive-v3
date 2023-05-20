import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import omit from "lodash.omit";

import { baseURLS, createURLS, deleteURLs, getURLS, updateURLs } from "../types/CRUDenums";
import {
  AllAvailableTypes,
  AvailableItemTypes,
  PermissionLevelType,
  TagCreateType,
  TagSettingsType,
  TagType,
} from "../types/generalTypes";
import { AlterNameType, DocumentType } from "../types/ItemTypes/documentTypes";
import { ProjectType } from "../types/ItemTypes/projectTypes";
import { UserType } from "../types/userTypes";
import { UserAtom } from "../utils/Atoms/atoms";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { toaster } from "../utils/toast";

export const useGetAllTags = (project_id: string) => {
  return useQuery<TagType[]>(
    ["allTags", project_id],
    async () => FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllTags}${project_id}`, method: "GET" }),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};
export const useFullSearch = (project_id: string) => {
  return useMutation(async ({ query, type }: { query: string | string[]; type: "namecontent" | "tags" | "category" }) =>
    FetchFunction({
      url: `${baseURLS.baseServer}${getURLS.getFullSearch}${project_id}/${type}`,
      method: "POST",
      body: JSON.stringify({ query }),
    }),
  );
};

export function useSpecificSearch(project_id: string) {
  return useMutation(async ({ searchQuery, selectedCategory }: { searchQuery: string; selectedCategory: AllAvailableTypes }) =>
    FetchFunction({
      url: `${baseURLS.baseServer}search`,
      method: "POST",
      body: JSON.stringify({
        project_id,
        query: searchQuery,
        type: selectedCategory,
      }),
    }),
  );
}

export const useItemsSearch = () => {
  return useMutation(
    async ({ query, type, project_id }: { query: string | string[]; type: AvailableItemTypes | "words"; project_id: string }) =>
      FetchFunction({
        url: `${baseURLS.baseServer}search`,
        method: "POST",
        body: JSON.stringify({ query, type, project_id }),
      }),
  );
};
export const useGetTagSettings = (project_id: string) => {
  return useQuery<TagSettingsType[]>(
    ["allTags", project_id, "settings"],
    async () => FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllSettingsTags}${project_id}`, method: "GET" }),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};
export const useGetAlterNameSettings = (project_id: string) => {
  return useQuery<AlterNameType[]>(
    ["allAlterNames", project_id, "settings"],
    async () => FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllAlterNames}${project_id}`, method: "GET" }),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};
export const useCreateTag = (project_id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables: TagCreateType) =>
      FetchFunction({
        url: `${baseURLS.baseServer}${createURLS.createTag}`,
        method: "POST",
        body: JSON.stringify({ project_id, ...variables }),
      }),

    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData(["allTags", project_id]);

        queryClient.setQueryData<TagType[]>(["allTags", project_id], (old) => {
          if (old) {
            return [...old, { ...variables, project_id }];
          }
          return old;
        });
        return { oldData };
      },
      onError: (_, __, context) => {
        toaster("error", "There was an error creating this tag.");
        return context?.oldData;
      },
    },
  );
};
export const useUpdateAlterNameTag = <ItemType extends { id: string; title: string }>(
  project_id: string,
  type: "tag" | "alter_name",
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (variables: Partial<Omit<ItemType, "project_id">> & { id?: string; parentId?: string }) =>
      FetchFunction({
        url: `${baseURLS.baseServer}${type === "tag" ? updateURLs.updateTag : updateURLs.updateAlterName}`,
        method: "POST",
        body: JSON.stringify({ ...variables }),
      }),
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData([type === "tag" ? "allTags" : "allAlterNames", project_id, "settings"]);

        queryClient.setQueryData<ItemType[]>([type === "tag" ? "allTags" : "allAlterNames", project_id, "settings"], (old) => {
          if (old) {
            return old.map((item) => {
              if (item.id === variables.id) {
                return { ...item, ...variables };
              }
              return item;
            });
          }
          return old;
        });
        if (type === "alter_name") {
          queryClient.setQueryData<DocumentType[]>(["allItems", project_id, "documents"], (old) => {
            if (old) {
              return old.map((item) => {
                if (item.id === variables?.parentId) {
                  return { ...item, ...variables };
                }
                return item;
              });
            }
            return old;
          });
        }

        return { oldData };
      },
      onError: (_, __, context) => {
        toaster("error", "There was an error creating this tag.");
        return context?.oldData;
      },
    },
  );
};
export const useDeleteAlterNamesTags = <ItemType extends { id: string }>(project_id: string, type: "tag" | "alter_name") => {
  const queryClient = useQueryClient();
  return useMutation(
    async (ids: string[]) =>
      FetchFunction({
        url: `${baseURLS.baseServer}${type === "tag" ? deleteURLs.deleteTags : deleteURLs.deleteAlterNames}`,
        method: "DELETE",
        body: JSON.stringify({ ids }),
      }),
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData([type === "tag" ? "allTags" : "allAlterNames", project_id]);

        queryClient.setQueryData<ItemType[]>([type === "tag" ? "allTags" : "allAlterNames", project_id], (old) => {
          if (old) {
            return old.filter((tag) => !variables.includes(tag.id));
          }
          return old;
        });
        queryClient.refetchQueries([type === "tag" ? "allTags" : "allAlterNames", project_id]);
        return { oldData };
      },
      onError: (_, __, context) => {
        toaster("error", "There was an error deleting these items.");
        return context?.oldData;
      },
    },
  );
};

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  const setUserAtom = useSetAtom(UserAtom);
  return useMutation(
    async (variables: { user_id: string; title: string; url: string; auth_id: string }) =>
      FetchFunction({
        url: `${baseURLS.baseServer}createwebhook`,
        method: "POST",
        body: JSON.stringify(omit(variables, ["auth_id"])),
      }),
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData<UserType>(["user", variables.auth_id], (old) => {
          if (old) {
            return { ...old, webhooks: [...old.webhooks, data] };
          }
          return old;
        });
        if (data)
          setUserAtom((prev) => {
            if (prev) return { ...prev, webhooks: [...prev.webhooks, data] };
            return prev;
          });
      },
    },
  );
}
export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  const setUserAtom = useSetAtom(UserAtom);
  return useMutation(
    async (variables: { user_id: string; id: string; auth_id: string }) =>
      FetchFunction({
        url: `${baseURLS.baseServer}deletewebhook`,
        method: "DELETE",
        body: JSON.stringify(variables),
      }),
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData<UserType>(["user", variables.auth_id], (old) => {
          if (old) {
            return { ...old, webhooks: old.webhooks.filter((webhook) => webhook.id !== data.id) };
          }
          return old;
        });
        if (data)
          setUserAtom((prev) => {
            if (prev) return { ...prev, webhooks: prev.webhooks.filter((webhook) => webhook.id !== variables.id) };
            return prev;
          });
      },
    },
  );
}

export function useUpdatePermission(project_id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (variables: { id: string; user_id: string; permission: { name: string; value: PermissionLevelType } }) =>
      FetchFunction({
        url: `${baseURLS.baseServer}updatepermission`,
        method: "POST",
        body: JSON.stringify({
          id: variables.id,
          permission: { name: variables.permission.name, value: variables.permission.value },
        }),
      }),
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData(["singleProject", project_id]);

        queryClient.setQueryData<ProjectType>(["singleProject", project_id], (old) => {
          if (old) {
            return {
              ...old,
              members: old.members.map((member) => {
                if (member.user_id === variables.user_id) {
                  return {
                    ...member,
                    permissions: member.permissions.map((permission) => {
                      return { ...permission, [variables.permission.name]: variables.permission.value };
                    }),
                  };
                }
                return member;
              }),
            };
          }
          return old;
        });

        return { oldData };
      },
      onError: (_, __, context) => {
        toaster("error", "There was an error updating this permission.");
        return context?.oldData;
      },
    },
  );
}
