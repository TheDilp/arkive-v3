import { ContextMenu } from "primereact/contextmenu";
import { useCallback, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  CytoscapeEdge,
  CytoscapeNode,
  nodeUpdateDialog,
} from "../../custom-types";
import edgehandles from "cytoscape-edgehandles";
import {
  useCreateNode,
  useGetBoardData,
  useUpdateNode,
} from "../../utils/customHooks";
import NodeUpdateDialog from "./NodeUpdateDialog";
import { edgehandlesSettings } from "../../utils/utils";
type Props = {
  setBoardId: (boardId: string) => void;
};
export default function BoardView({ setBoardId }: Props) {
  const { project_id, board_id } = useParams();
  const board = useGetBoardData(project_id as string, board_id as string);
  const [nodes, setNodes] = useState<CytoscapeNode[]>([]);
  const cyRef = useRef() as any;
  const cm = useRef() as any;
  const firstRender = useRef(true) as any;
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
        let temp_edges: CytoscapeEdge[] = board.nodes
          .filter((node) => node.target)
          .map((node) => {
            return { data: { source: node.id, target: node.target as string } };
          });
        const elements = CytoscapeComponent.normalizeElements({
          nodes: temp_nodes,
          edges: temp_edges,
        });
        console.log(elements);
        setNodes(elements);
      } else {
        setNodes([]);
      }
    }
  }, [board]);
  useEffect(() => {
    // Ensure plugin is only enabled once (on the first render)
    if (firstRender.current) {
      firstRender.current = false;
      cytoscape.use(edgehandles);
    }

    if (cyRef.current) {
      cyRef.current.edgehandles(edgehandlesSettings);
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

      cyRef.current.on(
        "ehcomplete",
        (event: any, sourceNode: any, targetNode: any, addedEdge: any) => {
          let sourceData = sourceNode._private.data;
          let targetData = targetNode._private.data;
          updateNodeMutation.mutate({
            id: sourceData.id,
            board_id: board_id as string,
            target: targetData.id,
          });
        }
      );

      cyRef.current.edgehandles().enableDrawMode();
    }
  }, [cyRef]);

  useEffect(() => {
    if (board_id) setBoardId(board_id);
    // if (cyRef.current) cyRef.current.mount();
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
        cy={(cy: any) => {
          cyRef.current = cy;
          // cy.edgehandles(edgehandlesSettings);
        }}
        id="cy"
        wheelSensitivity={0.25}
        stylesheet={[
          {
            selector: "node[class != 'eh-presumptive-target']",
            style: {
              shape: "data(type)",
              width: "data(width)",
              height: "data(height)",
              label: "data(label)",
              fontFamily: "Lato",
              // fontSize: "data(fontSize)",
              backgroundColor: "data(backgroundColor)",
              backgroundImage: "data(backgroundImage)",
              backgroundFit: "cover",
              textValign: "top",
            },
          },
          {
            selector: "node[class = '.eh-presumptive-target']",
            style: {
              shape: "rectangle",
              width: "50rem",
              height: "50rem",
              "font-size": "20rem",
              label: "TARGET",
              color: "white",
              "text-outline-color": "black",
              "text-outline-width": "2px",
              "background-image": "a",
              "background-opacity": "1",
              "background-image-opacity": "0",
              "background-fit": "cover",
              "background-clip": "node",
              "background-color": "black",
              "overlay-color": "lightblue",
              "overlay-opacity": "0",
            },
          },
          {
            selector: ".eh-ghost-node",
            style: {
              shape: "square",
              width: "50",
              height: "50",

              label: "New Edge",
              color: "white",
              "text-outline-color": "black",
              "text-outline-width": "2px",
              "background-image": "a",
              "background-fit": "contain",
              "background-color": "red",
              opacity: 0,
            },
          },
          {
            selector: "edge",
            style: {
              color: "white",
              "text-outline-color": "black",
              "text-outline-width": "2px",
              "target-arrow-shape": "triangle-backcurve",
              "line-dash-pattern": [5, 10],
              "control-point-distances": "-300 20 -20 45 -100 40",
              "control-point-weights": "0.50 0.5 1 1 0.5 0.1 ",
            },
          },
          {
            selector: ".eh-ghost-edge",
            style: {
              "target-arrow-shape": "triangle-backcurve",
              "target-arrow-color": "white",
              "line-color": "white",
              "line-style": "solid",
              "line-dash-pattern": [5, 10],
              "curve-style": "straight",
            },
          },
        ]}
      />
    </div>
  );
}
