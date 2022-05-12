import { ContextMenu } from "primereact/contextmenu";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { BoardContextMenuProps } from "../../custom-types";
import {
  useCreateNode,
  useDeleteEdge,
  useDeleteNode,
} from "../../utils/customHooks";

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
      command: () => cyRef.current.fit(),
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
      label: "Delete Node",
      command: () => {
        contextMenu.selected.outgoers("edge").forEach((el: any) =>
          deleteEdgeMutation.mutate({
            id: el._private.data.id,
            board_id: board_id as string,
          })
        );
        contextMenu.selected.incomers("edge").forEach((el: any) =>
          deleteEdgeMutation.mutate({
            id: el._private.data.id,
            board_id: board_id as string,
          })
        );
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
