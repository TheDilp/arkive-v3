import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useUpdateManySubItems } from "../../../CRUD/ItemsCRUD";
import { EdgeType } from "../../../types/ItemTypes/boardTypes";
import { BoardReferenceAtom } from "../../../utils/Atoms/atoms";
import {
  boardEdgeCaps,
  boardEdgeCurveStyles,
  boardEdgeLineStyles,
  boardEdgeTaxiDirections,
  BoardFontFamilies,
  BoardFontSizes,
} from "../../../utils/boardUtils";
import { DefaultEdge } from "../../../utils/DefaultValues/BoardDefaults";
import { toaster } from "../../../utils/toast";
import { getHexColor } from "../../../utils/transform";
import ColorInput from "../../ColorInput/ColorInput";
import { FontItemTemplate } from "../../Dropdown/FontItemTemplate";
import Tags from "../../Tags/Tags";

export default function DrawerManyEdgesContent() {
  const { item_id } = useParams();
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [localItem, setLocalItem] = useState(DefaultEdge);
  const { mutate: manyEdgesMutation } = useUpdateManySubItems(item_id as string, "edges");

  const updateManyEdges = (value: Partial<EdgeType>) => {
    const edges = boardRef?.edges(":selected");
    if (edges?.length)
      manyEdgesMutation(
        { ids: edges.map((edge) => edge.id()) || [], data: value },
        {
          onSuccess: () => toaster("success", "Edges updated successfully."),
        },
      );
  };
  return (
    <div className="flex w-full flex-col gap-y-2 pt-2">
      <span className="w-full text-center font-Lato text-xl font-bold text-white">Edge Style</span>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-zinc-400">Edge Curve Type</span>
        <Dropdown
          className="w-4/5"
          onChange={(e) => setLocalItem((prev) => ({ ...prev, curveStyle: e.value }))}
          options={boardEdgeCurveStyles}
          value={localItem.curveStyle}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              curveStyle: localItem.curveStyle,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-zinc-400">Line Style</span>
        <Dropdown
          className="w-4/5"
          onChange={(e) => setLocalItem((prev) => ({ ...prev, lineStyle: e.value }))}
          options={boardEdgeLineStyles}
          value={localItem.lineStyle}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              lineStyle: localItem.lineStyle,
            });
          }}
          type="submit"
        />
      </div>
      {localItem.curveStyle === "taxi" ? (
        <>
          <div className="flex w-full flex-wrap justify-between">
            <span className="w-full text-sm text-gray-400">Edge Direction</span>
            <Dropdown
              className="w-4/5"
              onChange={(e) => setLocalItem((prev) => ({ ...prev, taxiDirection: e.value }))}
              options={boardEdgeTaxiDirections}
              value={localItem.taxiDirection}
            />
            <Button
              className="p-button-square p-button-success p-button-outlined"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!boardRef) return;
                updateManyEdges({
                  taxiDirection: localItem.taxiDirection,
                });
              }}
              type="submit"
            />
          </div>
          <div className="flex w-full flex-wrap justify-between">
            <span className="w-full text-sm text-gray-400">Break Distance</span>
            <InputNumber
              className="w-4/5"
              inputClassName="w-full"
              max={1000}
              min={-1000}
              onChange={(e) => setLocalItem((prev) => ({ ...prev, taxiTurn: e.value as number }))}
              showButtons
              step={5}
              value={localItem.taxiTurn}
            />
            <Button
              className="p-button-square p-button-success p-button-outlined"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!boardRef) return;
                updateManyEdges({
                  taxiTurn: localItem.taxiTurn,
                });
              }}
              type="submit"
            />
          </div>
        </>
      ) : null}

      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-zinc-400">Thickness</span>
        <InputNumber
          className="w-4/5"
          inputClassName="w-full"
          max={5000}
          min={1}
          onChange={(e) => setLocalItem((prev) => ({ ...prev, width: e.value as number }))}
          showButtons
          step={1}
          value={localItem.width}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              width: localItem.width,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap items-center justify-between">
        <span className="w-full text-sm text-zinc-400">Edge color</span>
        <div className="w-4/5">
          <ColorInput
            color={localItem.lineColor}
            name="lineColor"
            onChange={(e) => setLocalItem((prev) => ({ ...prev, lineColor: getHexColor(e.value) }))}
          />
        </div>
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              lineColor: localItem.lineColor,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-zinc-400">Line Cap</span>
        <Dropdown
          className="w-4/5"
          onChange={(e) => setLocalItem((prev) => ({ ...prev, lineCap: e.value }))}
          options={boardEdgeCaps}
          value={localItem.lineCap}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              lineStyle: localItem.lineStyle,
            });
          }}
          type="submit"
        />
      </div>

      <hr className="border-zinc-700" />
      <span className="w-full text-center font-Lato text-xl font-bold text-white">Label Style</span>

      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Edge Label</span>
        <InputText
          autoComplete="false"
          className="w-4/5"
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              label: e.target.value,
            }))
          }
          placeholder="Edge Label"
          value={localItem?.label}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined w-1/6"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              label: localItem.label,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="text-sm text-gray-400">Font Family</span>
        <div className="flex w-full justify-between">
          <Dropdown
            className="w-4/5"
            itemTemplate={FontItemTemplate}
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                fontFamily: e.value,
              }))
            }
            options={BoardFontFamilies}
            value={localItem.fontFamily}
            valueTemplate={FontItemTemplate}
          />
          <Button
            className="p-button-square p-button-success p-button-outlined w-1/6"
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              if (!boardRef) return;
              updateManyEdges({
                fontSize: localItem.fontSize,
              });
            }}
            type="submit"
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Label Font Size</span>
        <div className="flex w-full justify-between">
          <Dropdown
            className="w-4/5"
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                fontSize: e.value,
              }))
            }
            options={BoardFontSizes}
            placeholder="Label Font Size"
            value={localItem.fontSize}
          />

          <Button
            className="p-button-square p-button-success p-button-outlined w-1/6"
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              if (!boardRef) return;
              updateManyEdges({
                fontSize: localItem.fontSize,
              });
            }}
            type="submit"
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-zinc-400">Label color</span>
        <div className="w-4/5">
          <ColorInput
            color={localItem.fontColor}
            name="fontColor"
            onChange={(e) => setLocalItem((prev) => ({ ...prev, fontColor: getHexColor(e.value) }))}
          />
        </div>
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              fontColor: localItem.fontColor,
            });
          }}
          type="submit"
        />
      </div>
      <hr className="border-zinc-700" />
      <span className="w-full text-center font-Lato text-xl font-bold text-white">Miscellaneous</span>

      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-zinc-400">Edge opacity</span>
        <InputNumber
          className="w-4/5"
          max={1}
          min={0}
          mode="decimal"
          onChange={(e) => setLocalItem((prev) => ({ ...prev, lineOpacity: e.value as number }))}
          // onKeyDown={handleEnter}
          showButtons
          step={0.01}
          value={localItem.lineOpacity}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              lineOpacity: localItem.lineOpacity,
            });
          }}
          type="submit"
        />
      </div>

      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-zinc-400">Edge level</span>
        <InputNumber
          className="w-4/5"
          onChange={(e) => setLocalItem((prev) => ({ ...prev, zIndex: e.value as number }))}
          //   onKeyDown={handleEnter}
          showButtons
          tooltip="Changes if edge is above or below others"
          tooltipOptions={{ position: "left" }}
          value={localItem.zIndex}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              zIndex: localItem.zIndex,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <div className="w-4/5">
          <Tags
            handleChange={({ value }) => setLocalItem((prev) => ({ ...prev, tags: value }))}
            localItem={localItem}
            type="edges"
          />
        </div>
        <Button
          className="p-button-square p-button-success p-button-outlined"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyEdges({
              tags: localItem.tags,
            });
          }}
          type="submit"
        />
      </div>
    </div>
  );
}
