import { ContextMenu } from "primereact/contextmenu";
import { Dispatch } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { BoardContextMenuType, BoardStateAction } from "../../types/BoardTypes";
import { changeLockState } from "../../utils/boardUtils";
import {
  useCreateNode,
  useDeleteManyEdges,
  useDeleteManyNodes,
  useGetBoardData,
} from "../../utils/customHooks";
import { deleteManyEdges } from "../../utils/supabaseUtils";
import { defaultNode, toastSuccess, toastWarn } from "../../utils/utils";

type Props = {
  cyRef: any;
  cm: any;
  contextMenu: BoardContextMenuType;
  boardStateDisptach: Dispatch<BoardStateAction>;
};

export default function BoardContextMenu({
  cyRef,
  cm,
  contextMenu,
  boardStateDisptach,
}: Props) {
  const { project_id, board_id } = useParams();
  const board = useGetBoardData(
    project_id as string,
    board_id as string,
    false
  );
  const createNodeMutation = useCreateNode(project_id as string);
  const deleteManyNodesMutation = useDeleteManyNodes(project_id as string);
  const deleteManyEdgesMutation = useDeleteManyEdges(project_id as string);
  const nodes = cyRef.current?.nodes(":selected");
  const edges = cyRef.current?.edges(":selected");
  const boardItems = [
    {
      label: "New Node",
      command: () => {
        let id = uuid();
        createNodeMutation.mutate({
          id,
          label: undefined,
          board_id: board_id as string,
          type: "rectangle",
          x: contextMenu.x,
          y: contextMenu.y,
          ...defaultNode,
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
      items: [
        {
          label: "From Document",
          command: () => boardStateDisptach({ type: "QUICK", payload: true }),
        },
      ],
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
      label: "Center Nodes",
      command: () => cyRef.current.center(nodes),
    },
    {
      label: "Highlight connected nodes",
      command: () => {
        const incomers = nodes.incomers();
        const outgoers = nodes.outgoers();

        incomers.nodes().flashClass("incomingNodeHighlight", 1500);
        incomers.edges().flashClass("incomingEdgeHighlight", 1500);
        outgoers.nodes().flashClass("outgoingNodeHighlight", 1500);
        outgoers.edges().flashClass("outgoingEdgeHighlight", 1500);
      },
    },
    {
      label: "Un/Lock Nodes",

      icon: `pi pi-fw pi-lock${nodes?.locked() ? "-open" : ""}`,

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
      separator: true,
    },
    {
      label: "Template From Node",
      command: () => {
        let selected = cyRef.current.nodes(":selected");
        if (selected.length !== 1) {
          toastWarn("Please select only one node to create a template from.");
          return;
        }
        let {
          backgroundImage,
          classes,
          document,
          id: templateId,
          locked,
          template,
          zIndexCompare,
          ...nodeData
        } = selected[0].data();
        let id = uuid();
        createNodeMutation.mutate({
          ...defaultNode,
          board_id: board_id as string,
          ...nodeData,
          label: nodeData.label || "New Template",
          id,
          x: contextMenu.x,
          y: contextMenu.y,
          template: true,
        });
        toastSuccess("Template created from node.");
      },
    },
    {
      label: "Delete Selected Nodes",
      command: () => {
        const edge_ids = [
          ...nodes.incomers("edge").map((edge: any) => edge.id()),
          ...nodes.outgoers("edge").map((edge: any) => edge.id()),
        ];
        deleteManyEdges(edge_ids);
        cyRef.current.remove(nodes.incomers("edge"));
        cyRef.current.remove(nodes.outgoers("edge"));
        cyRef.current.remove(nodes);
        deleteManyNodesMutation.mutate({
          ids: nodes.map((node: any) => node.id()),
          board_id: board_id as string,
        });
      },
    },
  ];
  const edgeItems = [
    {
      label: "Highlight Connected Nodes",
      command: () => {
        edges.sources().flashClass("incomingNodeHighlight", 2000);
        edges.targets().flashClass("outgoingNodeHighlight", 2000);
      },
    },
    {
      label: "Delete Selected Edges",
      command: () =>
        deleteManyEdgesMutation.mutate({
          ids: edges.map((edge: any) => edge.id()),
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
