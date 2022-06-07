import { ContextMenu } from "primereact/contextmenu";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { BoardContextMenuProps } from "../../custom-types";
import {
  useCreateNode,
  useDeleteEdge,
  useDeleteManyNodes,
  useDeleteNode,
} from "../../utils/customHooks";
import { deleteManyEdges, deleteManyNodes } from "../../utils/supabaseUtils";

type Props = {
  ehRef: any;
  cyRef: any;
  cm: any;
  contextMenu: BoardContextMenuProps;
  setDrawMode: (drawMode: boolean) => void;
};

export default function BoardContextMenu({
  ehRef,
  cyRef,
  cm,
  contextMenu,
  setDrawMode,
}: Props) {
  const { project_id, board_id } = useParams();
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
          type: "rectangle",
          x: contextMenu.x,
          y: contextMenu.y,
        });
      },
    },
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
    {
      label: "Draw Mode On",
      icon: "pi pi-fw pi-pencil",
      command: () => {
        ehRef.current.enable();
        ehRef.current.enableDrawMode();
        setDrawMode(true);
      },
    },
    {
      label: "Draw Mode Off",
      icon: "pi pi-fw pi-pencil",
      command: () => {
        ehRef.current.disable();
        ehRef.current.disableDrawMode();
        cyRef.current.autoungrabify(false);
        cyRef.current.autounselectify(false);
        cyRef.current.autolock(false);
        cyRef.current.zoomingEnabled(true);
        cyRef.current.userZoomingEnabled(true);
        cyRef.current.panningEnabled(true);
        setDrawMode(false);
      },
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
      label: "Update Node",
      command: () => {},
    },
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
      label: contextMenu.selected?.locked() ? "Unlock" : "Lock",
      icon: `pi pi-fw pi-lock${contextMenu.selected?.locked() ? "-open" : ""}`,
      command: () => {
        let lockState = contextMenu.selected.locked();
        if (lockState) {
          contextMenu.selected.unlock();
        } else {
          contextMenu.selected.lock();
        }
      },
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
      label: "Update Edge",
      command: () => {},
    },
    {
      label: "Highlight Connected Nodes",
      command: () => {
        contextMenu.selected.sources().flashClass("nodeHighlight", 1500);
        contextMenu.selected.targets().flashClass("nodeHighlight", 1500);
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
