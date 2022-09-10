import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RemirrorJSON } from "remirror";
import {
  DocumentCreateProps,
  DocumentProps,
  DocumentUpdateProps,
  ImageProps,
  ProjectProps,
} from "../custom-types";
import {
  BoardNodeProps,
  BoardProps,
  CreateBoardProps,
  CreateEdgeProps,
  CreateNodeProps,
  UpdateEdgeProps,
  UpdateNodeProps,
} from "../types/BoardTypes";
import {
  CreateMapLayerProps,
  MapProps,
  MapUpdateProps,
  UpdateMapLayerProps,
  UpdateMapMarkerProps,
} from "../types/MapTypes";
import {
  TimelineEventCreateType,
  TimelineEventUpdateType,
} from "../types/TimelineEventTypes";
import {
  TimelineCreateType,
  TimelineType,
  TimelineUpdateType,
} from "../types/TimelineTypes";
import {
  createTimeline,
  deleteTimeline,
  getTimelines,
  updatedTimeline,
} from "./CRUD/TimelineCRUD";
import {
  createTimelineEvent,
  updatedTimelineEvent,
} from "./CRUD/TimelineEventsCRUD";
import {
  createBoard,
  createDocument,
  createEdge,
  createManyEdges,
  createManyNodes,
  createMap,
  createMapLayer,
  createMapMarker,
  createNode,
  createTemplate,
  deleteBoard,
  deleteDocument,
  deleteEdge,
  deleteImagesStorage,
  deleteManyEdges,
  deleteManyNodes,
  deleteMap,
  deleteMapLayer,
  deleteMapMarker,
  deleteNode,
  getBoards,
  getCurrentProject,
  getDocuments,
  getImages,
  getMaps,
  getSingleBoard,
  getSingleMap,
  getTags,
  renameImage,
  sortBoardsChildren,
  sortDocumentsChildren,
  sortMapsChildren,
  updateBoard,
  updateDocument,
  updateEdge,
  updateMap,
  updateMapLayer,
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
export function useGetDocuments(project_id: string, enabled?: boolean) {
  const { data, isLoading } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id),
    {
      staleTime: 5 * 60 * 1000,
      enabled: enabled === undefined || enabled === true,
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
    async (vars: DocumentCreateProps) => {
      await createDocument({ ...vars, project_id });
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
                  ...newDocument,
                  // @ts-ignore
                  parent:
                    newDocument.parent && parent
                      ? { id: parent?.id, title: parent?.title }
                      : null,

                  alter_names: [],
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
                  alter_names: [],
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
                  map_layers: [],
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
                  map_layers: [],
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
export function useGetMapData(
  project_id: string,
  map_id: string,
  public_view: boolean
) {
  const queryClient = useQueryClient();
  const { data: map } = useQuery(
    `map-${map_id}`,
    async () => await getSingleMap(map_id as string),
    { enabled: public_view }
  );

  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  if (maps && map_id) {
    const map = maps.find((map) => map.id === map_id);
    if (map) {
      return map;
    } else {
      return null;
    }
  } else {
    if (public_view && map) return map;
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
      public: boolean;
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
    async (vars: UpdateMapMarkerProps & { project_id: string }) => {
      await updateMapMarker(vars);
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
                        Object.keys(updatedMarker).forEach((key) => {
                          if (
                            updatedMarker[key as keyof UpdateMapMarkerProps] ===
                              undefined ||
                            key === "project_id"
                          ) {
                            delete updatedMarker[
                              key as keyof UpdateMapMarkerProps
                            ];
                          }
                        });
                        return {
                          ...marker,
                          ...updatedMarker,
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

// Custom hook for creating a map layer
export function useCreateMapLayer(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: CreateMapLayerProps) => {
      await createMapLayer({ ...vars });
    },
    {
      onMutate: async (newLayer) => {
        const previousMaps = queryClient.getQueryData(`${project_id}-maps`);
        queryClient.setQueryData(
          `${project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              // Template shouldn't have parent hence null
              let newData: MapProps[] = oldData.map((map) => {
                if (map.id === newLayer.map_id) {
                  return {
                    ...map,
                    // Check if map layers is iterable
                    map_layers: map.map_layers
                      ? [...map.map_layers, { ...newLayer, image: undefined }]
                      : [{ ...newLayer, image: undefined }],
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
        toastError("There was an error creating this map layer.");
      },
    }
  );
}
// Custom hook to update map layer
export function useUpdateMapLayer(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: UpdateMapLayerProps) => {
      await updateMapLayer(vars);
    },
    {
      onMutate: async (updatedLayer) => {
        const previousMaps = queryClient.getQueryData(`${project_id}-maps`);
        queryClient.setQueryData(
          `${project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              let newData: MapProps[] = oldData.map((map) => {
                if (map.id === updatedLayer.map_id) {
                  return {
                    ...map,
                    map_layers: map.map_layers.map((layer) => {
                      if (layer.id === updatedLayer.id) {
                        layer = {
                          ...layer,
                          title: updatedLayer.title || layer.title,
                          image: updatedLayer.image || layer.image,
                          public:
                            updatedLayer.public !== undefined
                              ? updatedLayer.public
                              : layer.public,
                        };
                      }
                      return layer;
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
        queryClient.setQueryData(`${project_id}-maps`, context?.previousMaps);
        toastError("There was an error updating this map marker.");
      },
    }
  );
}
// Custom hook to delete map layers
export function useDeleteMapLayer() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { id: string; map_id: string; project_id: string }) => {
      await deleteMapLayer(vars.id);
    },
    {
      onMutate: async (deletedLayer) => {
        const previousMaps = queryClient.getQueryData(
          `${deletedLayer.project_id}-maps`
        );
        queryClient.setQueryData(
          `${deletedLayer.project_id}-maps`,
          (oldData: MapProps[] | undefined) => {
            if (oldData) {
              let newData: MapProps[] = oldData.map((map) => {
                if (map.id === deletedLayer.map_id) {
                  return {
                    ...map,
                    map_layers: map.map_layers.filter(
                      (layer) => layer.id !== deletedLayer.id
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
export function useGetBoardData(
  project_id: string,
  board_id: string,
  public_view: boolean
) {
  const queryClient = useQueryClient();

  const { data: board } = useQuery(
    `board-${board_id}`,
    async () => getSingleBoard(board_id as string),
    {
      // The query only runs in public view
      enabled: public_view,
    }
  );
  if (public_view && board) return board;
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
// Custom hook for deleting many nodes at once
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
    async (vars: CreateEdgeProps) => {
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
export function useDeleteManyEdges(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: { ids: string[]; board_id: string }) => {
      await deleteManyEdges(vars.ids);
    },
    {
      onMutate: async (deletedEdges) => {
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);
        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              return oldData.map((board) => {
                if (board.id === deletedEdges.board_id) {
                  return {
                    ...board,
                    edges: board.edges.filter(
                      (edge) => !deletedEdges.ids.includes(edge.id)
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

export function useGetTimelines(project_id: string) {
  const { data, isLoading } = useQuery(
    `${project_id}-timelines`,
    async () => await getTimelines(project_id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
  return { data, isLoading };
}

export function useCreateTimeline() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: TimelineCreateType) => {
      await createTimeline({ ...vars });
    },
    {
      onMutate: async (newTimeline) => {
        const previousTimelines = queryClient.getQueryData(
          `${newTimeline.project_id}-timelines`
        );
        const timelines: TimelineType[] | undefined = queryClient.getQueryData(
          `${newTimeline.project_id}-timelines`
        );
        let parent = newTimeline.parent
          ? timelines?.find((timelines) => timelines.id === newTimeline.parent)
          : null;
        queryClient.setQueryData(
          `${newTimeline.project_id}-timelines`,
          //   @ts-ignore
          (oldData: TimelineType[] | undefined) => {
            if (oldData) {
              let newData: TimelineType[] = [
                ...oldData,
                {
                  ...newTimeline,
                  // @ts-ignore
                  parent:
                    newTimeline.parent && parent
                      ? { id: parent?.id, title: parent?.title }
                      : null,
                  start_year: 0,
                  expanded: false,
                  public: false,
                  sort: oldData.length,
                  timeline_events: [],
                },
              ];
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousTimelines };
      },
      onError: (err, newTimeline, context) => {
        queryClient.setQueryData(
          `${newTimeline.project_id}-timelines`,
          context?.previousTimelines
        );
        toastError("There was an error creating this timeline.");
      },
    }
  );
}
export function useUpdateTimeline() {
  const queryClient = useQueryClient();

  return useMutation(
    async (vars: TimelineUpdateType) => {
      await updatedTimeline(vars);
    },
    {
      onMutate: async (updatedTimeline) => {
        const previousTimelines = queryClient.getQueryData(
          `${updatedTimeline.project_id}-timelines`
        );
        queryClient.setQueryData(
          `${updatedTimeline.project_id}-timelines`,
          (oldData: TimelineType[] | undefined) => {
            if (oldData) {
              let newParent = oldData.find(
                (doc) => doc.id === updatedTimeline.parent
              );
              let newData = oldData.map((timeline) => {
                if (timeline.id === updatedTimeline.id) {
                  return {
                    ...timeline,
                    ...updatedTimeline,
                    parent: newParent
                      ? { id: newParent.id, title: newParent.title }
                      : updatedTimeline.parent === null
                      ? null
                      : timeline.parent,
                  };
                } else {
                  return timeline;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousTimelines };
      },
      onError: (err, newTimeline, context) => {
        queryClient.setQueryData(
          `${newTimeline.project_id}-timelines`,
          context?.previousTimelines
        );
        toastError("There was an error updating this timeline.");
      },
    }
  );
}
export function useDeleteTimeline() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: Pick<TimelineType, "id" | "project_id">) => {
      await deleteTimeline(vars.id);
    },
    {
      onMutate: async (deletedTimeline) => {
        const previousTimelines = queryClient.getQueryData(
          `${deletedTimeline.project_id}-timelines`
        );
        queryClient.setQueryData(
          `${deletedTimeline.project_id}-timelines`,
          (oldData: TimelineType[] | undefined) => {
            if (oldData) {
              return oldData.filter(
                (timeline) => timeline.id !== deletedTimeline.id
              );
            } else {
              return [];
            }
          }
        );
        return { previousTimelines };
      },
      onError: (err, deletedTimeline, context) => {
        queryClient.setQueryData(
          `${deletedTimeline.project_id}-timelines`,
          context?.previousTimelines
        );
      },
    }
  );
}
export function useGetTimelineData(project_id: string, timeline_id: string) {
  const queryClient = useQueryClient();
  const timelines = queryClient.getQueryData<TimelineType[]>(
    `${project_id}-timelines`
  );
  if (timelines && timeline_id) {
    const timeline = timelines.find((timeline) => timeline.id === timeline_id);
    if (timeline) {
      return timeline;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function useCreateTimelineEvent(project_id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: TimelineEventCreateType) => {
      await createTimelineEvent({ ...vars });
    },
    {
      onMutate: async (newTimelineEvent) => {
        const previousTimelines = queryClient.getQueryData(
          `${project_id}-timelines`
        );

        queryClient.setQueryData(
          `${project_id}-timelines`,
          //   @ts-ignore
          (oldData: TimelineType[] | undefined) => {
            if (oldData) {
              let newData: TimelineType[] = oldData.map((timeline) => {
                if (timeline.id === newTimelineEvent.timeline_id) {
                  timeline.timeline_events = [
                    ...timeline.timeline_events,
                    newTimelineEvent,
                  ];
                }
                return timeline;
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousTimelines };
      },
      onError: (err, newTimeline, context) => {
        queryClient.setQueryData(
          `${project_id}-timelines`,
          context?.previousTimelines
        );
        toastError("There was an error creating this timeline event.");
      },
    }
  );
}
export function useUpdateTimelineEvent(project_id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (vars: TimelineEventUpdateType) => {
      await updatedTimelineEvent(vars);
    },
    {
      onMutate: async (updatedTimelineEvent) => {
        const previousTimelines = queryClient.getQueryData(
          `${project_id}-timelines`
        );
        queryClient.setQueryData(
          `${project_id}-timelines`,
          (oldData: TimelineType[] | undefined) => {
            if (oldData) {
              let newData = oldData.map((timeline) => {
                if (timeline.id === updatedTimelineEvent.timeline_id) {
                  timeline.timeline_events = timeline.timeline_events.map(
                    (event) => {
                      if (event.id === updatedTimelineEvent.id) {
                        return { ...event, ...updatedTimelineEvent };
                      }
                      return event;
                    }
                  );
                }
                return timeline;
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { previousTimelines };
      },
      onError: (err, updatedTimelineEvent, context) => {
        queryClient.setQueryData(
          `${project_id}-timelines`,
          context?.previousTimelines
        );
        toastError("There was an error updating this timeline event.");
      },
    }
  );
}

// Custom hook for copy-pasting nodes and edges in a board
export function useCopyPasteNodesEdges(project_id: string, board_id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (vars: {
      nodes: (CreateNodeProps & {
        document: {
          id: string;
          image?: {
            link?: string;
          };
        };
      })[];
      edges: CreateEdgeProps[];
    }) => {
      await createManyNodes(
        vars.nodes.map((node) => {
          const { document, ...rest } = node;
          return rest;
        })
      );
      await createManyEdges(vars.edges);
    },
    {
      onMutate: async (updatedData) => {
        console.log(updatedData);
        const previousBoards = queryClient.getQueryData(`${project_id}-boards`);

        queryClient.setQueryData(
          `${project_id}-boards`,
          (oldData: BoardProps[] | undefined) => {
            if (oldData) {
              let newData = oldData.map((board) => {
                if (board.id === board_id) {
                  return {
                    ...board,
                    nodes: [...board.nodes, ...updatedData.nodes],
                    edges: [...board.edges, ...updatedData.edges],
                  };
                }
                return board;
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
