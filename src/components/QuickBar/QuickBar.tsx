/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { ColorPicker } from "primereact/colorpicker";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useDeleteManySubItems, useUpdateManySubItems, useUpdateSubItem } from "../../CRUD/ItemsCRUD";
// import { changeLockState, cytoscapeGridOptions, updateColor } from "../../../utils/boardUtils";
import { useGetItem } from "../../hooks/useGetItem";
import { BoardType } from "../../types/boardTypes";
import { BoardEdgeHandlesAtom, BoardReferenceAtom, BoardStateAtom, DialogAtom } from "../../utils/Atoms/atoms";
import { changeLockState, updateColor } from "../../utils/boardUtils";
import { ColorPresets } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";

export default function BoardQuickBar() {
  const { item_id } = useParams();
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [boardState, setBoardState] = useAtom(BoardStateAtom);
  const [, setDialog] = useAtom(DialogAtom);
  const [edgehandles] = useAtom(BoardEdgeHandlesAtom);
  const { data: board } = useGetItem(item_id as string, "boards") as { data: BoardType };

  const updateNodeMutation = useUpdateSubItem(item_id as string, "nodes", "boards");
  const updateEdgeMutation = useUpdateSubItem(item_id as string, "edges", "boards");
  const updateManyNodes = useUpdateManySubItems(item_id as string, "nodes");
  const [, setUpdateManyDialog] = useState(false);

  const [, setExportDialog] = useAtom(DialogAtom);
  const deleteManyNodesMutation = useDeleteManySubItems(item_id as string, "nodes");
  //   const deleteManyEdgesMutation = useDeleteManyEdges(project_id as string);
  const debouncedColorPick = useDebouncedCallback(
    // function
    (color) => {
      if (boardRef) updateColor(boardRef, `#${color}`, item_id as string, updateNodeMutation, updateEdgeMutation);
    },
    // delay in ms
    400,
  );

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
                  if (boardRef) updateColor(boardRef, `#${color}`, updateManyNodes, updateEdgeMutation);
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
        onClick={() => {
          if (!boardRef) return;
          const selected = boardRef.elements(":selected");
          if (selected.length === 0) {
            toaster("warning", "No elements are selected.");
          } else {
            deleteManyNodesMutation.mutate(selected.map((el) => el.id()));
          }
          // conirm(selected);
        }}
      />

      {/* Drawmode button */}
      <i
        className={`pi pi-pencil cursor-pointer hover:text-blue-300 ${
          edgehandles && boardState.drawMode ? "text-green-500" : ""
        } drawMode`}
        onClick={() => {
          if (boardRef && edgehandles) {
            if (boardState.drawMode) {
              edgehandles.disable();
              edgehandles.disableDrawMode();
              boardRef.autoungrabify(false);
              boardRef.autounselectify(false);
              boardRef.autolock(false);
              boardRef.zoomingEnabled(true);
              boardRef.userZoomingEnabled(true);
              boardRef.panningEnabled(true);
              setBoardState((prev) => ({ ...prev, drawMode: false }));
            } else {
              edgehandles.enable();
              edgehandles.enableDrawMode();
              setBoardState((prev) => ({ ...prev, drawMode: true }));
            }
          }
        }}
      />
      {/* Export button */}
      <i
        className="pi pi-download saveButton cursor-pointer hover:text-blue-300"
        onClick={() => {
          setExportDialog((prev) => ({
            ...prev,
            data: { title: board.title },
            position: "center",
            modal: true,
            type: "export_board",
            show: true,
          }));
        }}
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
        onClick={() => {
          if (!boardRef) return;
          if (boardRef.elements(":selected")?.length > 0) {
            setUpdateManyDialog(true);
          } else {
            toaster("warning", "No elements are selected.");
          }
        }}>
        <Icon icon="mdi:vector-polyline-edit" />
      </span>
      {/* Color preset button */}
      <i className="pi pi-fw pi-palette colorPresets cursor-pointer hover:text-blue-300" />
      {/* Color picker square */}
      <ColorPicker
        className="w-2rem h-2rem"
        defaultColor="595959"
        onChange={(e) => {
          debouncedColorPick(e.target.value);
        }}
      />
    </div>
  );
}
