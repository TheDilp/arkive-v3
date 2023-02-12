import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { TabPanel, TabView } from "primereact/tabview";
import { KeyboardEventHandler, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { capitalCase } from "remirror";

import { useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { BoardType, EdgeType } from "../../../types/ItemTypes/boardTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import {
  boardEdgeCaps,
  boardEdgeCurveStyles,
  boardEdgeLineStyles,
  boardEdgeTaxiDirections,
  BoardFontFamilies,
  BoardFontSizes,
  edgeArrowTypes,
} from "../../../utils/boardUtils";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../../utils/toast";
import { getHexColor } from "../../../utils/transform";
import ColorInput from "../../ColorInput/ColorInput";
import Tags from "../../Tags/Tags";
import EdgeArrowSection from "../EdgeArrowSection";

function FontItemTemplate(item: { label: string; value: string }) {
  const { value, label } = item;
  return <div style={{ fontFamily: value }}>{label}</div>;
}

export default function DrawerEdgeContent() {
  const { item_id } = useParams();
  const queryClient = useQueryClient();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const updateEdgeMutation = useUpdateSubItem(item_id as string, "edges", "boards");
  const [localItem, setLocalItem] = useState<EdgeType | undefined>(drawer?.data as EdgeType);
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const handleEnter: KeyboardEventHandler = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tags, ...rest } = changedData;
    if (e.key === "Enter" && localItem) updateEdgeMutation.mutate({ id: localItem.id, ...rest });
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
      <div className="flex w-full flex-1 flex-col overflow-y-auto">
        <h2 className="text-center font-Lato text-2xl font-medium">{localItem?.label}</h2>
        <TabView renderActiveOnly>
          <TabPanel header="Edge">
            <div className="flex w-full flex-col gap-y-3 pt-3">
              <span className="w-full text-center font-Lato text-xl font-bold text-white">Edge Style</span>

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
                    options={boardEdgeLineStyles}
                    value={localItem.lineStyle}
                  />
                </div>
              </div>

              {localItem.curveStyle === "unbundled-bezier" && (
                <div className="flex w-full flex-wrap">
                  <div className="w-full px-3">
                    <span className="w-full text-sm text-gray-400">Curve Strength: {localItem.controlPointDistances}</span>
                    <Slider
                      className="mt-2 w-full"
                      max={1000}
                      min={-1000}
                      onChange={(e) => handleChange({ name: "controlPointDistances", value: e.value })}
                      step={10}
                      value={localItem.controlPointDistances}
                    />
                  </div>
                  <div className="w-full px-3">
                    <span className="w-full text-sm text-gray-400">Curve Center: {localItem.controlPointWeights}</span>
                    <Slider
                      className="mt-2 w-full"
                      max={1}
                      min={0}
                      onChange={(e) => handleChange({ name: "controlPointWeights", value: e.value })}
                      step={0.1}
                      value={localItem.controlPointWeights}
                    />
                  </div>
                </div>
              )}

              {localItem.curveStyle === "taxi" && (
                <div className="flex w-full flex-nowrap items-center gap-x-1">
                  <div className="w-1/2">
                    <span className="w-full text-sm text-gray-400"> Edge Direction</span>
                    <div className="w-full">
                      <Dropdown
                        className="w-full"
                        onChange={(e) => handleChange({ name: "taxiDirection", value: e.value })}
                        options={boardEdgeTaxiDirections}
                        value={localItem.taxiDirection}
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <span className="w-full text-right text-sm text-gray-400">Break Distance</span>
                    <InputNumber
                      className="w-full"
                      inputClassName="w-full"
                      max={1000}
                      min={-1000}
                      onChange={(e) => handleChange({ name: "taxiTurn", value: e.value })}
                      onKeyDown={handleEnter}
                      showButtons
                      step={5}
                      value={localItem.taxiTurn}
                    />
                  </div>
                </div>
              )}
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

              <hr className="border-zinc-700" />
              <span className="w-full text-center font-Lato text-xl font-bold text-white">Label Style</span>

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

              <hr className="border-zinc-700" />
              <span className="w-full text-center font-Lato text-xl font-bold text-white">Miscellaneous</span>

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
            <div className="flex w-full flex-col gap-x-1 gap-y-2 font-Lato">
              {edgeArrowTypes.map((type) => (
                <EdgeArrowSection
                  key={type}
                  // @ts-ignore
                  arrowColor={localItem[`${type}ArrowColor`]}
                  // @ts-ignore
                  arrowFill={localItem[`${type}ArrowFill`]}
                  arrowName={type}
                  // @ts-ignore
                  arrowShape={localItem[`${type}ArrowShape`]}
                  handleChange={handleChange}
                  title={capitalCase(type)}
                />
              ))}
            </div>
          </TabPanel>
        </TabView>
      </div>
      <div className="justify-content-end flex w-full">
        <Button
          className="p-button-outlined p-button-success w-full"
          disabled={updateEdgeMutation.isPaused}
          icon="pi pi-save"
          iconPos="right"
          label="Save Edge"
          loading={updateEdgeMutation.isLoading}
          onClick={() => {
            if (changedData) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { tags, ...rest } = changedData;
              updateEdgeMutation.mutate(
                { id: localItem.id, ...rest },
                {
                  onSuccess: () => {
                    toaster("success", `Edge ${localItem?.label || ""} was successfully updated.`);
                    resetChanges();
                    if (tags)
                      queryClient.setQueryData(["boards", item_id], (oldData: BoardType | undefined) => {
                        if (oldData)
                          return {
                            ...oldData,
                            edges: oldData?.edges.map((edge) => {
                              if (edge.id === localItem.id) {
                                return { ...edge, tags };
                              }
                              return edge;
                            }),
                          };
                        return oldData;
                      });
                  },
                },
              );
            } else {
              toaster("info", "No data was changed.");
            }
          }}
          type="submit"
        />
      </div>
    </div>
  );
}
