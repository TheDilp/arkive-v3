import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RemirrorJSON } from "remirror";
import { Document, Map, Project } from "../custom-types";
import {
  auth,
  createDocument,
  createTemplate,
  deleteDocument,
  getCurrentProject,
  getDocuments,
  getMaps,
  getTags,
  updateDocument,
  updateMapMarker,
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
// Custom hook for getting single document data
export function useGetDocumentData(project_id: string, doc_id: string) {
  const queryClient = useQueryClient();
  const docs = queryClient.getQueryData<Document[]>(`${project_id}-documents`);
  if (docs && doc_id) {
    const doc = docs.find((doc) => doc.id === doc_id);
    if (doc) {
      return doc;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
// Custom hook for creating a new document
export function useCreateDocument(project_id: string) {
  const user_id = auth.user()?.id as string;
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: string;
      parent?: string | null;
      title?: string;
      image?: string | undefined;
      categories?: string[] | undefined;
      folder?: boolean;
      icon?: string;
      content?: RemirrorJSON | null;
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
                  content: newDocument.content || null,
                  user_id,
                  // @ts-ignore
                  parent:
                    newDocument.parent && parent
                      ? { id: parent?.id, title: parent?.title }
                      : null,
                  title: newDocument.title ? newDocument.title : "New Document",
                  icon: newDocument.icon || "akar-icons:file",
                  image: newDocument.image ? newDocument.image : "",
                  categories: newDocument.categories
                    ? newDocument.categories
                    : [],
                  folder: newDocument.folder ? newDocument.folder : false,
                  template: false,
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
      categories?: string[];
    }) =>
      await updateDocument({
        doc_id: vars.doc_id,
        title: vars.title,
        folder: vars.folder,
        parent: vars.parent,
        image: vars.image,
        icon: vars.icon,
        content: vars.content,
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
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
      },
    }
  );
}
// Custom hook for deleting a document
export function useDeleteDocument(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { doc_id: string; folder: boolean }) => {
      await deleteDocument(vars.doc_id);
    },
    {
      onMutate: async (deletedDocument) => {
        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              if (deletedDocument.folder) {
                let newData: Document[] = oldData
                  .filter((doc) => doc.id !== deletedDocument.doc_id)
                  .filter(
                    (doc) =>
                      !doc.parent || doc.parent.id !== deletedDocument.doc_id
                  );
                return newData;
              } else {
                let newData: Document[] = oldData.filter(
                  (doc) => doc.id !== deletedDocument.doc_id
                );
                return newData;
              }
            } else {
              return [];
            }
          }
        );
        return { previousDocuments };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
        toastError("There was an error deleting this document.");
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
// Custom hook to create a template
export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: string;
      project_id: string;
      title: string;
      content: RemirrorJSON;
      user_id: string;
      icon: string;
      image: string;
      categories: string[];
      folder: boolean;
    }) => {
      // TEMPLATE:TRUE is hardcoded in supabaseutils.ts
      await createTemplate({ ...vars, parent: undefined });
    },
    {
      onMutate: async (newDocument) => {
        const previousTemplates = queryClient.getQueryData(
          `${newDocument.project_id}-documents`
        );
        queryClient.setQueryData(
          `${newDocument.project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              // Template shouldn't have parent hence null
              let newData: Document[] = [
                ...oldData,
                { ...newDocument, parent: null, template: true },
              ];
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousTemplates };
      },

      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${newTodo.project_id}-templates`,
          context?.previousTemplates
        );
        toastError("There was an error creating this template.");
      },
    }
  );
}
// Custom hook to get templates
export function useGetTemplates(project_id: string) {
  const queryClient = useQueryClient();
  const templates = queryClient.getQueryData<Document[]>(
    `${project_id}-documents`
  );
  if (templates) {
    return templates.filter((doc) => doc.template);
  } else {
    return [];
  }
}

// Custom hook to get maps
export function useGetMaps(project_id: string) {
  const { data } = useQuery(
    `${project_id}-maps`,
    async () => await getMaps(project_id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
  return data;
}

// Custom hook to update map marker
export function useUpdateMapMarker() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: number;
      map_id: string;
      project_id: string;
      icon?: string;
      color?: string;
      text?: string;
      x?: number;
      y?: number;
    }) => {
      await updateMapMarker({
        id: vars.id,
        icon: vars.icon,
        color: vars.color,
        text: vars.text,
        x: vars.x,
        y: vars.y,
        map_id: vars.map_id,
      });
    },
    {
      onMutate: async (updatedMarker) => {
        const previousMaps = queryClient.getQueryData(
          `${updatedMarker.project_id}-maps`
        );
        queryClient.setQueryData(
          `${updatedMarker.project_id}-maps`,
          (oldData: Map[] | undefined) => {
            if (oldData) {
              let newData: Map[] = oldData.map((map) => {
                if (map.id === updatedMarker.map_id) {
                  return {
                    ...map,
                    markers: map.markers.map((marker) => {
                      if (marker.id === updatedMarker.id) {
                        return {
                          ...marker,
                          // Check what values were given and set to new ones, otherwise keep old one
                          icon: updatedMarker.icon
                            ? updatedMarker.icon
                            : marker.icon,
                          color: updatedMarker.color
                            ? updatedMarker.color
                            : marker.color,
                          text: updatedMarker.text
                            ? updatedMarker.text
                            : marker.text,
                          x: updatedMarker.x ? updatedMarker.x : marker.x,
                          y: updatedMarker.y ? updatedMarker.y : marker.y,
                        };
                      } else {
                        return marker;
                      }
                    }),
                  };
                } else {
                  return map;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousMaps };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${newTodo.project_id}-maps`,
          context?.previousMaps
        );
        toastError("There was an error updating this map marker.");
      },
    }
  );
}
