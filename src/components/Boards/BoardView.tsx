import { useCallback, useContext, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useNavigate, useParams } from "react-router-dom";
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
  useCreateNode,
  useGetBoardData,
  useGetImages,
  useUpdateNode,
} from "../../utils/customHooks";
import { uploadImage } from "../../utils/supabaseUtils";
import {
  changeLayout,
  cytoscapeGridOptions,
  cytoscapeStylesheet,
  edgehandlesSettings,
  toastWarn,
  toModelPosition,
} from "../../utils/utils";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import LoadingScreen from "../Util/LoadingScreen";
import BoardBar from "./BoardBar";
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
  const images = useGetImages(project_id as string);
  const [elements, setElements] = useState<
    (CytoscapeNodeProps | CytoscapeEdgeProps)[]
  >([]);
  const [layout, setLayout] = useState<string | null>();
  const ehRef = useRef() as any;
  const grRef = useRef() as any;
  const cm = useRef() as any;
  const firstRender = useRef(true) as any;
  const { isTabletOrMobile } = useContext(MediaQueryContext);
  const [nodeUpdateDialog, setNodeUpdateDialog] =
    useState<nodeUpdateDialogProps>({
      id: "",
      label: "",
      type: "",
      doc_id: undefined,
      width: 0,
      height: 0,
      fontSize: 0,
      textHAlign: "center",
      textVAlign: "top",
      zIndex: 1,
      backgroundColor: "",
      backgroundOpacity: 1,
      customImage: { id: "", title: "", link: "", type: "Image" },
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
      zIndex: 1,
      show: false,
    });
  const [contextMenu, setContextMenu] = useState<BoardContextMenuProps>({
    x: 0,
    y: 0,
    type: "board",
  });
  const [drawMode, setDrawMode] = useState(false);
  const [snap, setSnap] = useState(true);
  const [loading, setLoading] = useState(true);
  const updateNodeMutation = useUpdateNode(project_id as string);
  const createEdgeMutation = useCreateEdge(project_id as string);
  const createNodeMutation = useCreateNode(project_id as string);
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
            customImage: node.customImage,
            x: node.x,
            y: node.y,
            backgroundColor: node.backgroundColor,
            backgroundOpacity: node.backgroundOpacity,
            zIndex: node.zIndex,
            zIndexCompare: node.zIndex === 0 ? "manual" : "auto",
            // Custom image has priority, if not set use document image, if neither - empty array
            // Empty string ("") causes issues with cytoscape, so an empty array must be used
            backgroundImage: node.customImage?.link
              ? `https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${node.customImage.link.replaceAll(
                  " ",
                  "%20"
                )}`
              : node.document?.image
              ? `https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${node.document.image.link?.replaceAll(
                  " ",
                  "%20"
                )}`
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
            zIndex: edge.zIndex,
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
        zIndex: 1,
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
          customImage: target.data.customImage,
          doc_id: target.scratch.doc_id,
          textHAlign: target.data.textHAlign,
          textVAlign: target.data.textVAlign,
          backgroundColor: target.data.backgroundColor,
          backgroundOpacity: target.data.backgroundOpacity,
          zIndex: target.data.zIndex,
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
          zIndex: target.data.zIndex,
          show: true,
        });
      });
      cyRef.current.on("free", "node", function (evt: any) {
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
    setLoading(true);
    if (firstRender.current) {
      firstRender.current = false;
    }
    // Reset when changing board_id
    setDrawMode(false);
    ehRef.current = null;
    grRef.current = null;
    if (board_id) {
      setBoardId(board_id);
      setTimeout(() => {
        cyRef.current.zoom(1);
        cyRef.current.center();
      }, 2);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
    return () => {
      cyRef.current.removeListener("click cxttap dbltap free");
      setBoardId("");
    };
  }, [board_id]);
  useEffect(() => {
    if (cyRef && board?.layout) {
      // Timeout necessary to wait for cytoscape to render and then apply layout
      setTimeout(() => {
        changeLayout(board.layout, cyRef);
        setLayout(board.layout);
      }, 1);
    }
  }, [board?.layout, cyRef]);
  useEffect(() => {
    grRef.current = null;
    grRef.current = cyRef.current.gridGuide({
      ...cytoscapeGridOptions,
      snapToGridDuringDrag: snap,
    });
  }, [snap]);

  return (
    <div
      className={`${isTabletOrMobile ? "w-full" : "w-10"} h-full`}
      onDrop={async (e) => {
        let files = e.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
          let newImage;
          // If the image exists do not upload it but assign to variable
          if (images?.data.some((img) => img.title === files[i].name)) {
            toastWarn(`Image "${files[i].name}" already exists.`);
            newImage = images?.data.find((img) => img.title === files[i].name);
          }
          // If there is no image upload, then set node
          else {
            await uploadImage(project_id as string, files[i], "Image");
            newImage = images?.data.find((img) => img.title === files[i].name);
          }

          if (!newImage) return;

          let id = uuid();
          // @ts-ignore
          const { top, left } = e.target.getBoundingClientRect();

          // Convert mouse coordinates to canvas coordinates
          const { x, y } = toModelPosition(cyRef, {
            x: e.clientX - left,
            y: e.clientY - top,
          });
          createNodeMutation.mutate({
            id,
            board_id: board_id as string,
            x,
            y,
            type: "rectangle",
            customImage: newImage,
          });
        }
      }}
    >
      <BoardBar
        drawMode={drawMode}
        setDrawMode={setDrawMode}
        layout={layout}
        setLayout={setLayout}
        snap={snap}
        setSnap={setSnap}
        cyRef={cyRef}
        ehRef={ehRef}
        boardTitle={board?.title}
      />

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
        className="Lato"
        wheelSensitivity={0.1}
        minZoom={0.1}
        maxZoom={10}
        style={{ width: "100%", height: "100%", opacity: loading ? 0 : 1 }}
        cy={(cy: any) => {
          if (!cyRef.current) {
            cyRef.current = cy;
          }
          if (!ehRef.current) {
            ehRef.current = cyRef.current.edgehandles(edgehandlesSettings);
            grRef.current = cyRef.current.gridGuide({
              ...cytoscapeGridOptions,
              snapToGridDuringDrag: snap,
            });
          }
        }}
        stylesheet={cytoscapeStylesheet}
      />
    </div>
  );
}
