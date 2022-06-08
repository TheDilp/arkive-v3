import { Icon } from "@iconify/react";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useNavigate, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
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
  useGetDocuments,
  useGetImages,
  useUpdateEdge,
  useUpdateNode,
  useUploadImage,
} from "../../utils/customHooks";
import {
  cytoscapeGridOptions,
  cytoscapeStylesheet,
  edgehandlesSettings,
  supabaseStorageImagesLink,
  toastWarn,
  toModelPosition,
} from "../../utils/utils";
import { MediaQueryContext } from "../Context/MediaQueryContext";
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

  const { data: documents } = useGetDocuments(project_id as string);
  const [elements, setElements] = useState<
    (CytoscapeNodeProps | CytoscapeEdgeProps)[]
  >([]);
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
  const [loading, setLoading] = useState(true);
  const [quickCreate, setQuickCreate] = useState(false);

  const createNodeMutation = useCreateNode(project_id as string);
  const createEdgeMutation = useCreateEdge(project_id as string);
  const updateNodeMutation = useUpdateNode(project_id as string);
  const updateEdgeMutation = useUpdateEdge(project_id as string);
  const uploadImageMutation = useUploadImage(project_id as string);

  const debounced = useDebouncedCallback(
    // function
    (color, elements) => {
      elements.forEach((node: any) => {
        if (node.isNode()) {
          updateNodeMutation.mutate({
            id: node.data().id,
            // Board_id is required for updating the state in react-query
            board_id: board_id as string,
            backgroundColor: `#${color}`,
          });
        } else {
          updateEdgeMutation.mutate({
            id: node.data().id,
            // Board_id is required for updating the state in react-query
            board_id: board_id as string,
            lineColor: `#${color}`,
          });
        }
      });
    },
    // delay in ms
    400
  );
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
          locked: node.locked,
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
      cyRef.current.removeListener("click mousedown cxttap dbltap free");
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
      }, 100);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
    return () => {
      setBoardId("");
    };
  }, [board_id]);

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
      <BoardBar
        drawMode={drawMode}
        setDrawMode={setDrawMode}
        cyRef={cyRef}
        ehRef={ehRef}
        boardTitle={board?.title}
      />

      <BoardContextMenu
        cm={cm}
        cyRef={cyRef}
        contextMenu={contextMenu}
        setDrawMode={setDrawMode}
        setQuickCreate={setQuickCreate}
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
      <Dialog
        header="Quick Create Node"
        className="w-30rem h-20rem overflow-y-auto"
        visible={quickCreate}
        onHide={() => setQuickCreate(false)}
        modal={false}
        position="left"
      >
        <div className="flex flex-wrap">
          {documents
            ?.filter((doc) => !doc.folder && !doc.template)
            .map((doc) => (
              <div
                key={doc.id}
                className="w-4"
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData("text", doc.id);
                }}
              >
                <div className="p-0 text-center flex flex-wrap justify-content-center">
                  {doc.image?.link ? (
                    <div className="folderPageImageContainer">
                      <img
                        className="w-4rem h-4rem"
                        style={{
                          objectFit: "contain",
                        }}
                        alt={doc.title}
                        src={
                          doc.image?.link
                            ? supabaseStorageImagesLink + doc.image.link
                            : ""
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <Icon icon="mdi:file" className="w-full" fontSize={80} />
                    </div>
                  )}
                </div>

                <h4 className="text-center my-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                  {doc.title}
                </h4>
              </div>
            ))}
        </div>
      </Dialog>

      <div
        className="w-4 absolute border-round surface-50 text-white h-3rem flex align-items-center justify-content-center shadow-5"
        style={{
          top: "95.5vh",
          left: "41.5%",
          zIndex: 5,
        }}
      >
        <i
          className="pi pi-fw pi-lock"
          onClick={() => {
            if (cyRef.current.elements(":selected")?.length > 0) {
              cyRef.current.elements(":selected").lock();
            }
          }}
        ></i>
        <i
          className="pi pi-fw pi-lock-open"
          onClick={() => {
            if (cyRef.current.elements(":selected")?.length > 0) {
              cyRef.current.elements(":selected").unlock();
            }
          }}
        ></i>
        <i className="pi pi-fw pi-trash"></i>
        <i
          className="pi pi-fw pi-palette cursor-pointer hover:text-blue-300"
          onClick={() => {
            if (cyRef.current.elements(":selected")?.length > 0) {
              cyRef.current.elements(":selected").forEach((el: any) => {
                if (el.isNode()) {
                  updateNodeMutation.mutate({
                    id: el.data().id,
                    board_id: board_id as string,
                    backgroundColor: "#595959",
                  });
                } else {
                  updateEdgeMutation.mutate({
                    id: el.data().id,
                    board_id: board_id as string,
                    lineColor: "#595959",
                  });
                }
              });
            } else {
              toastWarn("No elements are selected.");
            }
          }}
        ></i>
        <ColorPicker
          onChange={(e) => {
            if (cyRef.current.elements(":selected")?.length > 0) {
              debounced(e.target.value, cyRef.current.elements(":selected"));
              // cyRef.current.elements(":selected").forEach((el: any) => {});
            }
          }}
          className="w-2rem h-2rem"
          defaultColor="595959"
        ></ColorPicker>
      </div>

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
            grRef.current = cyRef.current.gridGuide(cytoscapeGridOptions);
          }
        }}
        stylesheet={cytoscapeStylesheet}
      />
    </div>
  );
}
