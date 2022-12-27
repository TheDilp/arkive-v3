import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
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
import { toaster } from "../../../utils/toast";
import { getHexColor } from "../../../utils/transform";
import ColorInput from "../../ColorInput/ColorInput";
import Tags from "../../Tags/Tags";

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
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      <div className="flex w-full flex-col">
        <TabView renderActiveOnly>
          <TabPanel header="Edge">
            <div className="flex w-full flex-col gap-y-3">
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
              <div className="w-full">
                <span className="w-full text-sm text-zinc-400">Line Cap</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => handleChange({ name: "lineCap", value: e.value })}
                  options={boardEdgeCaps}
                  value={localItem.lineCap}
                />
              </div>
              <div className="flex w-full flex-wrap">
                <span className="w-full text-sm text-zinc-400">Thickness</span>
                <InputNumber
                  className="w-full"
                  inputClassName="w-full"
                  max={5000}
                  min={1}
                  onChange={(e) => handleChange({ name: "width", value: e.value })}
                  onKeyDown={handleEnter}
                  showButtons
                  step={1}
                  value={localItem.width}
                />
              </div>
              <div className="flex w-full flex-wrap items-center justify-between">
                <span className="w-full text-sm text-zinc-400">Edge color</span>
                <ColorInput
                  color={localItem.lineColor}
                  name="lineColor"
                  onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
                />
              </div>
              <hr />

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
                <ColorInput
                  color={localItem.fontColor}
                  name="fontColor"
                  onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
                />
              </div>

              <hr />

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
              <div className="mb-2 w-full">
                <Tags handleChange={handleChange} localItem={localItem} type="edges" />
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Arrows">
            <div className="flex w-full flex-col">
              <div className="flex w-full flex-col gap-x-1 gap-y-4 font-Lato">
                <span className="w-full text-lg text-white">Target Arrow</span>
                <div className="w-full">
                  <span className="w-full text-sm text-zinc-400">Shape & Fill</span>
                  <div className="flex items-center justify-between">
                    <Dropdown
                      className="w-2/3"
                      filter
                      onChange={(e) => handleChange({ name: "targetArrowShape", value: e.value })}
                      options={boardEdgeArrowShapes}
                      placeholder="Node Shape"
                      value={localItem.targetArrowShape}
                    />
                    <InputSwitch
                      checked={localItem.targetArrowFill}
                      falseValue="hollow"
                      onChange={(e) => handleChange({ name: "targetArrowFill", value: e.value })}
                      tooltip="Makes the arrow filled or hollow"
                      tooltipOptions={{
                        showDelay: 500,
                        position: "left",
                      }}
                      trueValue="filled"
                    />
                  </div>
                  <div className="flex w-full flex-wrap items-center justify-between">
                    <span className="w-full text-sm text-zinc-400">Arrow Color</span>
                    <ColorInput
                      color={localItem.targetArrowColor}
                      name="targetArrowColor"
                      onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
                    />
                  </div>
                  <hr className="mt-1" />
                </div>
                <span className="w-full text-lg text-white">Source Arrow</span>
                <div className="w-full">
                  <span className="w-full text-sm text-zinc-400">Shape & Fill</span>
                  <div className="flex items-center justify-between">
                    <Dropdown
                      className="w-2/3"
                      filter
                      onChange={(e) => handleChange({ name: "sourceArrowShape", value: e.value })}
                      options={boardEdgeArrowShapes}
                      value={localItem.sourceArrowShape}
                    />
                    <InputSwitch
                      checked={localItem.sourceArrowFill}
                      falseValue="hollow"
                      onChange={(e) => handleChange({ name: "sourceArrowFill", value: e.value })}
                      tooltip="Makes the arrow filled or hollow"
                      tooltipOptions={{
                        showDelay: 500,
                        position: "left",
                      }}
                      trueValue="filled"
                    />
                  </div>
                  <div className="flex w-full flex-wrap items-center justify-between">
                    <span className="w-full text-sm text-zinc-400">Arrow Color</span>
                    <ColorInput
                      color={localItem.sourceArrowColor}
                      name="sourceArrowColor"
                      onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
                    />
                  </div>
                  <hr className="mt-1" />
                </div>

                <span className="w-full text-lg text-white">Mid Target Arrow</span>
                <div className="w-full">
                  <span className="w-full text-sm text-zinc-400">Shape & Fill</span>
                  <div className="flex items-center justify-between">
                    <Dropdown
                      className="w-2/3"
                      filter
                      onChange={(e) => handleChange({ name: "midTargetArrowShape", value: e.value })}
                      options={boardEdgeArrowShapes}
                      placeholder="Node Shape"
                      value={localItem.midTargetArrowShape}
                    />
                    <InputSwitch
                      checked={localItem.midTargetArrowFill}
                      falseValue="hollow"
                      onChange={(e) => handleChange({ name: "midTargetArrowFill", value: e.value })}
                      tooltip="Makes the arrow filled or hollow"
                      tooltipOptions={{
                        showDelay: 500,
                        position: "left",
                      }}
                      trueValue="filled"
                    />
                  </div>
                  <div className="flex w-full flex-wrap items-center justify-between">
                    <span className="w-full text-sm text-zinc-400">Arrow Color</span>
                    <ColorInput
                      color={localItem.midTargetArrowColor}
                      name="midTargetArrowColor"
                      onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
                    />
                  </div>
                  <hr className="mt-1" />
                </div>
                <span className="w-full text-lg text-white">Mid Source Arrow</span>

                <div className="w-full">
                  <span className="w-full text-sm text-zinc-400"> Shape & Fill</span>
                  <div className="flex items-center justify-between">
                    <Dropdown
                      className="w-2/3"
                      filter
                      onChange={(e) => handleChange({ name: "midSourceArrowShape", value: e.value })}
                      options={boardEdgeArrowShapes}
                      placeholder="Node Shape"
                      value={localItem.midSourceArrowShape}
                    />
                    <InputSwitch
                      checked={localItem.midSourceArrowFill}
                      falseValue="hollow"
                      onChange={(e) => handleChange({ name: "midSourceArrowFill", value: e.value })}
                      tooltip="Makes the arrow filled or hollow"
                      tooltipOptions={{
                        showDelay: 500,
                        position: "left",
                      }}
                      trueValue="filled"
                    />
                  </div>
                  <div className="flex w-full flex-wrap items-center justify-between">
                    <span className="w-full text-sm text-zinc-400">Arrow Color</span>
                    <ColorInput
                      color={localItem.midSourceArrowColor}
                      name="midSourceArrowColor"
                      onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
      <div className="justify-content-end flex w-full">
        <Button
          className="p-button-outlined p-button-success w-full"
          icon="pi pi-save"
          iconPos="right"
          label="Save Edge"
          onClick={() => {
            updateEdgeMutaiton.mutate(
              { id: localItem.id, ...changedData },
              {
                onSuccess: () => {
                  toaster("success", `Edge ${localItem?.label || ""} was successfully updated.`);
                  resetChanges();
                },
              },
            );
          }}
          type="submit"
        />
      </div>
    </div>
  );
}
