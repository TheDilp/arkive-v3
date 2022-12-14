/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
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
import { useUpdateManySubItems, useUpdateNodeEdge } from "../../CRUD/ItemsCRUD";
// import { changeLockState, cytoscapeGridOptions, updateColor } from "../../../utils/boardUtils";
import { useGetItem } from "../../hooks/getItemHook";
import { BoardType } from "../../types/boardTypes";
import { BoardReferenceAtom, BoardStateAtom, DialogAtom } from "../../utils/Atoms/atoms";
import { changeLockState, updateColor } from "../../utils/boardUtils";
import { ColorPresets, cytoscapeGridOptions } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { ImageDropdownItem } from "../Dropdown/ImageDropdownItem";

type Props = {};
export default function BoardQuickBar({}: Props) {
  const { project_id, item_id } = useParams();
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [boardState, setBoardState] = useAtom(BoardStateAtom);
  const [, setDialog] = useAtom(DialogAtom);
  const board = useGetItem(project_id as string, item_id as string, "boards") as BoardType;

  const updateNodeMutation = useUpdateNodeEdge(project_id as string, item_id as string, "nodes");
  const updateEdgeMutation = useUpdateNodeEdge(project_id as string, item_id as string, "edges");
  const updateManyNodes = useUpdateManySubItems(project_id as string, "nodes");
  const [updateManyDialog, setUpdateManyDialog] = useState(false);

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
  //       updateColor(boardRef, `#${color}`, item_id as string, updateNodeMutation, updateEdgeMutation);
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
  //             boardRef.png({
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
  //             boardRef.jpg({
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
  //         new Blob([JSON.stringify(boardRef.json(true))], {
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
  const { edgeHandles } = boardState;
  return (
    <div
      className="absolute left-1/2 z-10 flex h-12 w-1/6 items-center justify-around rounded bg-zinc-800 text-white shadow-md"
      style={{
        top: "95.6vh",
      }}>
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
          <div className="flex w-40 flex-wrap gap-1">
            {ColorPresets.map((color: string) => (
              <button
                key={color}
                className="h-4 w-4 cursor-pointer rounded-sm"
                onClick={() => {
                  //   updateColor(cyRef, `#${color}`, board_id as string, updateNodeMutation, updateEdgeMutation);
                }}
                style={{
                  backgroundColor: `#${color}`,
                }}
                type="button"
              />
            ))}
          </div>
        </Tooltip>
        <Tooltip content="Pick color for selected elements" position="top" target=".pickColor" />
      </span>

      {/* Toggle grid visibility */}
      <span
        className={`flex cursor-pointer hover:text-blue-300 ${boardState.grid ? "text-green-500" : ""}  drawGrid`}
        onClick={() => setBoardState({ ...boardState, grid: !boardState.grid })}>
        <Icon icon="mdi:grid" />
      </span>
      {/* Lock selected elements button */}
      <i
        className="pi pi-fw pi-lock lockSelected cursor-pointer hover:text-blue-300"
        onClick={() => {
          if (boardRef) changeLockState(boardRef, true, updateManyNodes);
        }}
      />
      {/* Unlock selected elements button */}
      <i
        className="pi pi-fw pi-lock-open unlockSelected cursor-pointer hover:text-blue-300"
        onClick={() => {
          if (boardRef) changeLockState(boardRef, false, updateManyNodes);
        }}
      />
      {/* Delete selected elements button */}
      <i
        className="pi pi-fw pi-trash deleteSelected cursor-pointer hover:text-blue-300"
        // onClick={() => {
        //   if (!cyRef) return;
        //   const selected = boardRef.elements(":selected");
        //   if (selected.length === 0) {
        //     toastWarn("No elements are selected.");
        //     return;
        //   }
        //   confirmDelete(selected);
        // }}
      />

      {/* Drawmode button */}
      <i
        className={`pi pi-pencil cursor-pointer hover:text-blue-300 ${
          edgeHandles && edgeHandles.drawMode ? "text-green-500" : ""
        } drawMode`}
        onClick={() => {
          if (boardRef && edgeHandles) {
            if (edgeHandles.drawMode) {
              edgeHandles.ref.disable();
              edgeHandles.ref.disableDrawMode();
              boardRef.autoungrabify(false);
              boardRef.autounselectify(false);
              boardRef.autolock(false);
              boardRef.zoomingEnabled(true);
              boardRef.userZoomingEnabled(true);
              boardRef.panningEnabled(true);
              setBoardState({ ...boardState, edgeHandles: { ref: edgeHandles.ref, drawMode: false } });
            } else {
              edgeHandles.ref.enable();
              edgeHandles.ref.enableDrawMode();
              setBoardState({ ...boardState, edgeHandles: { ref: edgeHandles.ref, drawMode: true } });
            }
          }
        }}
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
        onClick={() => setDialog({ ...DefaultDialog, type: "node_search", show: true, position: "top" })}
      />

      {/* Reset to default color button */}
      <span
        className="resetColors flex cursor-pointer hover:text-blue-300"
        onClick={() => {
          if (boardRef) updateColor(boardRef, "#595959", item_id as string, updateNodeMutation, updateEdgeMutation);
        }}>
        <Icon fontSize={20} icon="mdi:invert-colors-off" />
      </span>
      {/* Edit selected button */}
      <span
        className="editSelectedElements flex cursor-pointer hover:text-blue-300"
        // onClick={() => {
        //   if (!cyRef) return;
        //   if (boardRef.elements(":selected")?.length > 0) {
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
        // onChange={(e) => {
        //   debouncedColorPick(e.target.value);
        // }}
      />
    </div>
    //   {/* Dialogs */}
    //   {/* Search nodes dialog */}
    //   {/* <Dialog
    //     className="w-80"
    //     header="Search Nodes"
    //     modal={false}
    //     onHide={() => {
    //       setSearchDialog(false);
    //       setSearch("");
    //       setFilteredNodes(board?.nodes || []);
    //     }}
    //     position="center"
    //     visible={searchDialog}>
    //     <AutoComplete
    //       autoFocus
    //       className="ml-2 w-60"
    //       completeMethod={(e) =>
    //         setFilteredNodes(board?.nodes.filter((node) => node.label?.toLowerCase().includes(e.query.toLowerCase())) || [])
    //       }
    //       field="label"
    //       //   itemTemplate={(item: BoardNodeType) => (
    //       //     // <span>
    //       //     //   <ImageDropdownItem link={item.customImage?.link || ""} title={item.label || ""} />
    //       //     // </span>
    //       //   )}
    //       onChange={(e) => setSearch(e.value)}
    //       //   onSelect={(e) => {
    //       //     if (!cyRef) return;
    //       //     if (e.value) {
    //       //       const foundNode = boardRef.getElementById(e.value.id);
    //       //       boardRef.animate(
    //       //         {
    //       //           center: {
    //       //             eles: foundNode,
    //       //           },
    //       //           zoom: 1,
    //       //         },
    //       //         {
    //       //           duration: 1250,
    //       //         },
    //       //       );
    //       //     }
    //       //   }}
    //       placeholder="Search Nodes"
    //       suggestions={filteredNodes}
    //       value={search}
    //       //   virtualScrollerOptions={virtualScrollerSettings}
    //     />
    //   </Dialog> */}
    //   {/* Export board dialog */}
    //   {/* <Dialog
    //     header={`Export Board - ${board?.title}`}
    //     modal={false}
    //     onHide={() =>
    //       setExportDialog({
    //         view: "Graph",
    //         background: "Color",
    //         type: "PNG",
    //         show: false,
    //       })
    //     }
    //     position="top-left"
    //     style={{
    //       maxWidth: "14vw",
    //     }}
    //     visible={exportDialog.show}>
    //     <div className="flex flex-wrap">
    //       <div className="flex w-full flex-wrap justify-center">
    //         <h3 className="mb-1 mt-0 w-full text-center">View</h3>
    //         <SelectButton
    //           onChange={(e) => setExportDialog({ ...exportDialog, view: e.value })}
    //           options={["Graph", "Current"]}
    //           value={exportDialog.view}
    //         />
    //       </div>
    //       <div className="flex w-full flex-wrap justify-center">
    //         <h3 className="my-2">Background</h3>
    //         <SelectButton
    //           onChange={(e) => setExportDialog({ ...exportDialog, background: e.value })}
    //           options={["Color", "Transparent"]}
    //           value={exportDialog.background}
    //         />
    //       </div>
    //       <div className="flex w-full flex-wrap justify-center">
    //         <h3 className="my-2">File Type</h3>
    //         <SelectButton
    //           onChange={(e) => setExportDialog({ ...exportDialog, type: e.value })}
    //           options={["PNG", "JPEG", "JSON"]}
    //           value={exportDialog.type}
    //         />
    //       </div>
    //       <div className="mt-2 flex w-full justify-center">
    //         <Button
    //           className="p-button-outlined p-button-success"
    //           icon="pi pi-download"
    //           iconPos="right"
    //           label="Export"
    //           //   onClick={() => {
    //           //     if (cyRef && boardRef) {
    //           //       exportBoardFunction(exportDialog.view, exportDialog.background, exportDialog.type, board?.title);
    //           //     } else {
    //           //       toastWarn("Ooops");
    //           //     }
    //           //   }}
    //         />
    //       </div>
    //     </div>
    //   </Dialog> */}
    //   {/* <Dialog
    //     className="w-[25rem] overflow-y-auto"
    //     header="Update Many"
    //     modal={false}
    //     onHide={() => setUpdateManyDialog(false)}
    //     position="right"
    //     style={{
    //       height: "45rem",
    //     }}
    //     visible={updateManyDialog}>
    //     <TabView renderActiveOnly>
    //       <TabPanel header="Nodes">{/* <UpdateManyNodes /> */}</TabPanel>
    //       <TabPanel header="Edges">{/* <UpdateManyEdges /> */}</TabPanel>
    //     </TabView>
    // </Dialog> */}
  );
}
