import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  BoardContextMenuProps,
  CytoscapeEdgeProps,
  CytoscapeNodeProps,
  edgeUpdateDialogProps,
  nodeUpdateDialogProps,
} from "../../custom-types";
import {
  useCreateEdge,
  useGetBoardData,
  useUpdateNode,
} from "../../utils/customHooks";
import {
  boardLayouts,
  changeLayout,
  cytoscapeStylesheet,
  edgehandlesSettings,
  toastWarn,
} from "../../utils/utils";
import BoardContextMenu from "./BoardContextMenu";
import EdgeUpdateDialog from "./EdgeUpdateDialog";
import NodeUpdateDialog from "./NodeUpdateDialog";

type Props = {
  setBoardId: (boardId: string) => void;
  cyRef: any;
};
export default function BoardView({ setBoardId, cyRef }: Props) {
  const navigate = useNavigate();
  const { project_id, board_id } = useParams();
  const board = useGetBoardData(project_id as string, board_id as string);
  const [elements, setElements] = useState<
    (CytoscapeNodeProps | CytoscapeEdgeProps)[]
  >([]);
  const [layout, setLayout] = useState<string | null>();
  const ehRef = useRef() as any;
  const cm = useRef() as any;
  const firstRender = useRef(true) as any;

  const [nodeUpdateDialog, setNodeUpdateDialog] =
    useState<nodeUpdateDialogProps>({
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
  const [edgeUpdateDialog, setEdgeUpdateDialog] =
    useState<edgeUpdateDialogProps>({
      id: "",
      label: "",
      curveStyle: "",
      lineStyle: "",
      lineColor: "",
      controlPointDistances: 0,
      controlPointWeights: 0,
      taxiDirection: "",
      taxiTurn: 0,
      targetArrowShape: "",
      show: false,
    });
  const [contextMenu, setContextMenu] = useState<BoardContextMenuProps>({
    x: 0,
    y: 0,
    type: "board",
  });
  const [drawMode, setDrawMode] = useState(false);
  const updateNodeMutation = useUpdateNode(project_id as string);
  const createEdgeMutation = useCreateEdge(project_id as string);

  useEffect(() => {
    if (elements.length > 0) {
      cyRef.current.on(
        "ehcomplete",
        (event: any, sourceNode: any, targetNode: any, addedEdge: any) => {
          let sourceData = sourceNode._private.data;
          let targetData = targetNode._private.data;
          // Check due to weird edgehandles behavior when toggling drawmode
          // When drawmode is turned on and then off and then back on
          // It can add an edges to a node that doesn't exist
          try {
            cyRef.current.remove(addedEdge);
          } catch (error) {
            toastWarn(
              "Cytoedge couldn't be removed, there was an error (BoardView 102)"
            );
          }
          makeEdgeCallback(sourceData.id, targetData.id);
        }
      );
    }
    return () => cyRef.current.removeListener("ehcomplete");
  }, [elements]);

  useEffect(() => {
    if (board) {
      let temp_nodes: CytoscapeNodeProps[] = [];
      let temp_edges: CytoscapeEdgeProps[] = [];
      if (board.nodes.length > 0) {
        temp_nodes = board.nodes.map((node) => ({
          data: {
            id: node.id,
            classes: "boardNode",
            label: node.label || "",
            type: node.type,
            width: node.width,
            height: node.height,
            fontSize: node.fontSize,
            textHAlign: node.textHAlign,
            textVAlign: node.textVAlign,
            backgroundColor: node.backgroundColor,
            customImage: node.customImage,
            x: node.x,
            y: node.y,
            backgroundImage: node.customImage
              ? node.customImage
              : node.document?.image
              ? node.document.image
              : [],
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
            id: edge.id,
            classes: "boardEdge",
            label: edge.label || "",
            source: edge.source,
            target: edge.target,
            curveStyle: edge.curveStyle,
            lineStyle: edge.lineStyle,
            lineColor: edge.lineColor,
            controlPointDistances: edge.controlPointDistances,
            controlPointWeights: edge.controlPointWeights,
            taxiDirection: edge.taxiDirection,
            taxiTurn: edge.taxiTurn,
            targetArrowShape: edge.targetArrowShape,
          },
        }));
      }
      const elements = [...temp_nodes, ...temp_edges];
      setElements(elements);
    }
  }, [board]);

  // Change function when the board_id changes
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
        lineColor: "#595959",
        controlPointDistances: -100,
        controlPointWeights: 0.5,
        taxiDirection: "auto",
        taxiTurn: 50,
        targetArrowShape: "triangle",
      });
    },
    [board_id]
  );

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.on("click", "node", function (evt: any) {
        const scratch = evt.target._private.scratch;
        if (scratch?.doc_id && evt.originalEvent.shiftKey) {
          navigate(`../../wiki/${scratch?.doc_id}`);
        }
      });
      cyRef.current.on("cxttap", function (evt: any) {
        // If the target is the background of the canvas
        if (evt.target === cyRef.current) {
          cm.current.show(evt.originalEvent);
          setContextMenu({ ...evt.position, type: "board" });
        } else {
          let group = evt.target._private.group;
          if (group === "nodes") {
            cm.current.show(evt.originalEvent);
            setContextMenu({
              ...evt.position,
              type: "node",
              selected: evt.target,
            });
          } else if (group === "edges") {
            cm.current.show(evt.originalEvent);
            setContextMenu({
              ...evt.position,
              type: "edge",
              selected: evt.target,
            });
          }
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
          customImage: target.data.customImage,
          doc_id: target.scratch.doc_id,
          show: true,
        });
      });
      cyRef.current.on("dbltap", "edge", function (evt: any) {
        let target = evt.target._private;
        setEdgeUpdateDialog({
          id: target.data.id,
          label: target.data.label,
          curveStyle: target.data.curveStyle,
          lineStyle: target.data.lineStyle,
          lineColor: target.data.lineColor,
          controlPointDistances: target.data.controlPointDistances,
          controlPointWeights: target.data.controlPointWeights,
          taxiDirection: target.data.taxiDirection,
          taxiTurn: target.data.taxiTurn,
          targetArrowShape: target.data.targetArrowShape,
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
  }, [cyRef, board_id]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
    setDrawMode(false);
    ehRef.current = null;
    if (board_id) {
      setBoardId(board_id);
    }
    return () => {
      cyRef.current.removeAllListeners();
      setBoardId("");
    };
  }, [board_id]);

  useEffect(() => {
    if (cyRef && board?.layout) {
      changeLayout(board.layout, cyRef);
      setLayout(board.layout);
    }
  }, [board?.layout, cyRef]);

  return (
    <div className="w-full h-full">
      <div className="absolute flex flex-nowrap z-5">
        <div className="relative">
          <Dropdown
            options={boardLayouts}
            value={layout || "Preset"}
            onChange={(e) => {
              setLayout(e.value);
              changeLayout(e.value as string, cyRef);
              cyRef.current.fit();
            }}
          />
        </div>
        <Button
          className={`p-button-rounded ${
            drawMode ? "p-button-success" : "p-button-secondary"
          }`}
          icon="pi pi-pencil"
          onClick={() => {
            setDrawMode((prev) => {
              if (prev) {
                ehRef.current.disable();
                ehRef.current.disableDrawMode();
                cyRef.current.autoungrabify(false);
                cyRef.current.autounselectify(false);
                cyRef.current.autolock(false);
                cyRef.current.zoomingEnabled(true);
                cyRef.current.userZoomingEnabled(true);
                cyRef.current.panningEnabled(true);
                setDrawMode(false);
              } else {
                ehRef.current.enable();
                ehRef.current.enableDrawMode();
                setDrawMode(true);
              }
              return !prev;
            });
          }}
        />
      </div>

      <BoardContextMenu
        cm={cm}
        ehRef={ehRef}
        cyRef={cyRef}
        contextMenu={contextMenu}
        setDrawMode={setDrawMode}
      />
      {nodeUpdateDialog.show && (
        <NodeUpdateDialog
          nodeUpdateDialog={nodeUpdateDialog}
          setNodeUpdateDialog={setNodeUpdateDialog}
        />
      )}
      {edgeUpdateDialog.show && (
        <EdgeUpdateDialog
          edgeUpdateDialog={edgeUpdateDialog}
          setEdgeUpdateDialog={setEdgeUpdateDialog}
        />
      )}

      <CytoscapeComponent
        elements={elements}
        minZoom={0.1}
        maxZoom={5}
        zoom={1}
        className="Lato"
        wheelSensitivity={0.1}
        style={{ width: "100%", height: "100%" }}
        cy={(cy: any) => {
          if (!cyRef.current) {
            cyRef.current = cy;
          }
          if (!ehRef.current) {
            cy.center();
            ehRef.current = cyRef.current.edgehandles(edgehandlesSettings);
          }
        }}
        stylesheet={cytoscapeStylesheet}
      />
    </div>
  );
}
