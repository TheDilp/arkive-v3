import { ContextMenu } from "primereact/contextmenu";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { BoardContextMenuProps } from "../../custom-types";
import { useCreateNode, useUpdateNode } from "../../utils/customHooks";

type Props = {
  ehRef: any;
  cyRef: any;
  cm: any;
  contextMenu: BoardContextMenuProps;
};

export default function BoardContextMenu({
  ehRef,
  cyRef,
  cm,
  contextMenu,
}: Props) {
  const { project_id, board_id } = useParams();
  const createNodeMutation = useCreateNode(project_id as string);
  const updateNodeMutation = useUpdateNode(project_id as string);

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
      label: "Fit view to nodes",
      command: () => cyRef.current.fit(),
    },
    {
      label: "Draw Mode On",
      icon: "pi pi-fw pi-pencil",
      command: () => {
        ehRef.current.enable();
        ehRef.current.enableDrawMode();
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
