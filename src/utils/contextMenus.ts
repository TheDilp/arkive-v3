import { UseMutationResult } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { MutableRefObject } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCreateItem,
  useCreateSubItem,
  useDeleteItem,
  useDeleteManySubItems,
  useUpdateItem,
  useUpdateManySubItems,
} from "../CRUD/ItemsCRUD";
import { BoardContext, BoardContextType, BoardType } from "../types/boardTypes";
import { AvailableItemTypes } from "../types/generalTypes";
import { SidebarTreeItemType } from "../types/treeTypes";
import { BoardReferenceAtom, DialogAtom, DrawerAtom, MapContextAtom } from "./Atoms/atoms";
import { changeLockState } from "./boardUtils";
import { deleteItem } from "./Confirms/Confirm";
import { DefaultNode } from "./DefaultValues/BoardDefaults";
import { DefaultDialog, DefaultDrawer } from "./DefaultValues/DrawerDialogDefaults";
import { toaster } from "./toast";

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
              setDrawer({ ...DefaultDrawer, data: drawer?.data, position: "left", show: true, type: "map_pins" });
            },
            icon: "pi pi-fw pi-map-marker",
            label: "New Token",
          },
          {
            command: () => mapRef?.current?.fitBounds(bounds),
            label: "Fit Map",
          },
        ]
      : [
          {
            command: () => setDrawer((prev) => ({ ...prev, position: "left", show: true, type: "map_pins" })),
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
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [, setDialog] = useAtom(DialogAtom);
  const updateManyNodes = useUpdateManySubItems(item_id, "nodes");
  const createNodeMutation = useCreateSubItem(item_id as string, "nodes", "boards");
  const deleteManyNodes = useDeleteManySubItems(item_id as string, "nodes");

  const deleteManyEdges = useDeleteManySubItems(item_id as string, "edges");

  const nodes = boardRef?.nodes(":selected");
  const edges = boardRef?.edges(":selected");
  if (type === "board")
    return [
      {
        command: () => {
          if (boardContext.x && boardContext.y)
            createNodeMutation.mutate({
              ...DefaultNode,
              type: board?.defaultNodeShape,
              backgroundColor: board?.defaultNodeColor,
              x: boardContext.x,
              y: boardContext.y,
              parent: item_id as string,
              id: crypto.randomUUID(),
            });
          else toaster("error", "There was an error creating your node (missing X and Y).");
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
              if (boardRef) changeLockState(boardRef, false, updateManyNodes);
            },
          },
          {
            label: "Lock Selected",
            icon: "pi pi-fw pi-unlock",
            command: () => {
              if (boardRef) changeLockState(boardRef, true, updateManyNodes);
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
              if (boardRef) changeLockState(boardRef, false, updateManyNodes);
            },
          },
          {
            label: "Lock selected",
            icon: "pi pi-fw pi-lock",
            command: () => {
              if (boardRef) changeLockState(boardRef, true, updateManyNodes);
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
  const createItemMutation = useCreateItem(type);
  const updateItemMutation = useUpdateItem(type, project_id as string);
  const deleteItemMutation = useDeleteItem(type, project_id);
  const [, setDrawer] = useAtom(DrawerAtom);
  const [, setDialog] = useAtom(DialogAtom);
  const navigate = useNavigate();

  if (cmType.folder) {
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
                  title: "New Document",
                  project_id: project_id as string,
                  folder: false,
                  parentId: cmType.data?.id,
                });
            },
            icon: "pi pi-fw pi-file",
            label: "Insert Document",
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
          deleteItem("Are you sure you want to delete this folder?", () => {
            if (cmType.data?.id) deleteItemMutation?.mutate(cmType.data.id);
          }),
        icon: "pi pi-fw pi-trash",
        label: "Delete Folder",
      },
    ];
    return folderItems;
  }
  if (cmType.template) {
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
      {
        icon: "pi pi-fw pi-download",
        label: "Export JSON",
        // command: () => {},
      },
      { separator: true },
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
        // command: () => {},
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
            navigator.clipboard.writeText(`${window.location.host}/view/${project_id}/boards/${cmType?.data?.id}`).then(() => {
              toaster("success", "URL copied! 🔗");
            });
          }
        },
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
