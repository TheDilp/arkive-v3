import { Icon } from "@iconify/react";
import { saveAs } from "file-saver";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { TabPanel, TabView } from "primereact/tabview";
import { Tooltip } from "primereact/tooltip";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
  BoardExportType,
  BoardNodeType,
  BoardStateAction,
  BoardStateType,
} from "../../../types/BoardTypes";
import {
  changeLockState,
  ColorPresets,
  updateColor,
  cytoscapeGridOptions,
} from "../../../utils/boardUtils";
import {
  useDeleteManyEdges,
  useDeleteManyNodes,
  useGetBoardData,
  useUpdateEdge,
  useUpdateNode,
} from "../../../utils/customHooks";
import { toastWarn } from "../../../utils/utils";
import { BoardRefsContext } from "../../Context/BoardRefsContext";
import ImgDropdownItem from "../../Util/ImgDropdownItem";
import UpdateManyEdges from "./UpdateManyEdges";
import UpdateManyNodes from "./UpdateManyNodes";
type Props = {
  boardState: BoardStateType;
  boardStateDispatch: Dispatch<BoardStateAction>;
};
export default function BoardQuickBar({
  boardState,
  boardStateDispatch,
}: Props) {
  const { project_id, board_id } = useParams();
  const { cyRef } = useContext(BoardRefsContext);
  const board = useGetBoardData(
    project_id as string,
    board_id as string,
    false
  );
  const [search, setSearch] = useState("");
  const [updateManyDialog, setUpdateManyDialog] = useState(false);
  const [filteredNodes, setFilteredNodes] = useState<BoardNodeType[]>(
    board?.nodes.filter((node) => node.label) || []
  );
  const [searchDialog, setSearchDialog] = useState(false);
  const [exportDialog, setExportDialog] = useState<BoardExportType>({
    view: "Graph",
    background: "Color",
    type: "PNG",
    show: false,
  });

  const updateNodeMutation = useUpdateNode(project_id as string);
  const updateEdgeMutation = useUpdateEdge(project_id as string);
  const deleteManyNodesMutation = useDeleteManyNodes(project_id as string);
  const deleteManyEdgesMutation = useDeleteManyEdges(project_id as string);
  const debouncedColorPick = useDebouncedCallback(
    // function
    (color) => {
      updateColor(
        cyRef,
        `#${color}`,
        board_id as string,
        updateNodeMutation,
        updateEdgeMutation
      );
    },
    // delay in ms
    400
  );

  const exportBoardFunction = (
    view: "Graph" | "View",
    background: "Color" | "Transparent",
    type: "PNG" | "JPEG" | "JSON",
    boardTitle?: string
  ) => {
    if (!cyRef) return;
    if (type === "PNG") {
      saveAs(
        new Blob(
          [
            cyRef.current.png({
              output: "blob",
              bg: background === "Color" ? "#121212" : "transparent",
              full: view === "Graph" ? true : false,
            }),
          ],
          {
            type: "image/png",
          }
        ),
        `${boardTitle || "ArkiveBoard"}.png`
      );
    } else if (type === "JPEG") {
      saveAs(
        new Blob(
          [
            cyRef.current.jpg({
              output: "blob",
              bg: background === "Color" ? "#121212" : "transparent",
              full: view === "Graph" ? true : false,
            }),
          ],
          {
            type: "image/jpg",
          }
        ),
        `${boardTitle || "ArkiveBoard"}.jpg`
      );
    } else if (type === "JSON") {
      saveAs(
        new Blob([JSON.stringify(cyRef.current.json(true))], {
          type: "application/json",
        }),
        `${boardTitle || "ArkiveBoard"}.json`
      );
    }
  };

  return (
    <div
      className="w-2 absolute border-round surface-50 text-white h-3rem flex align-items-center justify-content-around shadow-5"
      style={{
        top: "95.6vh",
        left: "50%",
        zIndex: 5,
      }}
    >
      {/* Dialogs */}
      <>
        {/* Search nodes dialog */}
        <Dialog
          visible={searchDialog}
          onHide={() => {
            setSearchDialog(false);
            setSearch("");
            setFilteredNodes(board?.nodes || []);
          }}
          modal={false}
          header="Search Nodes"
          className="w-20rem"
          position={"center"}
        >
          <AutoComplete
            autoFocus
            className="ml-2 w-15rem"
            placeholder="Search Nodes"
            value={search}
            field="label"
            suggestions={filteredNodes}
            virtualScrollerOptions={{
              lazy: true,
              onLazyLoad: () => {},
              itemSize: 50,
              showLoader: true,
              loading: filteredNodes.length === 0,
              delay: 0,
              loadingTemplate: (options) => {
                return (
                  <div
                    className="flex align-items-center p-2"
                    style={{ height: "38px" }}
                  ></div>
                );
              },
            }}
            onSelect={(e) => {
              if (!cyRef) return;
              if (e.value) {
                let foundNode = cyRef.current.getElementById(e.value.id);
                cyRef.current.animate(
                  {
                    center: {
                      eles: foundNode,
                    },
                    zoom: 1,
                  },
                  {
                    duration: 1250,
                  }
                );
              }
            }}
            completeMethod={(e) =>
              setFilteredNodes(
                board?.nodes.filter((node) =>
                  node.label?.toLowerCase().includes(e.query.toLowerCase())
                ) || []
              )
            }
            itemTemplate={(item: BoardNodeType) => (
              <span>
                <ImgDropdownItem
                  title={item.label || ""}
                  link={item.customImage?.link || ""}
                />
              </span>
            )}
            onChange={(e) => setSearch(e.value)}
          />
        </Dialog>
        {/* Export board dialog */}
        <Dialog
          header={`Export Board - ${board?.title}`}
          modal={false}
          position="top-left"
          style={{
            maxWidth: "14vw",
          }}
          visible={exportDialog.show}
          onHide={() =>
            setExportDialog({
              view: "Graph",
              background: "Color",
              type: "PNG",
              show: false,
            })
          }
        >
          <div className="flex flex-wrap">
            <div className="w-full flex flex-wrap justify-content-center">
              <h3 className="w-full text-center mb-1 mt-0">View</h3>
              <SelectButton
                value={exportDialog.view}
                options={["Graph", "Current"]}
                onChange={(e) =>
                  setExportDialog({ ...exportDialog, view: e.value })
                }
              />
            </div>
            <div className="w-full flex flex-wrap justify-content-center">
              <h3 className="my-2">Background</h3>
              <SelectButton
                value={exportDialog.background}
                options={["Color", "Transparent"]}
                onChange={(e) =>
                  setExportDialog({ ...exportDialog, background: e.value })
                }
              />
            </div>
            <div className="w-full flex flex-wrap justify-content-center">
              <h3 className="my-2">File Type</h3>
              <SelectButton
                value={exportDialog.type}
                options={["PNG", "JPEG", "JSON"]}
                onChange={(e) =>
                  setExportDialog({ ...exportDialog, type: e.value })
                }
              />
            </div>
            <div className="w-full flex justify-content-center mt-2">
              <Button
                label="Export"
                className="p-button-outlined p-button-success"
                icon="pi pi-download"
                iconPos="right"
                onClick={() => {
                  if (cyRef && cyRef.current) {
                    exportBoardFunction(
                      exportDialog.view,
                      exportDialog.background,
                      exportDialog.type,
                      board?.title
                    );
                  } else {
                    toastWarn("Ooops");
                  }
                }}
              />
            </div>
          </div>
        </Dialog>
        <Dialog
          visible={updateManyDialog}
          position="right"
          modal={false}
          header="Update Many"
          className="w-25rem overflow-y-auto"
          style={{
            height: "45rem",
          }}
          onHide={() => setUpdateManyDialog(false)}
        >
          <TabView renderActiveOnly={true}>
            <TabPanel header="Nodes">
              <UpdateManyNodes />
            </TabPanel>
            <TabPanel header="Edges">
              <UpdateManyEdges />
            </TabPanel>
          </TabView>
        </Dialog>
      </>
      {/* Tooltips */}
      <span>
        <Tooltip
          target={".drawGrid"}
          content="Toggle grid display"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".lockSelected"}
          content="Lock selected nodes"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".unlockSelected"}
          content="Unlock selected nodes"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".deleteSelected"}
          content="Delete selected elements"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".drawMode"}
          content="Toggle Draw Mode"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".saveButton"}
          content="Export Board"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".searchButton"}
          content="Search Board"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".resetColors"}
          content="Reset selected to default color"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".editSelectedElements"}
          content="Edit selected elements"
          position="top"
          autoHide={true}
        />

        <Tooltip
          target={".colorPresets"}
          position="top"
          autoHide={false}
          hideEvent="focus"
        >
          <div className="flex flex-wrap w-10rem">
            {ColorPresets.map((color) => (
              <div
                key={color}
                className="w-1rem h-1rem border-rounded cursor-pointer"
                style={{
                  backgroundColor: `#${color}`,
                }}
                onClick={() => {
                  updateColor(
                    cyRef,
                    `#${color}`,
                    board_id as string,
                    updateNodeMutation,
                    updateEdgeMutation
                  );
                }}
              ></div>
            ))}
          </div>
        </Tooltip>
        <Tooltip
          target={".pickColor"}
          content="Pick color for selected elements"
          position="top"
        />
      </span>

      {/*Toggle grid visibility */}
      <span
        className={`cursor-pointer flex hover:text-blue-300 ${
          boardState.drawGrid ? "text-green-500" : ""
        }  drawGrid`}
        onClick={() => {
          if (cyRef) {
            boardStateDispatch({ type: "GRID", payload: !boardState.drawGrid });
            cyRef.current.gridGuide({
              ...cytoscapeGridOptions,
              drawGrid: !boardState.drawGrid,
            });
          }
        }}
      >
        <Icon icon="mdi:grid" />
      </span>
      {/* Lock selected elements button */}
      <i
        className="pi pi-fw pi-lock cursor-pointer hover:text-blue-300 lockSelected"
        onClick={() => changeLockState(cyRef, true)}
      ></i>
      {/* Unlock selected elements button */}
      <i
        className="pi pi-fw pi-lock-open cursor-pointer hover:text-blue-300 unlockSelected"
        onClick={() => changeLockState(cyRef, false)}
      ></i>
      {/* Delete selected elements button */}
      <i
        className="pi pi-fw pi-trash cursor-pointer hover:text-blue-300 deleteSelected"
        onClick={() => {
          if (!cyRef) return;
          let selected = cyRef.current.elements(":selected");
          if (selected.length === 0) {
            toastWarn("No elements are selected.");
            return;
          }
          if (selected.nodes()?.length > 0) {
            deleteManyNodesMutation.mutate({
              ids: selected.nodes().map((node: any) => node.data().id),
              board_id: board_id as string,
            });
          }
          if (selected.edges().length > 0) {
            deleteManyEdgesMutation.mutate({
              ids: selected.edges().map((edge: any) => edge.data().id),
              board_id: board_id as string,
            });
          }
        }}
      ></i>

      {/* Drawmode button */}
      <i
        className={`pi pi-pencil cursor-pointer hover:text-blue-300 ${
          boardState.drawMode ? "text-green-500" : ""
        } drawMode`}
        onClick={() =>
          boardStateDispatch({ type: "DRAW", payload: !boardState.drawMode })
        }
      ></i>
      {/* Export button */}
      <i
        className="pi pi-download cursor-pointer hover:text-blue-300 saveButton"
        onClick={() => {
          setExportDialog({ ...exportDialog, show: true });
        }}
      ></i>
      {/* Search button */}
      <i
        className="pi pi-search cursor-pointer hover:text-blue-300 searchButton"
        onClick={() => setSearchDialog((prev) => !prev)}
      ></i>

      {/* Reset to default color button */}
      <span
        className="cursor-pointer flex hover:text-blue-300 resetColors"
        onClick={() =>
          updateColor(
            cyRef,
            "#595959",
            board_id as string,
            updateNodeMutation,
            updateEdgeMutation
          )
        }
      >
        <Icon icon="mdi:invert-colors-off" fontSize={20} />
      </span>
      {/* Edit selected button */}
      <span
        className="cursor-pointer flex hover:text-blue-300 editSelectedElements"
        onClick={() => {
          if (!cyRef) return;
          if (cyRef.current.elements(":selected")?.length > 0) {
            setUpdateManyDialog(true);
          } else {
            toastWarn("No elements are selected.");
          }
        }}
      >
        <Icon icon="mdi:vector-polyline-edit" />
      </span>
      {/* Color preset button */}
      <i className="pi pi-fw pi-palette cursor-pointer hover:text-blue-300 colorPresets"></i>
      {/* Color picker square */}
      <ColorPicker
        onChange={(e) => {
          debouncedColorPick(e.target.value);
        }}
        className="w-2rem h-2rem"
        defaultColor="595959"
      ></ColorPicker>
    </div>
  );
}
