import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import cloneDeep from "lodash.clonedeep";
import set from "lodash.set";
import { MutableRefObject, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCreateItem,
  useCreateSubItem,
  useDeleteItem,
  useDeleteManySubItems,
  useUpdateItem,
  useUpdateManySubItems,
} from "../CRUD/ItemsCRUD";
import { baseURLS } from "../types/CRUDenums";
import { AllItemsType, AvailableItemTypes } from "../types/generalTypes";
import { BoardContext, BoardContextType, BoardType, NodeType } from "../types/ItemTypes/boardTypes";
import { CalendarType } from "../types/ItemTypes/calendarTypes";
import { TimelineType } from "../types/ItemTypes/timelineTypes";
import { SidebarTreeItemType } from "../types/treeTypes";
import {
  BoardReferenceAtom,
  DialogAtom,
  DrawerAtom,
  EdgesAtom,
  MapContextAtom,
  NodesAtom,
  OtherContextMenuAtom,
  UserAtom,
} from "./Atoms/atoms";
import { changeLockState } from "./boardUtils";
import { deleteItem } from "./Confirms/Confirm";
import { FetchFunction } from "./CRUD/CRUDFetch";
import { DefaultNode } from "./DefaultValues/BoardDefaults";
import { DefaultDialog, DefaultDrawer } from "./DefaultValues/DrawerDialogDefaults";
import { toaster } from "./toast";
import { getItemNameForTree } from "./transform";

export type BoardContextMenuType = {
  type: BoardContextType;
  boardContext: BoardContext;
  item_id: string;
  board: BoardType;
};

export function useMapContextMenuItems({
  mapRef,
  bounds,
  deleteMapPin,
}: {
  mapRef: MutableRefObject<any>;
  bounds: number[][];
  deleteMapPin: UseMutationResult<Response | null, unknown, string, unknown>;
}) {
  const [mapContext] = useAtom(MapContextAtom);
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const items =
    mapContext.type === "map"
      ? [
          {
            command: () => {
              setDrawer({ ...DefaultDrawer, data: drawer?.data, position: "right", show: true, type: "map_pins" });
            },
            icon: "pi pi-fw pi-map-marker",
            label: "New Pin",
          },
          {
            command: () => mapRef?.current?.fitBounds(bounds),
            label: "Fit Map",
          },
        ]
      : [
          {
            command: () =>
              setDrawer((prev) => ({ ...prev, data: mapContext?.data, position: "right", show: true, type: "map_pins" })),
            icon: "pi pi-fw pi-pencil",
            label: "Edit Pin",
          },
          {
            command: () => {
              if (drawer?.id) deleteMapPin.mutate(drawer.id);
            },
            icon: "pi pi-fw pi-trash",
            label: "Delete Pin",
          },
        ];

  return items;
}
export function useBoardContextMenuItems({ type, boardContext, item_id, board }: BoardContextMenuType) {
  const boardRef = useAtomValue(BoardReferenceAtom);
  const setNodes = useSetAtom(NodesAtom);
  const setEdges = useSetAtom(EdgesAtom);
  const setDialog = useSetAtom(DialogAtom);
  const updateManyNodes = useUpdateManySubItems(item_id, "nodes");
  const createNodeMutation = useCreateSubItem<NodeType>(item_id as string, "nodes", "boards");
  const deleteManyNodes = useDeleteManySubItems(item_id as string, "nodes");

  const deleteManyEdges = useDeleteManySubItems(item_id as string, "edges");

  const nodes = boardRef?.nodes(":selected");
  const edges = boardRef?.edges(":selected");
  if (type === "board")
    return [
      {
        command: () => {
          if (boardContext.x && boardContext.y) {
            const id = crypto.randomUUID();
            setNodes((prev) => [
              ...prev,
              {
                data: {
                  label: "",
                  ...DefaultNode,
                  id,
                  classes: "boardNode",
                  type: board?.defaultNodeShape || "rectangle",
                  backgroundColor: board?.defaultNodeColor || "#595959",
                  zIndexCompare: "auto",
                },
                locked: false,
                position: {
                  x: boardContext.x as number,
                  y: boardContext.y as number,
                },
              },
            ]);
            createNodeMutation.mutate({
              ...DefaultNode,
              type: board?.defaultNodeShape,
              backgroundColor: board?.defaultNodeColor,
              x: boardContext.x,
              y: boardContext.y,
              parentId: item_id as string,
              id,
            });
          } else toaster("error", "There was an error creating your node (missing X and Y).");
        },
        label: "New Node",
      },
      {
        label: "Un/Lock Nodes",
        items: [
          {
            label: "Unlock Selected",
            icon: "pi pi-fw pi-lock",
            command: () => {
              if (boardRef) {
                const selectedNodes = boardRef.nodes(":selected");
                changeLockState(boardRef, false, updateManyNodes);
                const ids = selectedNodes.map((n) => n.data().id);
                setNodes((prev) => {
                  const newNodes = prev.map((n) => {
                    if (ids.includes(n.data.id)) return { ...n, locked: false };
                    return n;
                  });
                  return newNodes;
                });
              }
            },
          },
          {
            label: "Lock Selected",
            icon: "pi pi-fw pi-unlock",
            command: () => {
              if (boardRef) {
                const selectedNodes = boardRef.nodes(":selected");
                const ids = selectedNodes.map((n) => n.data().id);

                changeLockState(boardRef, true, updateManyNodes);
                setNodes((prev) => {
                  const newNodes = prev.map((n) => {
                    if (ids.includes(n.data.id)) return { ...n, locked: true };
                    return n;
                  });
                  return newNodes;
                });
              }
            },
          },
        ],
      },
      {
        label: "View",
        items: [
          {
            label: "Go to center of nodes",
            command: () => boardRef?.center(),
          },
          {
            label: "Fit view to nodes",
            command: () => {
              if (boardRef)
                boardRef.animate(
                  {
                    fit: {
                      padding: 0,
                      eles: boardRef.nodes(),
                    },
                  },
                  {
                    duration: 1250,
                  },
                );
            },
          },
        ],
      },
      {
        label: "Quick Create",
        items: [
          {
            label: "From Document",
            command: () => setDialog({ ...DefaultDialog, position: "left", type: "node_from_document", show: true }),
          },
          {
            label: "From Image",
            command: () => setDialog({ ...DefaultDialog, position: "left", type: "node_from_image", show: true }),
          },
        ],
      },
      { separator: true },
      {
        label: "Delete Selected Nodes",
        command: () => {
          if (boardRef) {
            const ids: string[] = boardRef.nodes(":selected").map((node: any) => node.data().id);
            setEdges((prev) => prev.filter((e) => !ids.includes(e.data.source) && !ids.includes(e.data.target)));
            setNodes((prev) =>
              prev.filter((n) => {
                return !ids.includes(n.data.id as string);
              }),
            );
            deleteManyNodes.mutate(ids);
          }
        },
      },
    ];

  if (type === "nodes")
    return [
      {
        label: "Center Nodes",
        command: () => {
          if (boardRef && boardContext.nodes) boardRef.center(boardContext.nodes);
        },
      },
      {
        label: "Highlight Connected Nodes",
        command: () => {
          if (nodes) {
            const incomers = nodes.incomers();
            const outgoers = nodes.outgoers();
            incomers.nodes().flashClass("incomingNodeHighlight", 1500);
            incomers.edges().flashClass("incomingEdgeHighlight", 1500);
            outgoers.nodes().flashClass("outgoingNodeHighlight", 1500);
            outgoers.edges().flashClass("outgoingEdgeHighlight", 1500);
          }
        },
      },
      {
        label: "Un/Lock Nodes",
        items: [
          {
            label: "Unlock selected",
            icon: "pi pi-fw pi-lock-open",
            command: () => {
              if (boardRef) {
                changeLockState(boardRef, false, updateManyNodes);
                const selectedNodes = boardRef.nodes(":selected");
                const ids = selectedNodes.map((n) => n.data().id);

                setNodes((prev) => {
                  const newNodes = prev.map((n) => {
                    if (ids.includes(n.data.id)) return { ...n, locked: false };
                    return n;
                  });
                  return newNodes;
                });
              }
            },
          },
          {
            label: "Lock selected",
            icon: "pi pi-fw pi-lock",
            command: () => {
              if (boardRef) {
                changeLockState(boardRef, true, updateManyNodes);
                const selectedNodes = boardRef.nodes(":selected");
                const ids = selectedNodes.map((n) => n.data().id);

                setNodes((prev) => {
                  const newNodes = prev.map((n) => {
                    if (ids.includes(n.data.id)) return { ...n, locked: true };
                    return n;
                  });
                  return newNodes;
                });
              }
            },
          },
        ],
      },
      { separator: true },
      { label: "Template From Node" },
      {
        label: "Delete Selected Nodes",
        command: () => {
          if (!boardRef || !nodes || !edges) return;
          const selected = boardRef.elements(":selected");
          if (selected.length === 0) {
            toaster("warning", "No elements are selected.");
          } else {
            const nodeIds = nodes.map((node) => node.id());
            const edgeIds = edges.map((edge) => edge.id());
            setEdges((prev) =>
              prev.filter((e) => {
                if (edgeIds.includes(e.data.id as string)) return false;
                if (nodeIds.includes(e.data.source)) return false;
                if (nodeIds.includes(e.data.target)) return false;
                return true;
              }),
            );
            setNodes((prev) =>
              prev.filter((n) => {
                return !nodeIds.includes(n.data.id as string);
              }),
            );
            if (nodes.length) deleteManyNodes.mutate(nodes.map((node) => node.id()));
            if (edges.length) deleteManyEdges.mutate(edges.map((edge) => edge.id()));
          }
        },
      },
    ];
  if (type === "edges")
    return [
      {
        label: "Highlight Connected Nodes",
        command: () => {
          if (edges) {
            edges.sources().flashClass("incomingNodeHighlight", 2000);
            edges.targets().flashClass("outgoingNodeHighlight", 2000);
          }
        },
      },
      {
        label: "Delete Selected Edges",
        command: () => {
          if (edges) deleteManyEdges.mutate(edges.map((edge: any) => edge.id()));
        },
      },
    ];
  return [];
}

export function useTreeMenuItems(cmType: SidebarTreeItemType, type: AvailableItemTypes, project_id: string) {
  const createItemMutation = useCreateItem<AllItemsType>(type);
  const updateItemMutation = useUpdateItem<AllItemsType>(type, project_id as string);
  const deleteItemMutation = useDeleteItem(type, project_id);
  const [, setDrawer] = useAtom(DrawerAtom);
  const [, setDialog] = useAtom(DialogAtom);
  const User = useAtomValue(UserAtom);
  const navigate = useNavigate();

  if (cmType?.folder) {
    const folderItems = [
      {
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              exceptions: {},
              id: cmType.data.id,
              position: "right",
              show: true,
              type: cmType?.type,
            });
        },
        icon: "pi pi-fw pi-pencil",
        label: "Edit Folder",
      },

      {
        command: () => {
          if (cmType.data?.id) {
            // if (items?.some((item) => item.parent === cmType.data?.id)) {
            //   toaster("error", "Cannot convert to file if folder contains files.");
            //   return;
            // }
            updateItemMutation?.mutate({
              folder: false,
              id: cmType.data.id,
            });
          }
        },
        icon: "pi pi-fw, pi-file",
        label: "Change To File",
      },
      {
        icon: "pi pi-fw pi-plus",
        items: [
          {
            command: () => {
              if (cmType.data?.id)
                createItemMutation.mutate({
                  title: `New ${getItemNameForTree(type)}`,
                  project_id: project_id as string,
                  folder: false,
                  parentId: cmType.data?.id,
                });
            },
            icon: "pi pi-fw pi-plus",
            label: `Insert ${getItemNameForTree(type)}`,
          },
          {
            command: () => {
              if (cmType.data?.id)
                createItemMutation.mutate({
                  title: "New Folder",
                  project_id: project_id as string,
                  folder: true,
                  parentId: cmType.data?.id,
                });
            },
            icon: "pi pi-fw pi-folder",
            label: "Insert Folder",
          },
        ],
        label: "Insert Into Folder",
      },
      { separator: true },
      {
        command: () =>
          deleteItem(
            "Are you sure you want to delete this folder? This will delete all items within the folder!",
            () => {
              if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
            },
            () => {},
            "Delete folder and ALL of its children.",
          ),
        icon: "pi pi-fw pi-trash",
        label: "Delete Folder",
      },
    ];
    return folderItems;
  }
  if (cmType?.template) {
    const templateItems = [
      {
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              exceptions: {},
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "documents",
            });
        },
        icon: "pi pi-fw pi-pencil",
        label: "Edit Document",
      },

      {
        icon: "pi pi-fw pi-copy",
        label: "Create Doc From Template",
        // command: () => {},
      },
      { separator: true },
      {
        icon: "pi pi-fw pi-trash",
        label: "Delete Document",
        command: () =>
          deleteItem("Are you sure you want to delete this template?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
      },
    ];
    return templateItems;
  }
  if (cmType.type === "documents") {
    const docItems = [
      {
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "documents",
            });
        },
        icon: "pi pi-fw pi-pencil",
        label: "Edit Document",
      },

      {
        command: () => {
          if (cmType.data?.id) {
            updateItemMutation?.mutate({
              folder: true,
              id: cmType.data.id,
            });
          }
        },
        icon: "pi pi-fw pi-folder",
        label: "Change To Folder",
      },
      {
        command: () => {
          if (cmType.data) {
            createItemMutation?.mutate({
              ...cmType.data,
              id: crypto.randomUUID(),
              parentId: null,
              parent: undefined,
              project_id: project_id as string,
              template: true,
            });
          }
        },
        icon: "pi pi-fw pi-copy",
        label: "Covert to Template",
      },

      { separator: true },
      {
        label: "Toggle Public",
        icon: `pi pi-fw ${cmType?.data && "isPublic" in cmType.data && cmType.data?.isPublic ? "pi-eye" : "pi-eye-slash"}`,
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data) {
            updateItemMutation.mutate({ id: cmType.data?.id, isPublic: !cmType.data?.isPublic });
          }
        },
      },
      {
        icon: "pi pi-fw pi-external-link",
        label: "View Public Document",
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data && !cmType.data?.isPublic) {
            toaster("warning", "Document is set to private.");
            return;
          }
          if (cmType.data?.id) navigate(`/view/documents/${cmType.data?.id}`);
        },
      },
      {
        icon: "pi pi-fw pi-link",
        label: "Copy Public URL",
        command: () => {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.host}/view/documents/${cmType?.data?.id}`).then(() => {
              toaster("success", "URL copied! 🔗");
            });
          }
        },
      },
      {
        label: "Send to Discord",
        icon: "pi pi-fw pi-discord",
        items: User?.webhooks?.length
          ? User.webhooks.map((webhook, idx) => ({
              label: webhook?.title || `Webhook ${idx + 1}`,
              command: async () => {
                if (cmType?.data && "isPublic" in cmType.data && !cmType.data?.isPublic) {
                  toaster("warning", "Document must be public to send to discord.");
                  return;
                }
                await FetchFunction({
                  url: `${baseURLS.baseServer}sendpublicitem`,
                  method: "POST",
                  body: JSON.stringify({
                    id: cmType?.data?.id,
                    item_type: "documents",
                    project_id,
                    webhook_url: webhook.url,
                  }),
                });
              },
            }))
          : [
              {
                label: "Add Webhooks",
                icon: "pi pi-fw pi-plus",
                command: () => navigate(`/user/${User?.id}`),
              },
            ],
      },
      {
        command: () =>
          deleteItem("Are you sure you want to delete this document?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),

        icon: "pi pi-fw pi-trash",
        label: "Delete Document",
      },
    ];

    return docItems;
  }
  if (cmType.type === "maps") {
    const mapItems = [
      {
        label: "Update Map",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "maps",
            });
        },
      },
      {
        label: "Toggle Public",
        icon: `pi pi-fw ${cmType?.data && "isPublic" in cmType.data && cmType.data?.isPublic ? "pi-eye" : "pi-eye-slash"}`,
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data) {
            updateItemMutation.mutate({ id: cmType.data?.id, isPublic: !cmType.data?.isPublic });
          }
        },
      },
      {
        label: "Manage Layers",
        icon: "pi pi-clone",
        command: () =>
          setDialog((prev) => ({ ...prev, position: "top-left", data: cmType?.data, show: true, type: "map_layer" })),
      },
      { separator: true },
      {
        label: "View Public Map",
        icon: "pi pi-fw pi-external-link",
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data && !cmType.data?.isPublic) {
            toaster("warning", "Map is set to private.");
            return;
          }
          if (cmType.data?.id) navigate(`/view/maps/${cmType.data?.id}`);
        },
      },
      {
        label: "Copy Public URL",
        icon: "pi pi-fw pi-link",
        command: () => {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.host}/view/maps/${cmType?.data?.id}`).then(() => {
              toaster("success", "URL copied! 🔗");
            });
          }
        },
      },
      {
        label: "Send to Discord",
        icon: "pi pi-fw pi-discord",
        items: User?.webhooks?.length
          ? User.webhooks.map((webhook, idx) => ({
              label: webhook?.title || `Webhook ${idx + 1}`,
              command: async () => {
                if (cmType?.data && "isPublic" in cmType.data && !cmType.data?.isPublic) {
                  toaster("warning", "Map must be public to send to discord.");
                  return;
                }
                await FetchFunction({
                  url: `${baseURLS.baseServer}sendpublicitem`,
                  method: "POST",
                  body: JSON.stringify({
                    id: cmType?.data?.id,
                    item_type: "maps",
                    project_id,
                    webhook_url: webhook.url,
                  }),
                });
              },
            }))
          : [
              {
                label: "Add Webhooks",
                icon: "pi pi-fw pi-plus",
                command: () => navigate(`/user/${User?.id}`),
              },
            ],
      },
      {
        label: "Delete Map",
        icon: "pi pi-fw pi-trash",
        command: () =>
          deleteItem("Are you sure you want to delete this map?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
      },
    ];
    return mapItems;
  }
  if (cmType.type === "boards") {
    const boardItems = [
      {
        label: "Update Board",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "boards",
            });
        },
      },

      {
        label: "Toggle Public",
        icon: `pi pi-fw ${cmType?.data && "isPublic" in cmType.data && cmType.data?.isPublic ? "pi-eye" : "pi-eye-slash"}`,
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data) {
            updateItemMutation.mutate({ id: cmType.data?.id, isPublic: !cmType.data?.isPublic });
          }
        },
      },
      { separator: true },
      {
        label: "View Public Board",
        icon: "pi pi-fw pi-external-link",
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data && !cmType?.data?.isPublic) {
            toaster("warning", "Board is set to private.");
            return;
          }
          if (cmType.data?.id) navigate(`/view/boards/${cmType.data?.id}`);
        },
      },
      {
        label: "Copy Public URL",
        icon: "pi pi-fw pi-link",
        command: () => {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.host}/view/boards/${cmType?.data?.id}`).then(() => {
              toaster("success", "URL copied! 🔗");
            });
          }
        },
      },
      {
        label: "Send to Discord",
        icon: "pi pi-fw pi-discord",
        items: User?.webhooks?.length
          ? User.webhooks.map((webhook, idx) => ({
              label: webhook?.title || `Webhook ${idx + 1}`,
              command: async () => {
                if (cmType?.data && "isPublic" in cmType.data && !cmType.data?.isPublic) {
                  toaster("warning", "Board must be public to send to discord.");
                  return;
                }
                await FetchFunction({
                  url: `${baseURLS.baseServer}sendpublicitem`,
                  method: "POST",
                  body: JSON.stringify({
                    id: cmType?.data?.id,
                    item_type: "boards",
                    project_id,
                    webhook_url: webhook.url,
                  }),
                });
              },
            }))
          : [
              {
                label: "Add Webhooks",
                icon: "pi pi-fw pi-plus",
                command: () => navigate(`/user/${User?.id}`),
              },
            ],
      },
      {
        label: "Delete Board",
        icon: "pi pi-fw pi-trash",
        command: () =>
          deleteItem("Are you sure you want to delete this board?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
      },
    ];

    return boardItems;
  }
  if (cmType.type === "calendars") {
    const screenItems = [
      {
        label: "Update Calendar",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "calendars",
            });
        },
      },
      {
        label: "Toggle Public",
        icon: `pi pi-fw ${cmType?.data && "isPublic" in cmType.data && cmType.data?.isPublic ? "pi-eye" : "pi-eye-slash"}`,
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data) {
            updateItemMutation.mutate({ id: cmType.data?.id, isPublic: !cmType.data?.isPublic });
          }
        },
      },

      { separator: true },
      {
        label: "View Public Calendar",
        icon: "pi pi-fw pi-external-link",
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data && !cmType?.data?.isPublic) {
            toaster("warning", "Calendar is set to private.");
            return;
          }
          if (cmType.data?.id) navigate(`/view/calendars/${cmType.data?.id}`);
        },
      },
      {
        label: "Copy Public URL",
        icon: "pi pi-fw pi-link",
        command: () => {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.host}/view/calendars/${cmType?.data?.id}`).then(() => {
              toaster("success", "URL copied! 🔗");
            });
          }
        },
      },

      {
        label: "Delete Calendar",
        icon: "pi pi-fw pi-trash",
        command: () =>
          deleteItem("Are you sure you want to delete this calendar?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
      },
    ];
    return screenItems;
  }
  if (cmType.type === "timelines") {
    const timelineItems = [
      {
        label: "Update Timeline",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "timelines",
            });
        },
      },
      {
        label: "Toggle Public",
        icon: `pi pi-fw ${cmType?.data && "isPublic" in cmType.data && cmType.data?.isPublic ? "pi-eye" : "pi-eye-slash"}`,
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data) {
            updateItemMutation.mutate({ id: cmType.data?.id, isPublic: !cmType.data?.isPublic });
          }
        },
      },

      { separator: true },
      {
        label: "View Public Timeline",
        icon: "pi pi-fw pi-external-link",
        command: () => {
          if (cmType?.data && "isPublic" in cmType.data && !cmType?.data?.isPublic) {
            toaster("warning", "Timeline is set to private.");
            return;
          }
          if (cmType.data?.id) navigate(`/view/timelines/${cmType.data?.id}`);
        },
      },
      {
        label: "Copy Public URL",
        icon: "pi pi-fw pi-link",
        command: () => {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.host}/view/timelines/${cmType?.data?.id}`).then(() => {
              toaster("success", "URL copied! 🔗");
            });
          }
        },
      },
      {
        label: "Delete Timeline",
        icon: "pi pi-fw pi-trash",
        command: () =>
          deleteItem("Are you sure you want to delete this timeline?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
      },
    ];
    return timelineItems;
  }
  if (cmType.type === "screens") {
    const screenItems = [
      {
        label: "Update Screen",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "screens",
            });
        },
      },
      // {
      //   label: "Toggle Public",
      //   icon: `pi pi-fw ${cmType?.data && "isPublic" in cmType.data && cmType.data?.isPublic ? "pi-eye" : "pi-eye-slash"}`,
      //   command: () => {
      //     if (cmType?.data && "isPublic" in cmType.data) {
      //       updateItemMutation.mutate({ id: cmType.data?.id, isPublic: !cmType.data?.isPublic });
      //     }
      //   },
      // },

      { separator: true },
      // {
      //   label: "View Public Screen",
      //   icon: "pi pi-fw pi-external-link",
      //   command: () => {
      //     if (cmType?.data && "isPublic" in cmType.data && !cmType.data?.isPublic) {
      //       toaster("warning", "Screen is set to private.");
      //       return;
      //     }
      //     if (cmType.data?.id) navigate(`/view/screens/${cmType.data?.id}`);
      //   },
      // },
      // {
      //   label: "Copy Public URL",
      //   icon: "pi pi-fw pi-link",
      // },
      {
        label: "Delete Screen",
        icon: "pi pi-fw pi-trash",
        command: () =>
          deleteItem("Are you sure you want to delete this screen?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
      },
    ];
    return screenItems;
  }
  if (cmType.type === "dictionaries") {
    const dictionaryItems = [
      {
        label: "Update Dictionary",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "dictionaries",
            });
        },
      },
      // {
      //   label: "Toggle Public",
      //   icon: `pi pi-fw ${cmType?.data && "isPublic" in cmType.data && cmType.data?.isPublic ? "pi-eye" : "pi-eye-slash"}`,
      //   command: () => {
      //     if (cmType?.data && "isPublic" in cmType.data) {
      //       updateItemMutation.mutate({ id: cmType.data?.id, isPublic: !cmType.data?.isPublic });
      //     }
      //   },
      // },

      { separator: true },
      // {
      //   label: "View Public Screen",
      //   icon: "pi pi-fw pi-external-link",
      //   command: () => {
      //     if (cmType?.data && "isPublic" in cmType.data && !cmType.data?.isPublic) {
      //       toaster("warning", "Screen is set to private.");
      //       return;
      //     }
      //     if (cmType.data?.id) navigate(`/view/screens/${cmType.data?.id}`);
      //   },
      // },
      // {
      //   label: "Copy Public URL",
      //   icon: "pi pi-fw pi-link",
      // },
      {
        label: "Delete Dictionary",
        icon: "pi pi-fw pi-trash",
        command: () =>
          deleteItem("Are you sure you want to delete this dictionary?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
      },
    ];
    return dictionaryItems;
  }
  if (cmType.type === "randomtables") {
    const screenItems = [
      {
        label: "Update Random Table",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "randomtables",
            });
        },
      },
      // {
      //   label: "Toggle Public",
      //   icon: `pi pi-fw ${cmType?.data && "isPublic" in cmType.data && cmType.data?.isPublic ? "pi-eye" : "pi-eye-slash"}`,
      //   command: () => {
      //     if (cmType?.data && "isPublic" in cmType.data) {
      //       updateItemMutation.mutate({ id: cmType.data?.id, isPublic: !cmType.data?.isPublic });
      //     }
      //   },
      // },

      { separator: true },
      // {
      //   label: "View Public Screen",
      //   icon: "pi pi-fw pi-external-link",
      //   command: () => {
      //     if (cmType?.data && "isPublic" in cmType.data && !cmType.data?.isPublic) {
      //       toaster("warning", "Screen is set to private.");
      //       return;
      //     }
      //     if (cmType.data?.id) navigate(`/view/screens/${cmType.data?.id}`);
      //   },
      // },
      // {
      //   label: "Copy Public URL",
      //   icon: "pi pi-fw pi-link",
      // },
      {
        label: "Roll to Discord",
        icon: "pi pi-fw pi-discord",
        items: User?.webhooks?.length
          ? User.webhooks.map((webhook, idx) => ({
              label: webhook?.title || `Webhook ${idx + 1}`,
              command: async () => {
                await FetchFunction({
                  url: `${baseURLS.baseServer}sendpublicitem`,
                  method: "POST",
                  body: JSON.stringify({
                    id: cmType?.data?.id,
                    item_type: "random_tables",
                    project_id,
                    webhook_url: webhook.url,
                  }),
                });
              },
            }))
          : [
              {
                label: "Add Webhooks",
                icon: "pi pi-fw pi-plus",
                command: () => navigate(`/user/${User?.id}`),
              },
            ],
      },
      {
        label: "Delete Random Table",
        icon: "pi pi-fw pi-trash",
        command: () =>
          deleteItem("Are you sure you want to delete this random table?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
      },
    ];
    return screenItems;
  }
  const rootItems = [
    {
      // command: () => {},
      icon: "pi pi-fw pi-file",
      label: "New Document",
    },
    {
      // command: () => {},
      icon: "pi pi-fw pi-folder",
      label: "New Folder",
    },
  ];
  return rootItems;
}

export function useEditorMenuItems() {
  const [, setDrawer] = useAtom(DrawerAtom);
  const [mentionContext] = useAtom(OtherContextMenuAtom);
  const finalItems = [
    {
      command: () => {
        setDrawer({
          ...DefaultDrawer,
          data: mentionContext,
          position: "right",
          drawerSize: "sm",
          show: true,
          type: "insert_word",
        });
      },
      icon: "pi pi-fw pi-bookmark",
      label: "Insert from dictionary",
    },
  ];
  if (mentionContext?.data?.id) {
    finalItems.push({
      command: () => {
        setDrawer({ ...DefaultDrawer, data: mentionContext, position: "right", drawerSize: "lg", show: true, type: "mention" });
      },
      icon: "pi pi-fw pi-book",
      label: "Show in drawer",
    });
  }
  return finalItems;
}

export function useEventMenuItems(item_id: string, itemType: "calendars" | "timelines") {
  const setDrawer = useSetAtom(DrawerAtom);
  const [contextMenuData, setContextMenuData] = useAtom(OtherContextMenuAtom);
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => setContextMenuData({ ...contextMenuData, data: null });
  }, []);

  const finalItems = [
    {
      command: () => {
        setDrawer({
          ...DefaultDrawer,
          data: contextMenuData?.data,
          position: "right",
          drawerSize: "sm",
          show: true,
          type: "events",
        });
      },
      icon: "pi pi-fw pi-bookmark",
      label: "Edit event",
    },
    {
      icon: "pi pi-fw pi-trash",
      label: "Delete event",
      command: () => {
        if (contextMenuData?.data?.event?.id) {
          deleteItem("Are you sure you want to delete this event?", async () => {
            await FetchFunction({
              url: `${baseURLS.baseServer}deleteevent`,
              method: "DELETE",
              body: JSON.stringify({ id: contextMenuData?.data?.event?.id }),
            });

            queryClient.setQueryData<CalendarType | TimelineType>([itemType, item_id], (oldData) => {
              if (oldData) {
                if (itemType === "calendars") {
                  const monthIdx =
                    "monthsId" in contextMenuData.data.event && "months" in oldData
                      ? oldData?.months?.findIndex((month) => month.id === contextMenuData.data.event.monthsId)
                      : null;

                  if (typeof monthIdx === "number" && monthIdx !== -1 && "months" in oldData) {
                    const newData = cloneDeep(oldData);
                    const newEvents = [...newData.months[monthIdx].events].filter(
                      (ev) => ev.id !== contextMenuData.data.event.id,
                    );
                    set(newData, `months[${monthIdx}].events`, newEvents);
                    return newData;
                  }
                }
                if (itemType === "timelines") {
                  const calendarIdx =
                    "calendarsId" in contextMenuData.data.event && "calendars" in oldData
                      ? oldData?.calendars?.findIndex((cal) => cal.id === contextMenuData.data.event.calendarsId)
                      : null;
                  if (typeof calendarIdx === "number" && calendarIdx !== -1 && "calendars" in oldData) {
                    const newData = cloneDeep(oldData);
                    const newEvents = [...oldData.calendars[calendarIdx].events].filter(
                      (ev) => ev.id !== contextMenuData.data.event.id,
                    );
                    set(newData, `calendars[${calendarIdx}].events`, newEvents);
                    return { ...newData };
                  }
                }
              }

              return oldData;
            });
            toaster("success", "Event deleted successfully");
          });
        }
      },
    },
  ];

  return finalItems;
}
