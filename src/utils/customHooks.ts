import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RemirrorJSON } from "remirror";
import { Document, Project } from "../custom-types";
import {
  createDocument,
  getCurrentProject,
  getDocuments,
  getTags,
  updateDocument,
  updateProject,
} from "./supabaseUtils";
import { toastError, toastSuccess } from "./utils";
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
  return useMutation(
    async (vars: {
      id: string;
      parent?: string | null;
      title?: string;
      image?: string | undefined;
      categories?: string[] | undefined;
      folder?: boolean;
    }) => {
      await createDocument({ project_id, ...vars });
    },
    {
      onMutate: async (newDocument) => {
        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        const docs: Document[] | undefined = queryClient.getQueryData(
          `${project_id}-documents`
        );
        let parent = newDocument.parent
          ? docs?.find((doc) => doc.id === newDocument.parent)
          : null;
        queryClient.setQueryData(
          `${project_id}-documents`,
          //   @ts-ignore
          (oldData: Document[] | undefined) => {
            if (oldData) {
              let newData: Document[] = [
                ...oldData,
                {
                  id: newDocument.id,
                  project_id,
                  content: null,
                  user_id,
                  // @ts-ignore
                  parent:
                    newDocument.parent && parent
                      ? { id: parent?.id, title: parent?.title }
                      : null,
                  title: newDocument.title ? newDocument.title : "New Document",
                  icon: "akar-icons:file",
                  image: newDocument.image ? newDocument.image : "",
                  categories: newDocument.categories
                    ? newDocument.categories
                    : [],
                  folder: newDocument.folder ? newDocument.folder : false,
                },
              ];
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousDocuments };
      },
    }
  );
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
      edit_by?: string[];
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
        edit_by: vars.edit_by,
      }),
    {
      onMutate: async (updatedDocument) => {
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
