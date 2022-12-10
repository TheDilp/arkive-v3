import { Icon } from "@iconify/react";
// import { saveAs } from "file-saver";
import { useAtom } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { TabPanel, TabView } from "primereact/tabview";
import { Tooltip } from "primereact/tooltip";
import { Dispatch, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { BoardExportType, BoardNodeType, BoardStateAction, BoardStateType } from "../../../types/BoardTypes";
import { changeLockState, ColorPresets, cytoscapeGridOptions, updateColor } from "../../../utils/boardUtils";
import { useGetItem } from "../../hooks/getItemHook";
import { BoardType } from "../../types/boardTypes";
import { BoardReferenceAtom } from "../../utils/Atoms/atoms";
import { ImageDropdownItem } from "../Dropdown/ImageDropdownItem";

type Props = {
  boardState: BoardStateType;
  boardStateDispatch: Dispatch<BoardStateAction>;
};
export default function BoardQuickBar({}: Props) {
  const { project_id, item_id } = useParams();
  const [boardRef] = useAtom(BoardReferenceAtom);
  const board = useGetItem(project_id as string, item_id as string, "boards") as BoardType;
  const [updateManyDialog, setUpdateManyDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [searchDialog, setSearchDialog] = useState(false);
  const [filteredNodes, setFilteredNodes] = useState<BoardNodeType[]>(board?.nodes.filter((node) => node.label) || []);
  const [exportDialog, setExportDialog] = useState<BoardExportType>({
    view: "Graph",
    background: "Color",
    type: "PNG",
    show: false,
  });

  //   const updateNodeMutation = useUpdateNode(project_id as string);
  //   const updateEdgeMutation = useUpdateEdge(project_id as string);
  //   const deleteManyNodesMutation = useDeleteManyNodes(project_id as string);
  //   const deleteManyEdgesMutation = useDeleteManyEdges(project_id as string);
  //   const debouncedColorPick = useDebouncedCallback(
  //     // function
  //     (color) => {
  //       updateColor(cyRef, `#${color}`, board_id as string, updateNodeMutation, updateEdgeMutation);
  //     },
  //     // delay in ms
  //     400,
  //   );

  //   const exportBoardFunction = (
  //     view: "Graph" | "View",
  //     background: "Color" | "Transparent",
  //     type: "PNG" | "JPEG" | "JSON",
  //     boardTitle?: string,
  //   ) => {
  //     if (!cyRef) return;
  //     if (type === "PNG") {
  //       saveAs(
  //         new Blob(
  //           [
  //             cyRef.current.png({
  //               output: "blob",
  //               bg: background === "Color" ? "#121212" : "transparent",
  //               full: view === "Graph",
  //             }),
  //           ],
  //           {
  //             type: "image/png",
  //           },
  //         ),
  //         `${boardTitle || "ArkiveBoard"}.png`,
  //       );
  //     } else if (type === "JPEG") {
  //       saveAs(
  //         new Blob(
  //           [
  //             cyRef.current.jpg({
  //               output: "blob",
  //               bg: background === "Color" ? "#121212" : "transparent",
  //               full: view === "Graph",
  //             }),
  //           ],
  //           {
  //             type: "image/jpg",
  //           },
  //         ),
  //         `${boardTitle || "ArkiveBoard"}.jpg`,
  //       );
  //     } else if (type === "JSON") {
  //       saveAs(
  //         new Blob([JSON.stringify(cyRef.current.json(true))], {
  //           type: "application/json",
  //         }),
  //         `${boardTitle || "ArkiveBoard"}.json`,
  //       );
  //     }
  //   };

  //   const confirmDelete = (selected: any) => {
  //     confirmDialog({
  //       message: <div>Are you sure you want to delete these nodes/edges?</div>,
  //       header: "Delete nodes/edges",
  //       icon: "pi pi-exclamation-triangle",
  //       acceptClassName: "p-button-outlined text-red-400",
  //       accept: async () => {
  //         if (selected.nodes()?.length > 0) {
  //           deleteManyNodesMutation.mutate({
  //             ids: selected.nodes().map((node: any) => node.data().id),
  //             board_id: board_id as string,
  //           });
  //         }
  //         if (selected.edges().length > 0) {
  //           deleteManyEdgesMutation.mutate({
  //             ids: selected.edges().map((edge: any) => edge.data().id),
  //             board_id: board_id as string,
  //           });
  //         }
  //       },
  //       reject: () => {},
  //     });
  //   };

  return (
    <div
      className="border-round surface-50 h-3rem align-items-center justify-content-around shadow-5 absolute flex w-2 text-white"
      style={{
        top: "95.6vh",
        left: "50%",
        zIndex: 5,
      }}>
      {/* Dialogs */}
      {/* Search nodes dialog */}
      <Dialog
        className="w-20rem"
        header="Search Nodes"
        modal={false}
        onHide={() => {
          setSearchDialog(false);
          setSearch("");
          setFilteredNodes(board?.nodes || []);
        }}
        position="center"
        visible={searchDialog}>
        <AutoComplete
          autoFocus
          className="w-15rem ml-2"
          completeMethod={(e) =>
            setFilteredNodes(board?.nodes.filter((node) => node.label?.toLowerCase().includes(e.query.toLowerCase())) || [])
          }
          field="label"
          //   itemTemplate={(item: BoardNodeType) => (
          //     // <span>
          //     //   <ImageDropdownItem link={item.customImage?.link || ""} title={item.label || ""} />
          //     // </span>
          //   )}
          onChange={(e) => setSearch(e.value)}
          //   onSelect={(e) => {
          //     if (!cyRef) return;
          //     if (e.value) {
          //       const foundNode = cyRef.current.getElementById(e.value.id);
          //       cyRef.current.animate(
          //         {
          //           center: {
          //             eles: foundNode,
          //           },
          //           zoom: 1,
          //         },
          //         {
          //           duration: 1250,
          //         },
          //       );
          //     }
          //   }}
          placeholder="Search Nodes"
          suggestions={filteredNodes}
          value={search}
          //   virtualScrollerOptions={virtualScrollerSettings}
        />
      </Dialog>
      {/* Export board dialog */}
      <Dialog
        header={`Export Board - ${board?.title}`}
        modal={false}
        onHide={() =>
          setExportDialog({
            view: "Graph",
            background: "Color",
            type: "PNG",
            show: false,
          })
        }
        position="top-left"
        style={{
          maxWidth: "14vw",
        }}
        visible={exportDialog.show}>
        <div className="flex flex-wrap">
          <div className="justify-content-center flex w-full flex-wrap">
            <h3 className="mb-1 mt-0 w-full text-center">View</h3>
            <SelectButton
              onChange={(e) => setExportDialog({ ...exportDialog, view: e.value })}
              options={["Graph", "Current"]}
              value={exportDialog.view}
            />
          </div>
          <div className="justify-content-center flex w-full flex-wrap">
            <h3 className="my-2">Background</h3>
            <SelectButton
              onChange={(e) => setExportDialog({ ...exportDialog, background: e.value })}
              options={["Color", "Transparent"]}
              value={exportDialog.background}
            />
          </div>
          <div className="justify-content-center flex w-full flex-wrap">
            <h3 className="my-2">File Type</h3>
            <SelectButton
              onChange={(e) => setExportDialog({ ...exportDialog, type: e.value })}
              options={["PNG", "JPEG", "JSON"]}
              value={exportDialog.type}
            />
          </div>
          <div className="justify-content-center mt-2 flex w-full">
            <Button
              className="p-button-outlined p-button-success"
              icon="pi pi-download"
              iconPos="right"
              label="Export"
              //   onClick={() => {
              //     if (cyRef && cyRef.current) {
              //       exportBoardFunction(exportDialog.view, exportDialog.background, exportDialog.type, board?.title);
              //     } else {
              //       toastWarn("Ooops");
              //     }
              //   }}
            />
          </div>
        </div>
      </Dialog>
      <Dialog
        className="w-25rem overflow-y-auto"
        header="Update Many"
        modal={false}
        onHide={() => setUpdateManyDialog(false)}
        position="right"
        style={{
          height: "45rem",
        }}
        visible={updateManyDialog}>
        <TabView renderActiveOnly>
          <TabPanel header="Nodes">{/* <UpdateManyNodes /> */}</TabPanel>
          <TabPanel header="Edges">{/* <UpdateManyEdges /> */}</TabPanel>
        </TabView>
      </Dialog>
      {/* Tooltips */}
      <span>
        <Tooltip autoHide content="Toggle grid display" position="top" target=".drawGrid" />
        <Tooltip autoHide content="Lock selected nodes" position="top" target=".lockSelected" />
        <Tooltip autoHide content="Unlock selected nodes" position="top" target=".unlockSelected" />
        <Tooltip autoHide content="Delete selected elements" position="top" target=".deleteSelected" />
        <Tooltip autoHide content="Toggle Draw Mode" position="top" target=".drawMode" />
        <Tooltip autoHide content="Export Board" position="top" target=".saveButton" />
        <Tooltip autoHide content="Search Board" position="top" target=".searchButton" />
        <Tooltip autoHide content="Reset selected to default color" position="top" target=".resetColors" />
        <Tooltip autoHide content="Edit selected elements" position="top" target=".editSelectedElements" />

        <Tooltip autoHide={false} hideEvent="focus" position="top" target=".colorPresets">
          <div className="w-10rem flex flex-wrap">
            {/* {ColorPresets.map((color) => (
              <div
                key={color}
                className="w-1rem h-1rem border-rounded cursor-pointer"
                onClick={() => {
                  updateColor(cyRef, `#${color}`, board_id as string, updateNodeMutation, updateEdgeMutation);
                }}
                style={{
                  backgroundColor: `#${color}`,
                }}
              />
            ))} */}
          </div>
        </Tooltip>
        <Tooltip content="Pick color for selected elements" position="top" target=".pickColor" />
      </span>

      {/* Toggle grid visibility */}
      <span
      // className={`flex cursor-pointer hover:text-blue-300 ${boardState.drawGrid ? "text-green-500" : ""}  drawGrid`}
      // onClick={() => {
      //   //   if (cyRef) {
      //   //     boardStateDispatch({ type: "GRID", payload: !boardState.drawGrid });
      //   //     cyRef.current.gridGuide({
      //   //       ...cytoscapeGridOptions,
      //   //       drawGrid: !boardState.drawGrid,
      //   //     });
      //   //   }
      // }}
      >
        <Icon icon="mdi:grid" />
      </span>
      {/* Lock selected elements button */}
      <i
        className="pi pi-fw pi-lock lockSelected cursor-pointer hover:text-blue-300"
        // onClick={() => changeLockState(cyRef, true)}
      />
      {/* Unlock selected elements button */}
      <i
        className="pi pi-fw pi-lock-open unlockSelected cursor-pointer hover:text-blue-300"
        // onClick={() => changeLockState(cyRef, false)}
      />
      {/* Delete selected elements button */}
      <i
        className="pi pi-fw pi-trash deleteSelected cursor-pointer hover:text-blue-300"
        // onClick={() => {
        //   if (!cyRef) return;
        //   const selected = cyRef.current.elements(":selected");
        //   if (selected.length === 0) {
        //     toastWarn("No elements are selected.");
        //     return;
        //   }
        //   confirmDelete(selected);
        // }}
      />

      {/* Drawmode button */}
      <i
      // className={`pi pi-pencil cursor-pointer hover:text-blue-300 ${boardState.drawMode ? "text-green-500" : ""} drawMode`}
      // onClick={() => boardStateDispatch({ type: "DRAW", payload: !boardState.drawMode })}
      />
      {/* Export button */}
      <i
        className="pi pi-download saveButton cursor-pointer hover:text-blue-300"
        // onClick={() => {
        //   setExportDialog({ ...exportDialog, show: true });
        // }}
      />
      {/* Search button */}
      <i
        className="pi pi-search searchButton cursor-pointer hover:text-blue-300"
        // onClick={() => setSearchDialog((prev) => !prev)}
      />

      {/* Reset to default color button */}
      <span
        className="resetColors flex cursor-pointer hover:text-blue-300"
        // onClick={() => updateColor(cyRef, "#595959", board_id as string, updateNodeMutation, updateEdgeMutation)}
      >
        <Icon fontSize={20} icon="mdi:invert-colors-off" />
      </span>
      {/* Edit selected button */}
      <span
        className="editSelectedElements flex cursor-pointer hover:text-blue-300"
        // onClick={() => {
        //   if (!cyRef) return;
        //   if (cyRef.current.elements(":selected")?.length > 0) {
        //     setUpdateManyDialog(true);
        //   } else {
        //     toastWarn("No elements are selected.");
        //   }
        // }}
      >
        <Icon icon="mdi:vector-polyline-edit" />
      </span>
      {/* Color preset button */}
      <i className="pi pi-fw pi-palette colorPresets cursor-pointer hover:text-blue-300" />
      {/* Color picker square */}
      <ColorPicker
        className="w-2rem h-2rem"
        defaultColor="595959"
        onChange={(e) => {
          //   debouncedColorPick(e.target.value);
        }}
      />
    </div>
  );
}
