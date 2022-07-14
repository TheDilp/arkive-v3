import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RemirrorJSON } from "remirror";
import {
  DocumentProps,
  DocumentUpdateProps,
  ImageProps,
  MapProps,
  MapUpdateProps,
  ProjectProps,
} from "../custom-types";
import {
  BoardNodeProps,
  BoardProps,
  CreateBoardProps,
  CreateNodeProps,
  UpdateEdgeProps,
  UpdateNodeProps,
} from "../types/BoardTypes";
import {
  createBoard,
  createDocument,
  createEdge,
  createMap,
  createMapMarker,
  createNode,
  createTemplate,
  deleteBoard,
  deleteDocument,
  deleteEdge,
  deleteImagesStorage,
  deleteManyNodes,
  deleteMap,
  deleteMapMarker,
  deleteNode,
  getBoards,
  getCurrentProject,
  getDocuments,
  getImages,
  getMaps,
  getTags,
  renameImage,
  sortBoardsChildren,
  sortDocumentsChildren,
  sortMapsChildren,
  updateBoard,
  updateDocument,
  updateEdge,
  updateMap,
  updateMapMarker,
  updateNode,
  updateProject,
  uploadImage,
} from "./supabaseUtils";
import { defaultNode, toastError, toastSuccess } from "./utils";
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
          (oldData: ProjectProps | undefined) => {
            if (oldData) {
              let newData: ProjectProps = { ...oldData, ...updatedProject };
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
  const { data, isLoading } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
  return { data, isLoading };
}
// Custom hook for getting single document data
export function useGetDocumentData(project_id: string, doc_id: string) {
  const queryClient = useQueryClient();
  const docs = queryClient.getQueryData<DocumentProps[]>(
    `${project_id}-documents`
  );
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
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: string;
      parent?: string | null;
      title?: string;
      categories?: string[] | undefined;
      folder?: boolean;
      template?: boolean;
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
        const docs: DocumentProps[] | undefined = queryClient.getQueryData(
          `${project_id}-documents`
        );
        let parent = newDocument.parent
          ? docs?.find((doc) => doc.id === newDocument.parent)
          : null;
        queryClient.setQueryData(
          `${project_id}-documents`,
          //   @ts-ignore
          (oldData: DocumentProps[] | undefined) => {
            if (oldData) {
              let newData: DocumentProps[] = [
                ...oldData,
                {
                  id: newDocument.id,
                  project_id,
                  content: newDocument.content || null,
                  // @ts-ignore
                  parent:
                    newDocument.parent && parent
                      ? { id: parent?.id, title: parent?.title }
                      : null,
                  title: newDocument.title ? newDocument.title : "New Document",
                  icon: newDocument.icon || "mdi:file",
                  image: undefined,
                  categories: newDocument.categories
                    ? newDocument.categories
                    : [],
                  folder: newDocument.folder ? newDocument.folder : false,
                  template: newDocument.template ? newDocument.template : false,
                  expanded: false,
                  public: false,
                  sort: oldData.filter((doc) => !doc.template).length,
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
    async (vars: Omit<DocumentUpdateProps, "image"> & { image?: ImageProps }) =>
      await updateDocument({ ...vars, image: vars.image?.id }),

    {
      onMutate: async (updatedDocument) => {
        await queryClient.cancelQueries(`${project_id}-documents`);
        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: DocumentProps[] | undefined) => {
            if (oldData) {
              let newParent = oldData.find(
                (doc) => doc.id === updatedDocument.parent
              );
              let newData: DocumentProps[] = [...oldData];

              const idx = newData.findIndex(
                (doc) => doc.id === updatedDocument.id
              );
              if (idx !== -1)
                newData[idx] = {
                  ...newData[idx],
                  ...updatedDocument,
                  parent: newParent
                    ? { id: newParent.id, title: newParent.title }
                    : updatedDocument.parent === null
                    ? null
                    : newData[idx].parent,
                };
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
export function useSortChildren() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      project_id: string;
      type: "documents" | "maps" | "boards";
      indexes: { id: string; sort: number }[];
    }) => {
      if (vars.type === "documents") await sortDocumentsChildren(vars.indexes);
      if (vars.type === "maps") await sortMapsChildren(vars.indexes);
      if (vars.type === "boards") await sortBoardsChildren(vars.indexes);
    },
    {
      onMutate: async (newData) => {
        const previousData = queryClient.getQueryData(
          `${newData.project_id}-${newData.type}`
        );
        queryClient.setQueryData(
          `${newData.project_id}-${newData.type}`,
          (
            oldData: (DocumentProps[] | MapProps[] | BoardProps[]) | undefined
          ) => {
            if (oldData) {
              let sortedData: any[] = [...oldData];
              for (const item of newData.indexes) {
                const index = oldData.findIndex((doc) => doc.id === item.id);
                if (index !== -1) {
                  sortedData[index] = { ...sortedData[index], sort: item.sort };
                }
              }
              return sortedData;
            } else {
              return [];
            }
          }
        );
        return { previousData };
      },
      onError: (err, newData, context) => {
        queryClient.setQueryData(
          `${newData.project_id}-${newData.type}`,
          context?.previousData
        );
      },
    }
  );
}
// Custom hook for deleting a document
export function useDeleteDocument(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { id: string; folder: boolean }) => {
      await deleteDocument(vars.id);
    },
    {
      onMutate: async (deletedDocument) => {
        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: DocumentProps[] | undefined) => {
            if (oldData) {
              if (deletedDocument.folder) {
                let newData: DocumentProps[] = oldData
                  .filter((doc) => doc.id !== deletedDocument.id)
                  .filter(
                    (doc) => !doc.parent || doc.parent.id !== deletedDocument.id
                  );
                return newData;
              } else {
                let newData: DocumentProps[] = oldData.filter(
                  (doc) => doc.id !== deletedDocument.id
                );
                return newData;
              }
            } else {
              return [];
            }
          }
        );

        // Delete references to the document for any linked

        // const maps = queryClient.getQueryData(`${project_id}-maps`);

        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              let newData = oldData.map((board) => {
                let newBoard = { ...board };
                if (
                  newBoard.nodes.some(
                    (node: BoardNodeProps) =>
                      node.document?.id === deletedDocument.id
                  )
                ) {
                  newBoard.nodes = newBoard.nodes.map(
                    (node: BoardNodeProps) => {
                      if (node.document?.id === deletedDocument.id) {
                        return { ...node, document: undefined };
                      } else {
                        return node;
                      }
                    }
                  );
                }
                return newBoard;
              });
              return newData;
            } else {
              return [];
            }
          }
        );

        queryClient.setQueryData(
          `${project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              let newData = oldData.map((map) => {
                let newMap = { ...map };
                if (
                  newMap.markers.some(
                    (marker) => marker?.doc_id === deletedDocument.id
                  )
                ) {
                  newMap.markers = newMap.markers.map((marker) => {
                    if (marker?.doc_id === deletedDocument.id) {
                      return { ...marker, doc_id: undefined };
                    } else {
                      return marker;
                    }
                  });
                }
                return newMap;
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
      icon: string;
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
          (oldData: DocumentProps[] | undefined) => {
            if (oldData) {
              // Template shouldn't have parent hence null
              let newData: DocumentProps[] = [
                ...oldData,
                {
                  ...newDocument,
                  parent: null,
                  template: true,
                  expanded: false,
                  image: undefined,
                  public: false,
                  sort: oldData.filter((doc) => doc.template).length,
                },
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
  const templates = queryClient.getQueryData<DocumentProps[]>(
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
  const { data, isLoading } = useQuery(
    `${project_id}-maps`,
    async () => await getMaps(project_id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
  return { data, isLoading };
}
// Custom hook to create a map
export function useCreateMap() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: string;
      project_id: string;
      title: string;
      map_image: ImageProps | undefined;
      expanded: boolean;
      folder?: boolean;
      parent?: string | null;
    }) => {
      await createMap({
        ...vars,
        map_image: vars.map_image?.id,
        expanded: false,
      });
    },
    {
      onMutate: async (newMap) => {
        const previousMaps = queryClient.getQueryData(
          `${newMap.project_id}-maps`
        );
        queryClient.setQueryData(
          `${newMap.project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              // Template shouldn't have parent hence null
              let newData: MapProps[] = [
                ...oldData,
                {
                  ...newMap,
                  parent: newMap.parent
                    ? { id: newMap.parent, title: "" }
                    : null,
                  folder: newMap.folder ? newMap.folder : false,
                  markers: [],
                  public: false,
                  sort: oldData.length,
                },
              ];
              return newData;
            } else {
              return [
                {
                  ...newMap,
                  parent: newMap.parent
                    ? { id: newMap.parent, title: "" }
                    : null,
                  folder: newMap.folder ? newMap.folder : false,
                  markers: [],
                  public: false,
                  sort: 0,
                },
              ];
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
        toastError("There was an error creating this map.");
      },
    }
  );
}
// Custom hook for getting single map data
export function useGetMapData(project_id: string, map_id: string) {
  const queryClient = useQueryClient();
  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  if (maps && map_id) {
    const map = maps.find((map) => map.id === map_id);
    if (map) {
      return map;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
// Custom hook for updating a map
export function useUpdateMap(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: MapUpdateProps) => {
      await updateMap(vars);
    },
    {
      onMutate: async (updatedMap) => {
        const previousMaps = queryClient.getQueryData(`${project_id}-maps`);
        queryClient.setQueryData(
          `${project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              let newParent = oldData.find(
                (doc) => doc.id === updatedMap.parent
              );
              let newData: MapProps[] = oldData.map((map) => {
                if (map.id === updatedMap.id) {
                  return {
                    ...map,
                    ...updatedMap,
                    parent: newParent
                      ? { id: newParent.id, title: newParent.title }
                      : updatedMap.parent === null
                      ? null
                      : map.parent,
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
        queryClient.setQueryData(`${project_id}-maps`, context?.previousMaps);
        toastError("There was an error updating this map.");
      },
    }
  );
}
// Custom hook to DELETE a map
export function useDeleteMap() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { id: string; project_id: string }) => {
      await deleteMap(vars.id);
    },
    {
      onMutate: async (deletedMap) => {
        const previousMaps = queryClient.getQueryData(
          `${deletedMap.project_id}-maps`
        );
        queryClient.setQueryData(
          `${deletedMap.project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              // Template shouldn't have parent hence null
              let newData: MapProps[] = oldData.filter(
                (map) => map.id !== deletedMap.id
              );
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousMaps };
      },

      onError: (err, deletedMap, context) => {
        queryClient.setQueryData(
          `${deletedMap.project_id}-maps`,
          context?.previousMaps
        );
        toastError("There was an error deleting this map.");
      },
    }
  );
}
// Custom hoom to create a map marker
export function useCreateMapMarker(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: string;
      map_id: string;
      text?: string;
      icon?: string;
      color?: string;
      backgroundColor?: string;
      doc_id?: string;
      map_link?: string;
      lat: number;
      lng: number;
    }) => {
      await createMapMarker({ ...vars });
    },
    {
      onMutate: async (newMarker) => {
        const previousMaps = queryClient.getQueryData(`${project_id}-maps`);
        queryClient.setQueryData(
          `${project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              // Template shouldn't have parent hence null
              let newData: MapProps[] = oldData.map((map) => {
                if (map.id === newMarker.map_id) {
                  return {
                    ...map,
                    markers: [
                      ...map.markers,
                      {
                        ...newMarker,
                        icon: newMarker.icon || "wizard-hat",
                        color: newMarker.color || "ffffff",
                        backgroundColor: newMarker.backgroundColor || "000000",
                        text: newMarker.text || "",
                      },
                    ],
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
        queryClient.setQueryData(`${project_id}-maps`, context?.previousMaps);
        toastError("There was an error creating this map marker.");
      },
    }
  );
}
// Custom hook to update map marker
export function useUpdateMapMarker() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: string;
      map_id: string;
      project_id: string;
      icon?: string;
      color?: string;
      backgroundColor?: string;
      text?: string;
      lat?: number;
      lng?: number;
      doc_id?: string;
      map_link?: string;
    }) => {
      await updateMapMarker({
        id: vars.id,
        map_id: vars.map_id,
        icon: vars.icon,
        color: vars.color,
        backgroundColor: vars.backgroundColor,
        text: vars.text,
        lat: vars.lat,
        lng: vars.lng,
        doc_id: vars.doc_id,
        map_link: vars.map_link,
      });
    },
    {
      onMutate: async (updatedMarker) => {
        const previousMaps = queryClient.getQueryData(
          `${updatedMarker.project_id}-maps`
        );
        queryClient.setQueryData(
          `${updatedMarker.project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              let newData: MapProps[] = oldData.map((map) => {
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
                          backgroundColor: updatedMarker.backgroundColor
                            ? updatedMarker.backgroundColor
                            : marker.backgroundColor,
                          text: updatedMarker.text
                            ? updatedMarker.text
                            : marker.text,
                          lat: updatedMarker.lat
                            ? updatedMarker.lat
                            : marker.lat,
                          lng: updatedMarker.lng
                            ? updatedMarker.lng
                            : marker.lng,
                          doc_id: updatedMarker.doc_id
                            ? updatedMarker.doc_id
                            : updatedMarker.doc_id === null
                            ? undefined
                            : marker.doc_id,
                          map_link: updatedMarker.map_link
                            ? updatedMarker.map_link
                            : updatedMarker.map_link === null
                            ? undefined
                            : marker.map_link,
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
// Custom hook for deleting a single map marker
export function useDeleteMapMarker() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { id: string; map_id: string; project_id: string }) => {
      await deleteMapMarker(vars.id);
    },
    {
      onMutate: async (deletedMarker) => {
        const previousMaps = queryClient.getQueryData(
          `${deletedMarker.project_id}-maps`
        );
        queryClient.setQueryData(
          `${deletedMarker.project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              let newData: MapProps[] = oldData.map((map) => {
                if (map.id === deletedMarker.map_id) {
                  return {
                    ...map,
                    markers: map.markers.filter(
                      (marker) => marker.id !== deletedMarker.id
                    ),
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
        toastError("There was an error deleting this map marker.");
      },
    }
  );
}
// Custom hook for getting boards
export function useGetBoards(project_id: string) {
  const { data, isLoading } = useQuery(
    `${project_id}-boards`,
    async () => await getBoards(project_id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
  return { data, isLoading };
}
// Custom hook for getting a single board's data
export function useGetBoardData(project_id: string, board_id: string) {
  const queryClient = useQueryClient();
  const boards: BoardProps[] | undefined = queryClient.getQueryData(
    `${project_id}-boards`
  );
  if (boards) {
    let board = boards.find((board) => board.id === board_id);
    if (board) return board;
  }
  return undefined;
}
// Custom hook for creating a new board
export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: CreateBoardProps) => {
      const newBoard = await createBoard({
        ...vars,
      });
      return newBoard;
    },
    {
      onMutate: async (newBoard) => {
        const previousBoards = queryClient.getQueryData(
          `${newBoard.project_id}-boards`
        );
        queryClient.setQueryData(
          `${newBoard.project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              return [
                ...oldData,
                {
                  ...newBoard,
                  parent: { id: "", title: "" },
                  defaultNodeColor: "#595959",
                  defaultEdgeColor: "#595959",
                  nodes: [],
                  edges: [],
                  expanded: false,
                  public: false,
                  sort: oldData.length,
                },
              ];
            } else {
              return [
                {
                  ...newBoard,
                  parent: { id: "", title: "" },
                  defaultNodeColor: "#595959",
                  defaultEdgeColor: "#595959",
                  nodes: [],
                  edges: [],
                  expanded: false,
                  public: false,
                  sort: 0,
                },
              ];
            }
          }
        );
        return { previousBoards };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${newTodo.project_id}-boards`,
          context?.previousBoards
        );
        toastError("There was an error creating this board.");
      },
    }
  );
}
// Custom hook for updating a board
export function useUpdateBoard(project_id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (vars: {
      id: string;
      title?: string;
      parent?: string | null;
      defaultNodeColor?: string;
      defaultEdgeColor?: string;
      expanded?: boolean;
      public?: boolean;
    }) => {
      await updateBoard(vars);
    },
    {
      onMutate: async (updatedBoard) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              let newParent = oldData.find(
                (doc) => doc.id === updatedBoard.parent
              );
              let newData = oldData.map((board) => {
                if (board.id === updatedBoard.id) {
                  return {
                    ...board,
                    ...updatedBoard,
                    parent: newParent
                      ? { id: newParent.id, title: newParent.title }
                      : updatedBoard.parent === null
                      ? null
                      : board.parent,
                  };
                } else {
                  return board;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousBoards };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
        toastError("There was an error updating this board.");
      },
    }
  );
}
// Custom hook for deleting a board
export function useDeleteBoard(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { id: string }) => {
      await deleteBoard(vars.id);
    },
    {
      onMutate: async (deletedBoard) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              return oldData.filter((board) => board.id !== deletedBoard.id);
            } else {
              return [];
            }
          }
        );
        return { previousBoards };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
      },
    }
  );
}
// Custom hook for creating a node
export function useCreateNode(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: CreateNodeProps) => {
      await createNode({
        ...vars,
      });
    },
    {
      onMutate: async (newNode) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              let document:
                | {
                    id: string;
                    image: {
                      link?: string;
                    };
                  }
                | undefined;
              // Then if there is a document that is linked, find it and map the data
              if (newNode.doc_id) {
                const documents: DocumentProps[] | undefined =
                  queryClient.getQueryData(`${project_id}-documents`);
                const doc = documents?.find((doc) => doc.id === newNode.doc_id);
                if (doc)
                  document = {
                    id: doc.id,
                    image: {
                      link: doc.image?.link,
                    },
                  };
              } else if (newNode.doc_id === null) {
                document = undefined;
              }

              let newData = oldData.map((board) => {
                if (board.id === newNode.board_id) {
                  return {
                    ...board,
                    nodes: [
                      ...board.nodes,
                      {
                        ...defaultNode,
                        ...newNode,
                        document,
                      },
                    ],
                  };
                } else {
                  return board;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousBoards };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
        toastError("There was an error creating this node.");
      },
    }
  );
}
// Custom hook for updating a node
export function useUpdateNode(project_id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (
      vars: Omit<UpdateNodeProps, "customImage"> & {
        board_id: string;
        customImage?: ImageProps;
      }
    ) => {
      const { board_id, ...updateVars } = vars;
      await updateNode({
        ...updateVars,
        customImage: updateVars.customImage?.id,
      });
    },
    {
      onMutate: async (updatedNode) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              // Init document variable as undefined
              let document:
                | {
                    id: string;
                    image: {
                      link?: string;
                    };
                  }
                | undefined;
              // Then if there is a document that is linked, find it and map the data
              if (updatedNode.doc_id) {
                const documents: DocumentProps[] | undefined =
                  queryClient.getQueryData(`${project_id}-documents`);
                const doc = documents?.find(
                  (doc) => doc.id === updatedNode.doc_id
                );
                if (doc)
                  document = {
                    id: doc.id,
                    image: {
                      link: doc.image?.link,
                    },
                  };
              } else if (updatedNode.doc_id === null) {
                document = undefined;
              }

              let newData = oldData.map((board) => {
                if (board.id === updatedNode.board_id) {
                  return {
                    ...board,
                    nodes: board.nodes.map((node) => {
                      if (node.id === updatedNode.id) {
                        return {
                          ...node,
                          ...updatedNode,
                          customImage: updatedNode.customImage
                            ? updatedNode.customImage
                            : node.customImage,
                          document: updatedNode.doc_id
                            ? document
                            : updatedNode.doc_id === null
                            ? undefined
                            : node.document,
                        };
                      } else {
                        return node;
                      }
                    }),
                  };
                } else {
                  return board;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousBoards };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
        toastError("There was an error updating this node.");
      },
    }
  );
}
// Custom hook for deleting a node
export function useDeleteNode(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { id: string; board_id: string }) => {
      await deleteNode(vars.id);
    },
    {
      onMutate: async (deletedNode) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              return oldData.map((board) => {
                if (board.id === deletedNode.board_id) {
                  return {
                    ...board,
                    nodes: board.nodes.filter(
                      (node) => node.id !== deletedNode.id
                    ),
                  };
                } else {
                  return board;
                }
              });
            } else {
              return [];
            }
          }
        );

        return { previousBoards };
      },

      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
      },
    }
  );
}
export function useDeleteManyNodes(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { ids: string[]; board_id: string }) => {
      await deleteManyNodes(vars.ids);
    },
    {
      onMutate: async (deletedNodes) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              return oldData.map((board) => {
                if (board.id === deletedNodes.board_id) {
                  return {
                    ...board,
                    nodes: board.nodes.filter(
                      (node) => !deletedNodes.ids.includes(node.id)
                    ),
                  };
                } else {
                  return board;
                }
              });
            } else {
              return [];
            }
          }
        );

        return { previousBoards };
      },

      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
      },
    }
  );
}
// Custom hook for creating an edge
export function useCreateEdge(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: string;
      source: string;
      target: string;
      board_id: string;
      curveStyle: string;
      lineStyle: string;
      lineColor: string;
      controlPointDistances: number;
      controlPointWeights: number;
      taxiDirection: string;
      taxiTurn: number;
      targetArrowShape: string;
      zIndex: number;
    }) => {
      const newEdge = await createEdge({
        ...vars,
      });
      return newEdge;
    },
    {
      onMutate: async (newEdge) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              let newData = oldData.map((board) => {
                if (board.id === newEdge.board_id) {
                  return {
                    ...board,
                    edges: [...board.edges, newEdge],
                  };
                } else {
                  return board;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousBoards };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
      },
    }
  );
}
// Custom hook for updating an edge
export function useUpdateEdge(project_id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (vars: UpdateEdgeProps) => {
      await updateEdge(vars);
    },
    {
      onMutate: async (updatedEdge) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              return oldData.map((board) => {
                if (board.id === updatedEdge.board_id) {
                  return {
                    ...board,
                    edges: board.edges.map((edge) => {
                      if (edge.id === updatedEdge.id) {
                        return {
                          ...edge,
                          ...updatedEdge,
                        };
                      } else {
                        return edge;
                      }
                    }),
                  };
                } else {
                  return board;
                }
              });
            } else {
              return [];
            }
          }
        );
        return { previousBoards };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
      },
    }
  );
}
// Custom hook for deleting an edge
export function useDeleteEdge(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { id: string; board_id: string }) => {
      await deleteEdge(vars.id);
    },
    {
      onMutate: async (deletedEdge) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              return oldData.map((board) => {
                if (board.id === deletedEdge.board_id) {
                  return {
                    ...board,
                    edges: board.edges.filter(
                      (edge) => edge.id !== deletedEdge.id
                    ),
                  };
                } else {
                  return board;
                }
              });
            } else {
              return [];
            }
          }
        );

        return { previousBoards };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-boards`,
          context?.previousBoards
        );
      },
    }
  );
}
// Custom hook for uploading images
export function useUploadImage(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(async (vars: { file: File; type: "Image" | "Map" }) => {
    const newImage: ImageProps | undefined = await uploadImage(
      project_id,
      vars.file,
      vars.type
    );
    if (newImage)
      queryClient.setQueryData(
        `${project_id}-images`,
        (oldData: ImageProps[] | undefined) => {
          if (oldData) {
            return [...oldData, newImage];
          } else {
            return [newImage];
          }
        }
      );

    return newImage;
  });
}
// Custom hook for getting images
export function useGetImages(project_id: string) {
  const { data, error, refetch, isLoading } = useQuery(
    `${project_id}-images`,
    async () => {
      const images = await getImages(project_id);
      return images;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  if (data)
    return {
      data,
      refetch,
      isLoading,
    };
  if (error) toastError("Error getting images (customHooks 1264)");
}
// Custom hook for deleting images
export function useDeleteImages(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: string[]) => {
      await deleteImagesStorage(vars);
    },
    {
      onMutate: async (deletedImageLinks) => {
        queryClient.setQueryData(
          `${project_id}-images`,
          (oldData: ImageProps[] | undefined) => {
            if (oldData) {
              return oldData.filter(
                (image) =>
                  !deletedImageLinks.some(
                    (delImgLink) => delImgLink === image.link
                  )
              );
            } else {
              return [];
            }
          }
        );
      },
    }
  );
}
// Custom hook for renaming an image
export function useRenameImage() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { id: string; newName: string; project_id: string }) => {
      await renameImage(vars.id, vars.newName);
    },
    {
      onMutate: async (renamedImage) => {
        const previousImages = queryClient.getQueryData(
          `${renamedImage.project_id}-images`
        );
        setTimeout(() => {
          queryClient.setQueryData(
            `${renamedImage.project_id}-images`,
            (oldData: ImageProps[] | undefined) => {
              if (oldData) {
                return oldData.map((image) => {
                  if (image.id === renamedImage.id) {
                    return {
                      ...image,
                      title: renamedImage.newName,
                    };
                  } else {
                    return image;
                  }
                });
              } else {
                return [];
              }
            }
          );
        }, 500);
        return { previousImages };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${newTodo?.project_id}-images`,
          context?.previousImages
        );
        toastError("Could not rename your image. (customHooks 1347)");
      },
    }
  );
}
