import { useCallback, useContext, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  BoardContextMenuProps,
  BoardEdgeProps,
  BoardNodeProps,
  CytoscapeEdgeProps,
  CytoscapeNodeProps,
  EdgeUpdateDialogProps,
  NodeUpdateDialogProps,
} from "../../types/BoardTypes";
import {
  cytoscapeGridOptions,
  cytoscapeStylesheet,
  edgehandlesSettings,
  toModelPosition,
} from "../../utils/boardUtils";
import {
  useCreateEdge,
  useCreateNode,
  useGetBoardData,
  useGetDocuments,
  useGetImages,
  useUpdateNode,
  useUploadImage,
} from "../../utils/customHooks";
import {
  EdgeUpdateDialogDefault,
  NodeUpdateDialogDefault,
} from "../../utils/defaultDisplayValues";
import { supabaseStorageImagesLink, toastWarn } from "../../utils/utils";
import { BoardRefsContext } from "../Context/BoardRefsContext";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import BoardContextMenu from "./BoardContextMenu";
import BoardQuickBar from "./Quickbar/BoardQuickBar";
import EdgeUpdateDialog from "./EdgeUpdateDialog";
import NodeUpdateDialog from "./NodeUpdateDialog";
import QuickCreateNode from "./QuickCreateNode";
type Props = {
  setBoardId: (boardId: string) => void;
};

export default function BoardView({ setBoardId }: Props) {
  const navigate = useNavigate();
  const { project_id, board_id, node_id } = useParams();
  const { cyRef, ehRef, grRef } = useContext(BoardRefsContext);
  const board = useGetBoardData(project_id as string, board_id as string);
  const images = useGetImages(project_id as string);

  const { data: documents } = useGetDocuments(project_id as string);
  const [elements, setElements] = useState<
    (CytoscapeNodeProps | CytoscapeEdgeProps)[]
  >([]);

  const cm = useRef() as any;
  const firstRender = useRef(true) as any;
  const { isTabletOrMobile } = useContext(MediaQueryContext);
  const [nodeUpdateDialog, setNodeUpdateDialog] =
    useState<NodeUpdateDialogProps>(NodeUpdateDialogDefault);
  const [edgeUpdateDialog, setEdgeUpdateDialog] =
    useState<EdgeUpdateDialogProps>(EdgeUpdateDialogDefault);
  const [contextMenu, setContextMenu] = useState<BoardContextMenuProps>({
    x: 0,
    y: 0,
    type: "board",
  });

  const [loading, setLoading] = useState(true);
  const [quickCreate, setQuickCreate] = useState(false);

  const createNodeMutation = useCreateNode(project_id as string);
  const createEdgeMutation = useCreateEdge(project_id as string);
  const updateNodeMutation = useUpdateNode(project_id as string);
  const uploadImageMutation = useUploadImage(project_id as string);

  useEffect(() => {
    if (board) {
      let temp_nodes: CytoscapeNodeProps[] = [];
      let temp_edges: CytoscapeEdgeProps[] = [];
      if (board.nodes.length > 0) {
        temp_nodes = board.nodes.map((node: BoardNodeProps) => ({
          data: {
            ...node,
            classes: "boardNode",
            label: node.label || "",
            zIndexCompare: node.zIndex === 0 ? "manual" : "auto",
            // Custom image has priority, if not set use document image, if neither - empty array
            // Empty string ("") causes issues with cytoscape, so an empty array must be used
            backgroundImage: node.customImage?.link
              ? `${supabaseStorageImagesLink}${node.customImage.link.replaceAll(
                  " ",
                  "%20"
                )}`
              : node.document?.image?.link
              ? `${supabaseStorageImagesLink}${node.document.image.link?.replaceAll(
                  " ",
                  "%20"
                )}`
              : [],
          },
          scratch: {
            doc_id: node.document?.id,
          },
          locked: node.locked,
          position: { x: node.x, y: node.y },
        }));
      }
      if (board.edges.length > 0) {
        temp_edges = board.edges.map((edge: BoardEdgeProps) => ({
          data: {
            ...edge,
            classes: "boardEdge",
            label: edge.label || "",
          },
        }));
      }
      const elements = [...temp_nodes, ...temp_edges];
      setElements(elements);
    }
  }, [board]);

  // Change function when the board_id changes
  const makeEdgeCallback = useCallback(
    (source, target, color?: string) => {
      let boardId = board_id;
      createEdgeMutation.mutate({
        id: uuid(),
        board_id: boardId as string,
        source,
        target,
        curveStyle: "straight",
        lineStyle: "solid",
        lineColor: color || "#595959",
        fontColor: "#ffffff",
        fontFamily: "Lato",
        fontSize: 16,
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
    if (!cyRef) return;
    if (cyRef.current) {
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
              "Cytoedge couldn't be removed, there was an error (BoardView 172)"
            );
          }
          makeEdgeCallback(
            sourceData.id,
            targetData.id,
            board?.defaultEdgeColor
          );
        }
      );
      cyRef.current.on("click", "node", function (evt: any) {
        const scratch = evt.target._private.scratch;
        if (scratch?.doc_id && evt.originalEvent.altKey) {
          navigate(`../../wiki/doc/${scratch?.doc_id}`);
        } else {
          evt.target.select();
        }
      });
      cyRef.current.on("mousedown", "node", function (evt: any) {
        if (
          cyRef.current.nodes(":selected").length <= 1 &&
          !evt.originalEvent.shiftKey &&
          !evt.originalEvent.ctrlKey &&
          !evt.originalEvent.metaKey
        ) {
          cyRef.current.nodes(":selected").unselect();
        }
        evt.target.select();
      });
      // Right click
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
        const {
          backgroundImage,
          board_id,
          classes,
          document,
          locked,
          parent,
          user_id,
          x,
          y,
          zIndexCompare,
          ...rest
        } = target.data;
        setNodeUpdateDialog({
          ...rest,
          show: true,
        });
      });
      cyRef.current.on("dbltap", "edge", function (evt: any) {
        let targetEdge = evt.target._private;
        const { user_id, target, source, board_id, classes, ...rest } =
          targetEdge.data;
        setEdgeUpdateDialog({
          ...rest,
          show: true,
        });
      });

      cyRef.current.on("free", "node", function (evt: any) {
        let target = evt.target._private;
        cyRef.current.elements(":selected").select();
        evt.target.select();

        // Grid extenstion messes with the "grab events"
        // "Freeon" event triggers on double clicking
        // This is a safeguard to prevent the node position from being changed on anything EXCEPT dragging
        if (
          target.position.x !== target?.data.x ||
          target.position.y !== target.data?.y
        )
          updateNodeMutation.mutate({
            id: target.data.id,
            board_id: board_id as string,
            x: target.position.x,
            y: target.position.y,
          });
      });
    }
    return () =>
      cyRef.current.removeListener(
        "click mousedown cxttap dbltap free ehcomplete"
      );
  }, [cyRef, board_id]);
  useEffect(() => {
    if (!cyRef || !ehRef || !grRef) return;
    setLoading(true);
    if (firstRender.current) {
      firstRender.current = false;
    }
    // Reset when changing board_id
    ehRef.current = null;
    grRef.current = null;
    if (board_id) {
      setBoardId(board_id);
      setTimeout(() => {
        cyRef.current.zoom(1);
        cyRef.current.center();
      }, 100);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }

    return () => {
      setBoardId("");
    };
  }, [board_id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (node_id && cyRef) {
        let foundNode = cyRef.current.getElementById(node_id);
        cyRef.current.animate(
          {
            center: {
              eles: foundNode,
            },
            zoom: 1,
          },
          {
            duration: 1,
          }
        );
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [node_id, cyRef]);

  return (
    <div
      className={`${isTabletOrMobile ? "w-full" : "w-10"} h-full`}
      onDrop={async (e) => {
        let files = e.dataTransfer.files;
        let doc_id = e.dataTransfer.getData("text");

        if (doc_id) {
          let document = documents?.find((doc) => doc.id === doc_id);
          if (document) {
            // @ts-ignore
            const { top, left } = e.target.getBoundingClientRect();

            // Convert mouse coordinates to canvas coordinates
            const { x, y } = toModelPosition(cyRef, {
              x: e.clientX - left,
              y: e.clientY - top,
            });
            createNodeMutation.mutate({
              id: uuid(),
              label: document.title,
              board_id: board_id as string,
              x,
              y,
              type: "rectangle",
              doc_id: document.id,
            });
          }
        } else if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            let newImage;
            // If the image exists do not upload it but assign to variable
            if (images?.data.some((img) => img.title === files[i].name)) {
              newImage = images?.data.find(
                (img) => img.title === files[i].name
              );

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
            // If there is no image upload, then set node
            else {
              try {
              } catch (error) {}
              const newImage = await uploadImageMutation.mutateAsync({
                file: files[i],
                type: "Image",
              });
              // newImage = images?.data.find((img) => img.title === files[i].name);

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
          }
        }
      }}
    >
      <BoardContextMenu
        cm={cm}
        cyRef={cyRef}
        contextMenu={contextMenu}
        setQuickCreate={setQuickCreate}
      />
      <NodeUpdateDialog
        nodeUpdateDialog={nodeUpdateDialog}
        setNodeUpdateDialog={setNodeUpdateDialog}
      />
      {edgeUpdateDialog.show && (
        <EdgeUpdateDialog
          edgeUpdateDialog={edgeUpdateDialog}
          setEdgeUpdateDialog={setEdgeUpdateDialog}
        />
      )}
      <QuickCreateNode
        quickCreate={quickCreate}
        setQuickCreate={setQuickCreate}
      />
      <BoardQuickBar />
      <CytoscapeComponent
        elements={elements}
        className="Lato"
        wheelSensitivity={0.1}
        minZoom={0.1}
        maxZoom={10}
        style={{ width: "100%", height: "100%", opacity: loading ? 0 : 1 }}
        cy={(cy: any) => {
          if (cyRef) {
            cyRef.current = cy;

            if (ehRef && grRef) {
              ehRef.current = cyRef.current.edgehandles(edgehandlesSettings);
              grRef.current = cyRef.current.gridGuide(cytoscapeGridOptions);
            }
          }
        }}
        stylesheet={cytoscapeStylesheet}
      />
    </div>
  );
}
