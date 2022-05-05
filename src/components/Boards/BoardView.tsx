import { ContextMenu } from "primereact/contextmenu";
import { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { CytoscapeNode, nodeUpdateDialog } from "../../custom-types";
import {
  useCreateNode,
  useGetBoardData,
  useUpdateNode,
} from "../../utils/customHooks";
import NodeUpdateDialog from "./NodeUpdateDialog";
export default function BoardView() {
  const { project_id, board_id } = useParams();
  const board = useGetBoardData(project_id as string, board_id as string);
  const [nodes, setNodes] = useState<CytoscapeNode[]>([]);
  const cyRef = useRef() as any;
  const cm = useRef() as any;
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [nodeUpdateDialog, setNodeUpdateDialog] = useState<nodeUpdateDialog>({
    id: "",
    label: "",
    type: "",
    doc_id: undefined,
    width: 0,
    height: 0,
    fontSize: 0,
    backgroundColor: "",
    show: false,
  });
  const createNodeMutation = useCreateNode(project_id as string);
  const updateNodeMutation = useUpdateNode(project_id as string);
  useEffect(() => {
    if (board) {
      if (board.nodes.length > 0) {
        let temp_nodes: CytoscapeNode[] = board.nodes.map((node) => ({
          data: {
            id: node.id,
            label: node.label || "",
            type: node.type,
            width: node.width,
            height: node.height,
            fontSize: node.fontSize,
            backgroundColor: node.backgroundColor,
            ...(node.document?.image
              ? { backgroundImage: node.document.image }
              : { backgroundImage: [] }),
          },
          scratch: {
            doc_id: node.document?.id,
          },
          position: { x: node.x, y: node.y },
        }));

        setNodes(temp_nodes);
      } else {
        setNodes([]);
      }
    }
  }, [board]);
  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.on("cxttap", function (evt: any) {
        // If the target is the background of the canvas
        if (evt.target === cyRef.current) {
          cm.current.show(evt.originalEvent);
          setContextMenu(evt.position);
        }
      });
      cyRef.current.on("dbltap", "node", function (evt: any) {
        let target = evt.target._private;
        setNodeUpdateDialog({
          id: target.data.id,
          label: target.data.label,
          type: target.data.type,
          width: target.data.width,
          height: target.data.height,
          fontSize: target.data.fontSize,
          backgroundColor: target.data.backgroundColor,
          doc_id: target.scratch.doc_id,
          show: true,
        });
      });
      cyRef.current.on("dragfree", "node", function (evt: any) {
        let target = evt.target._private;
        updateNodeMutation.mutate({
          id: target.data.id,
          board_id: board_id as string,
          x: target.position.x,
          y: target.position.y,
        });
      });
    }
  }, [cyRef]);

  useEffect(() => {
    if (cyRef.current) cyRef.current.mount();
    // return () => cyRef.current.unmount();
  }, [board_id]);

  return (
    <div className="w-full h-screen">
      <ContextMenu
        model={[
          {
            label: "New Node",
            command: () => {
              let id = uuid();
              createNodeMutation.mutate({
                id,
                label: undefined,
                board_id: board_id as string,
                type: "rectangle",
                // X & Y coordinates set by right-clicking the background of the canvas
                ...contextMenu,
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
        ]}
        ref={cm}
      ></ContextMenu>
      {nodeUpdateDialog.show && (
        <NodeUpdateDialog
          nodeUpdateDialog={nodeUpdateDialog}
          setNodeUpdateDialog={setNodeUpdateDialog}
        />
      )}
      <CytoscapeComponent
        elements={nodes}
        minZoom={0.1}
        maxZoom={5}
        className="Lato Merriweather"
        style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        cy={(cy: any) => (cyRef.current = cy)}
        id="cy"
        wheelSensitivity={0.25}
        stylesheet={[
          {
            selector: "node",
            style: {
              shape: "data(type)",
              width: "data(width)",
              height: "data(height)",
              label: "data(label)",
              fontFamily: "Lato",
              fontSize: "data(fontSize)",
              backgroundColor: "data(backgroundColor)",
              backgroundImage: "data(backgroundImage)",
              backgroundFit: "cover",
              textValign: "top",
            },
          },
        ]}
      />
    </div>
  );
}
