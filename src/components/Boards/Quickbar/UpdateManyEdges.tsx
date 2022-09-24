import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { EdgeUpdateDialogType } from "../../../types/BoardTypes";
import {
  boardEdgeCurveStyles,
  boardEdgeLineStyles,
  boardEdgeTaxiDirections,
  edgeTargetArrowShapes,
} from "../../../utils/boardUtils";
import { useUpdateEdge } from "../../../utils/customHooks";
import { EdgeUpdateDialogDefault } from "../../../utils/defaultValues";
import { toastWarn } from "../../../utils/utils";
import { BoardRefsContext } from "../../Context/BoardRefsContext";

export default function UpdateManyEdges() {
  const { project_id, board_id } = useParams();
  const { cyRef } = useContext(BoardRefsContext);
  const [manyEdgesData, setManyEdgesData] = useState<
    Omit<EdgeUpdateDialogType, "id">
  >(EdgeUpdateDialogDefault);
  const updateEdgeMutation = useUpdateEdge(project_id as string);

  const updateManyEdgesFunction = (
    values: { [key: string]: any },
    cyRef: any
  ) => {
    let ids: string[] = cyRef.current
      .edges(":selected")
      .map((node: any) => node.data().id);

    if (ids.length === 0) {
      toastWarn("No elements are selected!");
      return;
    }
    for (const id of ids) {
      updateEdgeMutation.mutate({
        ...values,
        id,
        board_id: board_id as string,
      });
    }
  };

  return (
    <>
      {/* Edge Label */}
      <div className="w-full flex flex-nowrap justify-content-between align-items-end">
        <div className="w-full flex flex-wrap  justify-content-between align-items-end">
          <label className="w-full text-sm text-gray-400">Edge Label</label>

          <InputText
            value={manyEdgesData.label}
            onChange={(e) =>
              setManyEdgesData((prev: Omit<EdgeUpdateDialogType, "id">) => ({
                ...prev,
                label: e.target.value,
              }))
            }
            placeholder="Edge Label"
            className="w-9"
          />
          <Button
            icon="pi pi-save"
            iconPos="right"
            type="submit"
            className="p-button-outlined p-button-success mt-2 w-2"
            onClick={() => {
              updateManyEdgesFunction({ label: manyEdgesData.label }, cyRef);
            }}
          />
        </div>
        {/* <Dropdown
              options={boardNodeFontSizes}
              placeholder="Label Font Size"
              value={value}
              onChange={(e) => onChange(e.value)}
            /> */}
      </div>

      {/* Curve Type */}
      <div className="w-full my-2 flex flex-wrap justify-content-between align-items-end">
        <label className="w-full text-sm text-gray-400">Edge Curve Type</label>

        <Dropdown
          options={boardEdgeCurveStyles}
          className="w-9"
          placeholder="Curve Type"
          value={manyEdgesData.curveStyle}
          onChange={(e) => {
            setManyEdgesData((prev: Omit<EdgeUpdateDialogType, "id">) => ({
              ...prev,
              curveStyle: e.value,
            }));
          }}
        />
        <Button
          icon="pi pi-save"
          iconPos="right"
          type="submit"
          className="p-button-outlined p-button-success mt-2 w-2"
          onClick={() => {
            updateManyEdgesFunction(
              {
                curveStyle: manyEdgesData.curveStyle,
                controlPointDistances: manyEdgesData.controlPointDistances,
                controlPointWeights: manyEdgesData.controlPointWeights,
                taxiDirection: manyEdgesData.taxiDirection,
                taxiTurn: manyEdgesData.taxiTurn,
              },
              cyRef
            );
          }}
        />

        {manyEdgesData.curveStyle === "unbundled-bezier" && (
          <div className="w-full flex flex-wrap">
            <div className="w-full my-2">
              <label className="w-full text-sm text-gray-400">
                Curve Strength: {manyEdgesData.controlPointDistances}
              </label>
              <Slider
                className="w-full mt-2"
                value={manyEdgesData.controlPointDistances}
                min={-1000}
                max={1000}
                step={10}
                onChange={(e) =>
                  setManyEdgesData(
                    (prev: Omit<EdgeUpdateDialogType, "id">) => ({
                      ...prev,
                      controlPointDistances: e.value as number,
                    })
                  )
                }
              />
            </div>
            <div className="w-full">
              <label className="w-full text-sm text-gray-400">
                Curve Center: {manyEdgesData.controlPointWeights}
              </label>
              <Slider
                className="w-full mt-2"
                value={manyEdgesData.controlPointWeights}
                min={0}
                max={1}
                step={0.1}
                onChange={(e) =>
                  setManyEdgesData(
                    (prev: Omit<EdgeUpdateDialogType, "id">) => ({
                      ...prev,
                      controlPointWeights: e.value as number,
                    })
                  )
                }
              />
            </div>
          </div>
        )}
        {manyEdgesData.curveStyle === "taxi" && (
          <div className="my-1 flex w-full flex-nowrap justify-content-between align-items-end">
            <div className="w-5">
              <label className="w-full text-sm text-gray-400">
                {" "}
                Edge Direction
              </label>
              <div className="w-full">
                <Dropdown
                  className="w-full"
                  value={manyEdgesData.taxiDirection}
                  options={boardEdgeTaxiDirections}
                  onChange={(e) => {
                    setManyEdgesData(
                      (prev: Omit<EdgeUpdateDialogType, "id">) => ({
                        ...prev,
                        taxiDirection: e.value,
                      })
                    );
                  }}
                />
              </div>
            </div>
            <div className="w-5 flex flex-wrap justify-content-end">
              <label className="w-full text-sm text-right text-gray-400">
                Break Distance
              </label>
              <InputNumber
                inputClassName="w-3rem"
                showButtons
                value={manyEdgesData.taxiTurn}
                min={-1000}
                max={1000}
                step={5}
                onChange={(e) =>
                  setManyEdgesData(
                    (prev: Omit<EdgeUpdateDialogType, "id">) => ({
                      ...prev,
                      taxiTurn: e.value as number,
                    })
                  )
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Line style */}
      <div className="w-full my-1 flex flex-wrap justify-content-between align-items-end">
        <label className="w-full text-sm text-gray-400">Line Style</label>
        <Dropdown
          className="w-9"
          placeholder="Edge Line style"
          value={manyEdgesData.lineStyle}
          onChange={(e) =>
            setManyEdgesData((prev: Omit<EdgeUpdateDialogType, "id">) => ({
              ...prev,
              lineStyle: e.value,
            }))
          }
          options={boardEdgeLineStyles}
        />
        <Button
          icon="pi pi-save"
          iconPos="right"
          type="submit"
          className="p-button-outlined p-button-success mt-2 w-2"
          onClick={() => {
            updateManyEdgesFunction(
              { lineStyle: manyEdgesData.lineStyle },
              cyRef
            );
          }}
        />
      </div>

      {/* Arrow Shape */}
      <div className="w-full my-1 flex flex-wrap justify-content-between align-items-end">
        <label className="w-full text-sm text-gray-400">Arrow Shape</label>
        <Dropdown
          className="w-9"
          placeholder="Arrow Shape"
          value={manyEdgesData.targetArrowShape}
          optionLabel="label"
          optionValue="value"
          onChange={(e) =>
            setManyEdgesData((prev: Omit<EdgeUpdateDialogType, "id">) => ({
              ...prev,
              targetArrowShape: e.value,
            }))
          }
          options={edgeTargetArrowShapes}
        />
        <Button
          icon="pi pi-save"
          iconPos="right"
          type="submit"
          className="p-button-outlined p-button-success mt-2 w-2"
          onClick={() => {
            updateManyEdgesFunction(
              { targetArrowShape: manyEdgesData.targetArrowShape },
              cyRef
            );
          }}
        />
      </div>

      {/* Edge Level */}
      <div className="w-full my-2 flex flex-wrap justify-content-between align-items-end">
        <div className="w-full flex flex-wrap">
          <label className="w-full text-sm text-gray-400">Edge Level</label>
          <span className="w-full text-xs text-gray-500">
            Changes if edge is above or below others
          </span>
        </div>
        <InputNumber
          className="w-9"
          value={manyEdgesData.zIndex}
          onChange={(e) =>
            setManyEdgesData((prev: Omit<EdgeUpdateDialogType, "id">) => ({
              ...prev,
              zIndex: e.value as number,
            }))
          }
          showButtons
        />
        <Button
          icon="pi pi-save"
          iconPos="right"
          type="submit"
          className="p-button-outlined p-button-success mt-2 w-2"
          onClick={() => {
            updateManyEdgesFunction({ zIndex: manyEdgesData.zIndex }, cyRef);
          }}
        />
      </div>

      {/* Edge Color */}
      <div className="my-1">
        <label className="w-full text-sm text-gray-400">Edge Color</label>
        <div className="flex justify-content-between align-items-end">
          <ColorPicker
            className="w-1"
            value={manyEdgesData.lineColor}
            onChange={(e) =>
              setManyEdgesData((prev: Omit<EdgeUpdateDialogType, "id">) => ({
                ...prev,
                lineColor: ("#" +
                  e.value?.toString().replaceAll("#", "")) as string,
              }))
            }
          />
          <InputText
            value={manyEdgesData.lineColor}
            className="w-8 ml-2"
            onChange={(e) =>
              setManyEdgesData((prev: Omit<EdgeUpdateDialogType, "id">) => ({
                ...prev,
                lineColor: "#" + e.target.value.replaceAll("#", ""),
              }))
            }
          />
          <Button
            icon="pi pi-save"
            iconPos="right"
            type="submit"
            className="p-button-outlined p-button-success mt-2 w-2"
            onClick={() => {
              updateManyEdgesFunction(
                { lineColor: manyEdgesData.lineColor },
                cyRef
              );
            }}
          />
        </div>
      </div>
    </>
  );
}
