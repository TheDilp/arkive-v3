import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { RemirrorJSON } from "remirror";
import {
  BoardProps,
  CreateNodeProps,
  DocumentProps,
  MapProps,
  ProjectProps,
  UpdateEdgeProps,
  UpdateNodeProps,
} from "../custom-types";
import {
  auth,
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
  deleteMap,
  deleteMapMarker,
  deleteNode,
  getBoards,
  getCurrentProject,
  getDocuments,
  getMaps,
  getTags,
  updateBoard,
  updateDocument,
  updateEdge,
  updateMap,
  updateMapMarker,
  updateNode,
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
                  expanded: false,
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
      expanded?: boolean;
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
        expanded: vars.expanded,
      }),
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
              let newData: DocumentProps[] = oldData.map((doc) => {
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
          (oldData: DocumentProps[] | undefined) => {
            if (oldData) {
              if (deletedDocument.folder) {
                let newData: DocumentProps[] = oldData
                  .filter((doc) => doc.id !== deletedDocument.doc_id)
                  .filter(
                    (doc) =>
                      !doc.parent || doc.parent.id !== deletedDocument.doc_id
                  );
                return newData;
              } else {
                let newData: DocumentProps[] = oldData.filter(
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
  const user_id = auth.user()?.id as string;
  return useMutation(
    async (vars: {
      id: string;
      project_id: string;
      title: string;
      map_image: string;
      folder?: boolean;
      parent?: string | null;
    }) => {
      await createMap({ ...vars });
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
                  parent: newMap.parent ? newMap.parent : "0",
                  user_id,
                  folder: newMap.folder ? newMap.folder : false,
                  markers: [],
                },
              ];
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
    async (vars: {
      id: string;
      title?: string;
      map_image?: string;
      parent?: string | null;
    }) => {
      await updateMap(vars);
    },
    {
      onMutate: async (updatedMap) => {
        const previousMaps = queryClient.getQueryData(`${project_id}-maps`);
        queryClient.setQueryData(
          `${project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              // Template shouldn't have parent hence null
              let newData: MapProps[] = oldData.map((map) => {
                if (map.id === updatedMap.id) {
                  return {
                    ...map,
                    ...updatedMap,
                    parent: updatedMap.parent ? updatedMap.parent : "0",
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
export function useCreateMapMarker() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      id: string;
      map_id: string;
      project_id: string;
      text?: string;
      icon?: string;
      color?: string;
      doc_id?: string;
      map_link?: string;
      lat: number;
      lng: number;
    }) => {
      await createMapMarker({ ...vars });
    },
    {
      onMutate: async (newMarker) => {
        const previousMaps = queryClient.getQueryData(
          `${newMarker.project_id}-maps`
        );
        queryClient.setQueryData(
          `${newMarker.project_id}-maps`,
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
        queryClient.setQueryData(
          `${newTodo.project_id}-documents`,
          context?.previousMaps
        );
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
    async (vars: {
      id: string;
      title: string;
      project_id: string;
      folder: boolean;
      parent?: string | null;
      nodes: [];
      edges: [];
    }) => {
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
                  parent: newBoard.parent ? newBoard.parent : "0",
                  nodes: [],
                  edges: [],
                },
              ];
            } else {
              return [newBoard];
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
    async (vars: { id: string; title?: string; parent?: string | null }) => {
      await updateBoard(vars);
    },
    {
      onMutate: async (updatedBoard) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              let newData = oldData.map((board) => {
                if (board.id === updatedBoard.id) {
                  return {
                    ...board,
                    ...updatedBoard,
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
      const newNode = await createNode({
        ...vars,
      });
      return newNode;
    },
    {
      onMutate: async (newNode) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              let newData = oldData.map((board) => {
                if (board.id === newNode.board_id) {
                  return {
                    ...board,
                    nodes: [
                      ...board.nodes,
                      {
                        ...newNode,
                        width: 50,
                        height: 50,
                        fontSize: 16,
                        backgroundColor: "#1e1e1e",
                        textHAlign: "center" as const,
                        textVAlign: "top" as const,
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
    async (vars: UpdateNodeProps & { board_id: string }) => {
      const { board_id, ...updateVars } = vars;
      await updateNode({ ...updateVars });
    },
    {
      onMutate: async (updatedNode) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              // Init document variable as undefined
              let document: { id: string; image: string } | undefined;
              // Then if there is a document that is linked, find it and map the data
              if (updatedNode.doc_id) {
                const documents: DocumentProps[] | undefined =
                  queryClient.getQueryData(`${project_id}-documents`);
                const doc = documents?.find(
                  (doc) => doc.id === updatedNode.doc_id
                );
                if (doc) document = { id: doc.id, image: doc.image };
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
