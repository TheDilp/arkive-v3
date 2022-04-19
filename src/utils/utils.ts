import { NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast, ToastOptions } from "react-toastify";
import { RemirrorJSON } from "remirror";
import { Document, Project } from "../custom-types";
import {
  createDocument,
  getCurrentProject,
  getDocuments,
  getProjects,
  getTags,
  updateDocument,
  updateProject,
} from "./supabaseUtils";
const defaultToastConfig: ToastOptions = {
  autoClose: 1250,
  theme: "dark",
};
export const toastSuccess = (message: string) =>
  toast.success(message, defaultToastConfig);
export const toastError = (message: string) =>
  toast.error(message, defaultToastConfig);
export const toastWarn = (message: string) =>
  toast.warn(message, defaultToastConfig);
// Filter autocomplete for categories
export const searchCategory = (
  event: any,
  categories: string[],
  setFilteredCategories: (categories: string[]) => void
) => {
  setTimeout(() => {
    let _filteredCategories;
    if (!event.query.trim().length) {
      _filteredCategories = [...categories];
    } else {
      _filteredCategories = categories.filter((category) => {
        return category.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }

    setFilteredCategories(_filteredCategories);
  }, 250);
};
// Get depth of node in tree in editor view
export const getDepth = (
  tree: NodeModel[],
  id: number | string,
  depth = 0
): number => {
  const target: NodeModel | undefined = tree.find((node) => node.id === id);

  if (target) {
    return getDepth(tree, target.parent, depth + 1);
  }

  return depth;
};
// CUSTOM HOOKS

// Custom hook for detecting if user clicked outside of element (ref)
export function useOnClickOutside(ref: any, handler: (event: any) => void) {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
// Custom hook for getting a project's data
export function useGetProjectData(project_id: string) {
  const { data } = useQuery(
    `${project_id}-project`,
    async () => await getCurrentProject(project_id)
  );
  return data;
}
// Custom hook for updating a project's data
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      project_id: string;
      title?: string;
      categories?: string[];
      cardImage?: string;
    }) =>
      await updateProject(
        vars.project_id,
        vars.title,
        vars.categories,
        vars.cardImage
      ),
    {
      onMutate: async (updatedProject) => {
        const previousProjects = queryClient.getQueryData(
          `${updatedProject.project_id}-project`
        );
        queryClient.setQueryData(
          `${updatedProject.project_id}-project`,
          //   @ts-ignore
          (oldData: Project | undefined) => {
            if (oldData) {
              let newData: Project = { ...oldData, ...updatedProject };
              return newData;
            } else {
              return {};
            }
          }
        );
        return { previousProjects };
      },
      onSuccess: () => {
        toastSuccess("Project successfully updated.");
      },
    }
  );
}
// Custom hook for getting documents
export function useGetDocuments(project_id: string) {
  const { data } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
  return data;
}
// Custom hook for creating a new document
export function useCreateDocument(project_id: string, user_id: string) {
  const queryClient = useQueryClient();
  return useMutation(async () => {
    const updatedDocument = await createDocument(project_id, undefined);
    if (updatedDocument) {
      queryClient.setQueryData(
        `${project_id}-documents`,
        (oldData: Document[] | undefined) => {
          if (oldData) {
            return [...oldData, updatedDocument];
          } else {
            return [updatedDocument];
          }
        }
      );
    }
  });
}
// Custom hook for updating a document
export function useUpdateDocument(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      doc_id: string;
      title?: string;
      content?: RemirrorJSON;
      image?: string;
      folder?: boolean;
      parent?: string | null;
      icon?: string;
      view_by?: string[];
    }) =>
      await updateDocument({
        doc_id: vars.doc_id,
        title: vars.title,
        folder: vars.folder,
        parent: vars.parent,
        image: vars.image,
        icon: vars.icon,
        content: vars.content,
        view_by: vars.view_by,
      }),
    {
      onMutate: async (updatedDocument) => {
        console.log("TEST");
        await queryClient.cancelQueries(`${project_id}-documents`);
        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              let newParent = oldData.find(
                (doc) => doc.id === updatedDocument.parent
              );
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.doc_id) {
                  return {
                    ...doc,
                    ...updatedDocument,
                    parent:
                      updatedDocument.parent && newParent
                        ? { id: newParent.id, title: newParent.title }
                        : doc.parent,
                  };
                } else {
                  return doc;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );

        return { previousDocuments };
      },
      onSuccess: () => {
        // documentsRefetch();
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
        toastError("There was an error updating this document.");
      },
    }
  );
}
// Custom hook to get tags for a project
export function useGetTags(project_id: string) {
  const { data, refetch }: { data: string[][] | undefined; refetch: any } =
    useQuery(`allTags`, async () => await getTags(project_id), {
      staleTime: 5 * 60 * 1000,
    });
  return { data: data?.[0] || [], refetch };
}
