import { ContextMenu } from "primereact/contextmenu";
import { useCallback, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  CytoscapeEdge,
  CytoscapeNode,
  nodeUpdateDialog,
} from "../../custom-types";
import {
  useCreateEdge,
  useCreateNode,
  useGetBoardData,
  useUpdateNode,
} from "../../utils/customHooks";
import { edgehandlesSettings } from "../../utils/utils";
import NodeUpdateDialog from "./NodeUpdateDialog";
type Props = {
  setBoardId: (boardId: string) => void;
};
export default function BoardView({ setBoardId }: Props) {
  const { project_id, board_id } = useParams();
  const board = useGetBoardData(project_id as string, board_id as string);
  const [elements, setElements] = useState<(CytoscapeNode | CytoscapeEdge)[]>(
    []
  );
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
  const createEdgeMutation = useCreateEdge(project_id as string);
  useEffect(() => {
    if (board) {
      let temp_nodes: CytoscapeNode[] = [];
      let temp_edges: CytoscapeEdge[] = [];
      if (board.nodes.length > 0) {
        temp_nodes = board.nodes.map((node) => ({
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
      }
      if (board.edges.length > 0) {
        temp_edges = board.edges.map((edge) => ({
          data: {
            source: edge.source,
            target: edge.target,
            curveStyle: edge.curveStyle,
            lineStyle: edge.lineStyle,
            lineColor: edge.lineColor,
          },
        }));
      }
      const elements = [...temp_nodes, ...temp_edges];
      setElements(elements);
    }
  }, [board]);

  const makeEdgeCallback = useCallback(
    (source, target) => {
      let boardId = board_id;
      createEdgeMutation.mutate({
        id: uuid(),
        board_id: boardId as string,
        source,
        target,
        curveStyle: "straight",
        lineStyle: "solid",
        lineColor: "#1e1e1e",
      });
    },
    [board_id]
  );

  useEffect(() => {
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
          makeEdgeCallback(sourceData.id, targetData.id);
        }
      );

      cyRef.current.edgehandles().enableDrawMode();
    }
  }, [cyRef, board_id]);

  useEffect(() => {
    if (board_id) setBoardId(board_id);
    // if (cyRef.current) cyRef.current.mount();
    return () => cyRef.current.removeAllListeners();
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
        elements={elements}
        minZoom={0.1}
        maxZoom={5}
        className="Lato Merriweather"
        style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        cy={(cy: any) => {
          cyRef.current = cy;
        }}
        id="cy"
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
            selector: "edge",
            style: {
              // label: "data(label)",
              "text-outline-color": "black",
              "text-outline-width": "2px",
              "target-arrow-shape": "triangle-backcurve",
              "target-arrow-color": "data(lineColor)",
              "line-color": "data(lineColor)",
              "line-style": "data(lineStyle)",
              "line-dash-pattern": [5, 10],
              "curve-style": "data(curveStyle)",
              "control-point-distances": "-300 20 -20 45 -100 40",
              "control-point-weights": "0.50 0.5 1 1 0.5 0.1 ",
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
        ]}
      />
    </div>
  );
}
