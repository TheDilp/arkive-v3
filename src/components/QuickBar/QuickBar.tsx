/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useDeleteManySubItems, useUpdateManySubItems } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { BoardType, EdgeType, NodeType } from "../../types/ItemTypes/boardTypes";
import { BoardReferenceAtom, BoardStateAtom, DialogAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { changeLockState, updateColor } from "../../utils/boardUtils";
import { ColorPresets } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";
import ColorInput from "../ColorInput/ColorInput";

export default function BoardQuickBar() {
  const { item_id } = useParams();
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [boardState, setBoardState] = useAtom(BoardStateAtom);
  const [pickerColor, setPickerColor] = useState("#595959");
  const [, setDialog] = useAtom(DialogAtom);
  const [, setDrawer] = useAtom(DrawerAtom);
  const { data: board } = useGetItem<BoardType>(item_id as string, "boards");

  const updateManyNodes = useUpdateManySubItems<NodeType>(item_id as string, "nodes");
  const updateManyEdges = useUpdateManySubItems<EdgeType>(item_id as string, "edges");

  const [, setExportDialog] = useAtom(DialogAtom);
  const deleteManyNodesMutation = useDeleteManySubItems(item_id as string, "nodes");
  const deleteManyEdgesMutation = useDeleteManySubItems(item_id as string, "edges");
  const debouncedColorPick = useDebouncedCallback(
    // function
    (color) => {
      if (boardRef) updateColor(boardRef, color, updateManyNodes, updateManyEdges);
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
  if (!board) return null;
  return (
    <div className="absolute bottom-0 z-10 flex h-12 w-72 items-center justify-evenly rounded bg-zinc-800 px-2 text-white shadow-md">
      <span>
        <Tooltip autoHide content="Toggle grid display" position="top" target=".drawGrid" />
        <Tooltip autoHide content="Lock selected nodes" position="top" target=".lockSelected" />
        <Tooltip autoHide content="Unlock selected nodes" position="top" target=".unlockSelected" />
        <Tooltip autoHide content="Delete selected elements" position="top" target=".deleteSelected" />
        <Tooltip autoHide content="Toggle Draw Mode" position="top" target=".drawMode" />
        <Tooltip autoHide content="Export Board" position="top" target=".saveButton" />
        <Tooltip autoHide content="Search Board" position="top" target=".searchButton" />
        <Tooltip autoHide content="Reset selected to board's default colors" position="top" target=".resetColors" />
        <Tooltip autoHide content="Edit selected elements" position="top" target=".editSelectedElements" />

        <Tooltip autoHide={false} hideEvent="focus" position="top" target=".colorPresets">
          <div className="flex w-40 flex-wrap gap-1">
            {ColorPresets.map((color: string) => (
              <button
                key={color}
                className="h-4 w-4 cursor-pointer rounded-sm"
                onClick={() => {
                  if (boardRef) updateColor(boardRef, `#${color}`, updateManyNodes, updateManyEdges);
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
            const nodes = selected.nodes();
            const edges = selected.edges();
            if (nodes.length) deleteManyNodesMutation.mutate(nodes.map((node) => node.id()));
            if (edges.length) deleteManyEdgesMutation.mutate(edges.map((edge) => edge.id()));
          }
        }}
      />

      {/* Drawmode button */}
      <i
        className={`pi pi-pencil cursor-pointer hover:text-blue-300 ${boardState.drawMode ? "text-green-500" : ""} drawMode`}
        onClick={() => {
          if (boardState.drawMode) {
            setBoardState((prev) => ({ ...prev, drawMode: false }));
          } else {
            setBoardState((prev) => ({ ...prev, drawMode: true }));
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

      {/* Reset nodes/edges to the board's default color button */}
      <span
        className="resetColors flex cursor-pointer hover:text-blue-300"
        onClick={() => {
          if (boardRef)
            updateColor(
              boardRef,
              { nodeColor: board.defaultNodeColor, edgeColor: board.defaultEdgeColor },
              updateManyNodes,
              updateManyEdges,
            );
        }}>
        <Icon fontSize={20} icon="mdi:invert-colors-off" />
      </span>
      {/* Edit selected button */}
      <span
        className="editSelectedElements flex cursor-pointer hover:text-blue-300"
        onClick={() => {
          if (!boardRef) return;
          if (boardRef.elements(":selected")?.length > 0) {
            setDrawer({ ...DefaultDrawer, position: "right", type: "many_nodes", show: true });
          } else {
            toaster("warning", "No elements are selected.");
          }
        }}>
        <Icon icon="mdi:vector-polyline-edit" />
      </span>
      {/* Color preset button */}
      <i className="pi pi-fw pi-palette colorPresets cursor-pointer hover:text-blue-300" />
      {/* Color picker square */}
      <ColorInput
        color={pickerColor}
        hasInput={false}
        name="pickerColor"
        onChange={({ value }) => {
          setPickerColor(value);
          debouncedColorPick(value);
        }}
      />
    </div>
  );
}
