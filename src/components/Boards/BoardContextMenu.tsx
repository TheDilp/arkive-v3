import { ContextMenu } from "primereact/contextmenu";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { BoardContextMenuProps } from "../../types/BoardTypes";
import { changeLockState } from "../../utils/boardUtils";
import {
  useCreateNode,
  useDeleteEdge,
  useDeleteManyNodes,
  useDeleteNode,
  useGetBoardData,
} from "../../utils/customHooks";
import {
  deleteManyEdges,
  updateManyNodesLockState,
} from "../../utils/supabaseUtils";

type Props = {
  cyRef: any;
  cm: any;
  contextMenu: BoardContextMenuProps;
  setQuickCreate: (quickCreate: boolean) => void;
};

export default function BoardContextMenu({
  cyRef,
  cm,
  contextMenu,
  setQuickCreate,
}: Props) {
  const { project_id, board_id } = useParams();
  const board = useGetBoardData(project_id as string, board_id as string);
  const createNodeMutation = useCreateNode(project_id as string);
  const deleteNodeMutation = useDeleteNode(project_id as string);
  const deleteManyNodesMutation = useDeleteManyNodes(project_id as string);
  const deleteEdgeMutation = useDeleteEdge(project_id as string);
  const boardItems = [
    {
      label: "New Node",
      command: () => {
        let id = uuid();
        createNodeMutation.mutate({
          id,
          label: undefined,
          board_id: board_id as string,
          backgroundColor: board?.defaultNodeColor || "#595959",
          type: "rectangle",
          x: contextMenu.x,
          y: contextMenu.y,
        });
      },
    },
    {
      label: "Un/Lock Nodes",
      items: [
        {
          label: "Unlock selected",
          icon: "pi pi-fw pi-lock-open",
          command: () => changeLockState(cyRef, false),
        },
        {
          label: "Lock selected",
          icon: "pi pi-fw pi-lock",
          command: () => changeLockState(cyRef, true),
        },
      ],
    },
    {
      label: "View",
      items: [
        {
          label: "Go to center of nodes",
          command: () => cyRef.current.center(),
        },
        {
          label: "Fit view to nodes",
          command: () =>
            cyRef.current.animate(
              {
                fit: {
                  eles: cyRef.current.nodes(),
                },
              },
              {
                duration: 1250,
              }
            ),
        },
      ],
    },
    {
      label: "Quick Create",
      items: [{ label: "From Document", command: () => setQuickCreate(true) }],
    },
    {
      separator: true,
    },
    {
      label: "Delete Selected Nodes",
      command: () => {
        let ids: string[] = cyRef.current
          .nodes(":selected")
          .map((node: any) => node.data().id);

        deleteManyNodesMutation.mutate({
          ids,
          board_id: board_id as string,
        });
      },
    },
  ];
  const nodeItems = [
    {
      label: "Center Node",
      command: () => cyRef.current.center(contextMenu.selected),
    },
    {
      label: "Highlight connected nodes",
      command: () => {
        const incomers = contextMenu.selected.incomers();
        const outgoers = contextMenu.selected.outgoers();

        incomers.nodes().flashClass("incomingNodeHighlight", 1500);
        incomers.edges().flashClass("incomingEdgeHighlight", 1500);
        outgoers.nodes().flashClass("outgoingNodeHighlight", 1500);
        outgoers.edges().flashClass("outgoingEdgeHighlight", 1500);
      },
    },
    {
      label:
        cyRef.current?.nodes(":selected")?.length > 1
          ? "Un/Lock Nodes"
          : contextMenu.selected?.locked()
          ? "Unlock"
          : "Lock",
      icon:
        cyRef.current?.nodes(":selected")?.length > 1
          ? ""
          : `pi pi-fw pi-lock${contextMenu.selected?.locked() ? "-open" : ""}`,

      ...(cyRef.current?.nodes(":selected")?.length > 1
        ? {
            items: [
              {
                label: "Unlock selected",
                icon: "pi pi-fw pi-lock-open",
                command: () => changeLockState(cyRef, false),
              },
              {
                label: "Lock selected",
                icon: "pi pi-fw pi-lock",
                command: () => changeLockState(cyRef, true),
              },
            ],
          }
        : {
            command: () => {
              let lockState = contextMenu.selected.locked();
              if (lockState) {
                contextMenu.selected.unlock();
                updateManyNodesLockState([
                  { id: contextMenu?.selected.data().id, locked: false },
                ]);
              } else {
                contextMenu.selected.lock();
                updateManyNodesLockState([
                  { id: contextMenu?.selected.data().id, locked: true },
                ]);
              }
            },
          }),
    },
    {
      separator: true,
    },
    {
      label: "Delete Node",
      command: () => {
        const edge_ids = [
          ...contextMenu.selected
            .incomers("edge")
            .map((edge: any) => edge.id()),
          ...contextMenu.selected
            .outgoers("edge")
            .map((edge: any) => edge.id()),
        ];
        if (edge_ids.length > 0) deleteManyEdges(edge_ids);
        cyRef.current.remove(contextMenu.selected);
        deleteNodeMutation.mutate({
          id: contextMenu.selected._private.data.id,
          board_id: board_id as string,
        });
      },
    },
  ];
  const edgeItems = [
    {
      label: "Highlight Connected Nodes",
      command: () => {
        contextMenu.selected.sources().flashClass("nodeHighlight", 2000);
        contextMenu.selected.targets().flashClass("nodeHighlight", 2000);
      },
    },
    {
      label: "Delete Edge",
      command: () =>
        deleteEdgeMutation.mutate({
          id: contextMenu.selected._private.data.id,
          board_id: board_id as string,
        }),
    },
  ];
  return (
    <ContextMenu
      model={
        contextMenu.type === "board"
          ? boardItems
          : contextMenu.type === "node"
          ? nodeItems
          : edgeItems
      }
      ref={cm}
    ></ContextMenu>
  );
}
