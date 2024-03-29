/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Icon } from "@iconify/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Tooltip as PrimeTooltip } from "primereact/tooltip";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useDeleteManySubItems, useUpdateManySubItems } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { BoardType, CurveStyleType, EdgeType, NodeType } from "../../types/ItemTypes/boardTypes";
import { BoardReferenceAtom, BoardStateAtom, DialogAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { changeLockState, curveStyles, getCurveStyleIcon, updateColor } from "../../utils/boardUtils";
import { ColorPresets } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { toaster } from "../../utils/toast";
import ColorInput from "../ColorInput/ColorInput";
import DefaultTooltip from "../Tooltip/DefaultTooltip";
import { Tooltip } from "../Tooltip/Tooltip";

export default function BoardQuickBar({ isViewOnly }: { isViewOnly?: boolean }) {
  const { item_id } = useParams();
  const boardRef = useAtomValue(BoardReferenceAtom);
  const [boardState, setBoardState] = useAtom(BoardStateAtom);
  const [pickerColor, setPickerColor] = useState("#595959");
  const setDialog = useSetAtom(DialogAtom);
  const setDrawer = useSetAtom(DrawerAtom);

  const { data: board } = useGetItem<BoardType>(item_id as string, "boards");

  const updateManyNodes = useUpdateManySubItems<NodeType>(item_id as string, "nodes");
  const updateManyEdges = useUpdateManySubItems<EdgeType>(item_id as string, "edges");

  const setExportDialog = useSetAtom(DialogAtom);
  const deleteManyNodesMutation = useDeleteManySubItems(item_id as string, "nodes");
  const deleteManyEdgesMutation = useDeleteManySubItems(item_id as string, "edges");
  const debouncedColorPick = useDebouncedCallback((color) => {
    if (boardRef) updateColor(boardRef, color, updateManyNodes, updateManyEdges);
  }, 400);

  function changeCurveStyle(curveStyle: CurveStyleType) {
    setBoardState((prev) => ({ ...prev, curveStyle }));
  }
  function changeDrawMode(drawMode: boolean) {
    setBoardState((prev) => ({ ...prev, drawMode }));
  }

  if (!board) return null;
  return (
    <div className="absolute bottom-0 z-10 flex h-12 w-72 items-center justify-evenly rounded bg-zinc-800 px-2 text-white shadow-md">
      <span>
        <PrimeTooltip autoHide content="Add nodes" position="top" target=".addNodes" />
        <PrimeTooltip autoHide content="Toggle grid display" position="top" target=".drawGrid" />
        <PrimeTooltip autoHide content="Lock selected nodes" position="top" target=".lockSelected" />
        <PrimeTooltip autoHide content="Unlock selected nodes" position="top" target=".unlockSelected" />
        <PrimeTooltip autoHide content="Delete selected elements" position="top" target=".deleteSelected" />
        <PrimeTooltip autoHide content="Toggle Draw Mode" position="top" target=".drawMode" />
        <PrimeTooltip autoHide content="Export Board" position="top" target=".saveButton" />
        <PrimeTooltip autoHide content="Search Board" position="top" target=".searchButton" />
        <PrimeTooltip autoHide content="Reset selected to board's default colors" position="top" target=".resetColors" />
        <PrimeTooltip autoHide content="Edit selected elements" position="top" target=".editSelectedElements" />

        <PrimeTooltip autoHide={false} disabled={isViewOnly} hideEvent="focus" position="top" target=".colorPresets">
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
        </PrimeTooltip>
        <PrimeTooltip content="Pick color for selected elements" position="top" target=".pickColor" />
      </span>

      <span
        className={`flex ${isViewOnly ? "cursor-not-allowed" : "cursor-pointer"} hover:text-sky-400 ${
          boardState.addNodes ? "text-green-500" : ""
        }  addNodes`}
        onClick={() => {
          if (!isViewOnly) setBoardState({ ...boardState, drawMode: false, addNodes: !boardState.addNodes });
        }}>
        <Icon icon={IconEnum.add} />
      </span>

      {/* Toggle grid visibility */}
      <span
        className={`flex cursor-pointer hover:text-sky-400 ${boardState.grid ? "text-green-500" : ""}  drawGrid`}
        onClick={() => setBoardState({ ...boardState, grid: !boardState.grid })}>
        <Icon icon={IconEnum.grid} />
      </span>
      {/* Lock selected elements button */}
      <span
        className="pi pi-fw pi-lock lockSelected cursor-pointer hover:text-sky-400"
        onClick={() => {
          if (boardRef && !isViewOnly) changeLockState(boardRef, true, updateManyNodes);
        }}
      />
      {/* Unlock selected elements button */}
      <span
        className="pi pi-fw pi-lock-open unlockSelected cursor-pointer hover:text-sky-400"
        onClick={() => {
          if (boardRef && !isViewOnly) changeLockState(boardRef, false, updateManyNodes);
        }}
      />
      {/* Delete selected elements button */}
      <i
        className="pi pi-fw pi-trash deleteSelected cursor-pointer hover:text-sky-400"
        onClick={() => {
          if (!boardRef || isViewOnly) return;
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

      <Tooltip
        content={
          <DefaultTooltip>
            <div className="flex items-center gap-x-1">
              {curveStyles.map((curveStyle: CurveStyleType) => (
                <Icon
                  key={curveStyle}
                  className={`cursor-pointer hover:text-sky-400 ${
                    curveStyle === boardState.curveStyle && boardState.drawMode ? "text-sky-400" : ""
                  }`}
                  fontSize={24}
                  icon={getCurveStyleIcon(curveStyle)}
                  onClick={() => {
                    changeCurveStyle(curveStyle);
                    changeDrawMode(true);
                  }}
                />
              ))}
            </div>
          </DefaultTooltip>
        }
        disabled={isViewOnly}>
        <span className="cursor-pointer">
          <Icon
            className={`cursor-pointer hover:text-sky-400 ${boardState.drawMode ? "text-sky-400" : ""}`}
            icon={getCurveStyleIcon(boardState.curveStyle)}
            onClick={() => {
              if (boardState.drawMode) changeDrawMode(false);
              else {
                changeDrawMode(true);
                setBoardState((prev) => ({ ...prev, addNodes: false }));
              }
            }}
          />
        </span>
      </Tooltip>
      {/* Export button */}
      <span
        className="pi pi-download saveButton cursor-pointer hover:text-sky-400"
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
        className="pi pi-search searchButton cursor-pointer hover:text-sky-400"
        onClick={() => setDialog({ ...DefaultDialog, type: "node_search", show: true, position: "top" })}
      />

      {/* Reset nodes/edges to the board's default color button */}
      <span
        className="resetColors flex cursor-pointer hover:text-sky-400"
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
        className="editSelectedElements flex cursor-pointer hover:text-sky-400"
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
      <i className="pi pi-fw pi-palette colorPresets cursor-pointer hover:text-sky-400" />
      {/* Color picker square */}
      <div>
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
    </div>
  );
}
