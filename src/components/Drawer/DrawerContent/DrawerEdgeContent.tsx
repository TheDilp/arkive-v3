import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { KeyboardEventHandler, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { EdgeType } from "../../../types/boardTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import {
  boardEdgeArrowShapes,
  boardEdgeCaps,
  boardEdgeCurveStyles,
  BoardFontFamilies,
  BoardFontSizes,
} from "../../../utils/boardUtils";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";

function FontItemTemplate(item: { label: string; value: string }) {
  const { value, label } = item;
  return <div style={{ fontFamily: value }}>{label}</div>;
}

export default function DrawerEdgeContent() {
  const { item_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const updateEdgeMutaiton = useUpdateSubItem(item_id as string, "edges", "boards");
  const [localItem, setLocalItem] = useState<EdgeType | undefined>(drawer?.data as EdgeType);
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const handleEnter: KeyboardEventHandler = (e: any) => {
    if (e.key === "Enter" && localItem) updateEdgeMutaiton.mutate({ id: localItem.id, ...changedData });
  };

  useEffect(() => {
    if (drawer?.data) setLocalItem(drawer?.data as EdgeType);
  }, [drawer?.data]);
  if (!localItem) {
    setDrawer(DefaultDrawer);
    return null;
  }
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex w-full flex-col">
        <div className="my-1 flex w-full flex-wrap">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-1 gap-y-2">
            {/* Label text */}

            <div className="flex w-full flex-wrap">
              <span className="w-full text-sm text-zinc-400">Edge label</span>

              <InputText
                autoComplete="false"
                className="w-full"
                onChange={(e) => handleChange({ name: "label", value: e.target.value })}
                onKeyDown={handleEnter}
                placeholder="Edge Label"
                value={localItem.label}
              />
            </div>

            {/* Label font & size */}

            <div className="flex w-full flex-nowrap gap-x-1">
              <div className="flex w-1/2 flex-col">
                <span className="w-full text-sm text-zinc-400">Label Font</span>
                <Dropdown
                  className="w-full"
                  itemTemplate={FontItemTemplate}
                  onChange={(e) => handleChange({ name: "label", value: e.target.value })}
                  options={BoardFontFamilies}
                  value={localItem.fontFamily}
                  valueTemplate={FontItemTemplate}
                />
              </div>

              <div className="flex w-1/2 flex-col">
                <span className="w-full text-sm text-zinc-400">Label size</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => handleChange({ name: "fontSize", value: e.target.value })}
                  options={BoardFontSizes}
                  placeholder="Label Font Size"
                  value={localItem.fontSize}
                />
              </div>
            </div>

            {/* Label color */}
            <div className="flex w-full flex-wrap items-center justify-between">
              <span className="w-full text-sm text-zinc-400">Label color</span>
              <ColorPicker
                onChange={(e) => handleChange({ name: "fontColor", value: `#${e.value}` })}
                value={localItem.fontColor}
              />
              <InputText
                onChange={(e) => handleChange({ name: "fontColor", value: `#${e.target.value}` })}
                value={localItem.fontColor}
              />
            </div>

            {/* Line, Curve style */}
            <div className="flex w-full flex-nowrap gap-x-1">
              <div className="w-full">
                <span className="w-full text-sm text-zinc-400">Edge Curve Type</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => handleChange({ name: "curveStyle", value: e.value })}
                  options={boardEdgeCurveStyles}
                  value={localItem.curveStyle}
                />
              </div>
              <div className="w-full">
                <span className="w-full text-sm text-zinc-400">Line Style</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => handleChange({ name: "lineStyle", value: e.value })}
                  options={boardEdgeCurveStyles}
                  value={localItem.curveStyle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="flex gap-x-1 gap-y-2">
            <div className="flex w-full flex-wrap">
              <span className="w-full text-sm text-zinc-400">Thickness</span>
              <InputNumber
                className="w-full"
                inputClassName="w-full"
                max={5000}
                min={10}
                onChange={(e) => handleChange({ name: "width", value: e.value })}
                onKeyDown={handleEnter}
                showButtons
                step={10}
                value={localItem.width}
              />
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between">
            <span className="w-full text-sm text-zinc-400">Edge color</span>
            <ColorPicker
              onChange={(e) => handleChange({ name: "lineColor", value: `#${e.value}` })}
              value={localItem.lineColor}
            />
            <InputText
              prefix="#"
              onChange={(e) => handleChange({ name: "lineColor", value: `${e.target.value}` })}
              value={localItem.lineColor}
            />
          </div>
          <div className="w-full">
            <span className="pl-1">
              <span className="w-full text-sm text-zinc-400">Edge opacity</span>
            </span>
            <div className="flex flex-row-reverse items-center">
              <InputNumber
                className="ml-1 w-full"
                max={1}
                min={0}
                mode="decimal"
                onChange={(e) => handleChange({ name: "lineOpacity", value: e.value })}
                onKeyDown={handleEnter}
                showButtons
                step={0.01}
                value={localItem.lineOpacity}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="w-full">
              <span className="w-full text-sm text-zinc-400">Line Style</span>
              <Dropdown
                className="w-full"
                onChange={(e) => handleChange({ name: "lineCap", value: e.value })}
                options={boardEdgeCaps}
                value={localItem.lineCap}
              />
            </div>
          </div>

          <div className="mb-2 w-full">
            <span className="w-full text-sm text-zinc-400">Edge level</span>
            <InputNumber
              className="w-full"
              onChange={(e) => handleChange({ name: "zIndex", value: e.value })}
              onKeyDown={handleEnter}
              showButtons
              tooltip="Changes if node is above or below others"
              tooltipOptions={{ position: "left" }}
              value={localItem.zIndex}
            />
          </div>
        </div>
        <hr />
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-nowrap gap-x-1">
            <div className="w-1/2">
              <span className="w-full text-sm text-zinc-400">Source Arrow</span>
              <Dropdown
                className="w-full"
                filter
                onChange={(e) => handleChange({ name: "sourceArrowShape", value: e.value })}
                options={boardEdgeArrowShapes}
                placeholder="Node Shape"
                value={localItem.sourceArrowShape}
              />
            </div>
            <div className="w-1/2">
              <span className="w-full text-sm text-zinc-400">Target Arrow</span>
              <Dropdown
                className="w-full"
                filter
                onChange={(e) => handleChange({ name: "targetArrowShape", value: e.value })}
                options={boardEdgeArrowShapes}
                placeholder="Node Shape"
                value={localItem.targetArrowShape}
              />
            </div>
          </div>
          <div className="flex w-full flex-nowrap gap-x-1">
            <div className="w-1/2">
              <span className="w-full  text-sm text-zinc-400">Mid Source Arrow</span>
              <Dropdown
                className="w-full"
                filter
                onChange={(e) => handleChange({ name: "midSourceArrowShape", value: e.value })}
                options={boardEdgeArrowShapes}
                placeholder="Node Shape"
                value={localItem.midSourceArrowShape}
              />
            </div>
            <div className="w-1/2">
              <span className="w-full text-sm text-zinc-400">Mid Target Arrow</span>
              <Dropdown
                className="w-full"
                filter
                onChange={(e) => handleChange({ name: "midTargetArrowShape", value: e.value })}
                options={boardEdgeArrowShapes}
                placeholder="Node Shape"
                value={localItem.midTargetArrowShape}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="justify-content-end flex w-full">
        <Button
          className="p-button-outlined p-button-success"
          icon="pi pi-save"
          iconPos="right"
          label="Save Edge"
          onClick={() => {
            updateEdgeMutaiton.mutate({ id: localItem.id, ...changedData }, { onSuccess: resetChanges });
          }}
          type="submit"
        />
      </div>
    </div>
  );
}
