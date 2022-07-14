import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { EdgeUpdateDialogProps } from "../../types/BoardTypes";
import {
  boardEdgeCurveStyles,
  boardEdgeLineStyles,
  boardEdgeTaxiDirections,
  BoardFontSizes,
  edgeTargetArrowShapes,
  BoardFontFamilies,
} from "../../utils/boardUtils";
import { useUpdateEdge } from "../../utils/customHooks";
import { EdgeUpdateDialogDefault } from "../../utils/defaultDisplayValues";

type Props = {
  edgeUpdateDialog: EdgeUpdateDialogProps;
  setEdgeUpdateDialog: Dispatch<SetStateAction<EdgeUpdateDialogProps>>;
};

export default function EdgeUpdateDialog({
  edgeUpdateDialog,
  setEdgeUpdateDialog,
}: Props) {
  const { project_id, board_id } = useParams();

  const updateEdgeMutation = useUpdateEdge(project_id as string);

  return (
    <Dialog
      header={`Update Edge ${edgeUpdateDialog.label || ""}`}
      visible={edgeUpdateDialog.show}
      modal={false}
      position="top-left"
      className="w-24rem"
      onHide={() => setEdgeUpdateDialog(EdgeUpdateDialogDefault)}
    >
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const { show, ...rest } = edgeUpdateDialog;
            updateEdgeMutation.mutate({
              ...rest,
              board_id: board_id as string,
            });
          }
        }}
      >
        {/* Edge Label */}
        <div className="w-full flex flex-wrap">
          <label className="w-full text-sm text-gray-400">
            Edge Curve Type
          </label>

          <InputText
            value={edgeUpdateDialog.label}
            onChange={(e) =>
              setEdgeUpdateDialog((prev) => ({
                ...prev,
                label: e.target.value,
              }))
            }
            placeholder="Edge Label"
            className="w-full"
          />
          <div className="w-full mt-2 flex justify-content-between">
            <div className="w-4">
              <label className="w-full text-sm text-gray-400">
                Font Family
              </label>
              <Dropdown
                className="w-full"
                options={BoardFontFamilies}
                placeholder="Label Fonts"
                value={edgeUpdateDialog.fontFamily}
                onChange={(e) =>
                  setEdgeUpdateDialog((prev) => ({
                    ...prev,
                    fontFamily: e.target.value,
                  }))
                }
              />
            </div>
            <div className="w-3">
              <label className="w-full text-sm text-gray-400">Label Size</label>
              <Dropdown
                className="w-full"
                options={BoardFontSizes}
                placeholder="Label Font Size"
                value={edgeUpdateDialog.fontSize}
                onChange={(e) =>
                  setEdgeUpdateDialog((prev) => ({
                    ...prev,
                    fontSize: e.target.value,
                  }))
                }
              />
            </div>
            <div className="w-4 flex flex-wrap justify-content-between align-items-center">
              <label className="w-full text-sm text-gray-400">
                Label Color
              </label>
              <InputText
                className="w-8"
                value={edgeUpdateDialog.fontColor}
                onChange={(e) =>
                  setEdgeUpdateDialog((prev) => ({
                    ...prev,
                    fontColor: e.target.value,
                  }))
                }
              />
              <ColorPicker
                className="w-min"
                value={edgeUpdateDialog.fontColor}
                onChange={(e) =>
                  setEdgeUpdateDialog((prev) => ({
                    ...prev,
                    fontColor: ("#" +
                      e.value?.toString().replaceAll("#", "")) as string,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Curve Type */}
        <div className="w-full my-2">
          <label className="w-full text-sm text-gray-400">
            Edge Curve Type
          </label>

          <Dropdown
            options={boardEdgeCurveStyles}
            className="w-full"
            placeholder="Curve Type"
            value={edgeUpdateDialog.curveStyle}
            onChange={(e) =>
              setEdgeUpdateDialog((prev) => ({
                ...prev,
                curveStyle: e.value,
              }))
            }
          />
          {edgeUpdateDialog.curveStyle === "unbundled-bezier" && (
            <div className="w-full flex flex-wrap">
              <div className="w-full my-2">
                <label className="w-full text-sm text-gray-400">
                  Curve Strength: {edgeUpdateDialog.controlPointDistances}
                </label>
                <Slider
                  className="w-full mt-2"
                  value={edgeUpdateDialog.controlPointDistances}
                  min={-1000}
                  max={1000}
                  step={10}
                  onChange={(e) =>
                    setEdgeUpdateDialog((prev) => ({
                      ...prev,
                      controlPointDistances: e.value as number,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label className="w-full text-sm text-gray-400">
                  Curve Center: {edgeUpdateDialog.controlPointWeights}
                </label>
                <Slider
                  className="w-full mt-2"
                  value={edgeUpdateDialog.controlPointWeights}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={(e) =>
                    setEdgeUpdateDialog((prev) => ({
                      ...prev,
                      controlPointWeights: e.value as number,
                    }))
                  }
                />
              </div>
            </div>
          )}
          {edgeUpdateDialog.curveStyle === "taxi" && (
            <div className="my-1 flex w-full flex-nowrap justify-content-between">
              <div className="w-6">
                <label className="w-full text-sm text-gray-400">
                  {" "}
                  Edge Direction
                </label>
                <div className="w-full">
                  <Dropdown
                    className="w-full"
                    value={edgeUpdateDialog.taxiDirection}
                    options={boardEdgeTaxiDirections}
                    onChange={(e) =>
                      setEdgeUpdateDialog((prev) => ({
                        ...prev,
                        taxiDirection: e.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="w-5 flex flex-wrap justify-content-end">
                <label className="w-full text-sm text-gray-400 text-right">
                  Break Distance
                </label>
                <InputNumber
                  inputClassName="w-3rem"
                  showButtons
                  value={edgeUpdateDialog.taxiTurn}
                  min={-1000}
                  max={1000}
                  step={5}
                  onChange={(e) =>
                    setEdgeUpdateDialog((prev) => ({
                      ...prev,
                      taxiTurn: e.value as number,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Line style */}
        <div className="w-full my-1">
          <label className="w-full text-sm text-gray-400">Line Style</label>
          <Dropdown
            className="w-full"
            placeholder="Edge Line style"
            value={edgeUpdateDialog.lineStyle}
            onChange={(e) =>
              setEdgeUpdateDialog((prev) => ({
                ...prev,
                lineStyle: e.value,
              }))
            }
            options={boardEdgeLineStyles}
          />
        </div>

        {/* Arrow Shape */}
        <div className="w-full my-1">
          <label className="w-full text-sm text-gray-400">Arrow Shape</label>
          <Dropdown
            className="w-full"
            placeholder="Arrow Shape"
            value={edgeUpdateDialog.targetArrowShape}
            optionLabel="label"
            optionValue="value"
            onChange={(e) =>
              setEdgeUpdateDialog((prev) => ({
                ...prev,
                targetArrowShape: e.value,
              }))
            }
            options={edgeTargetArrowShapes}
          />
        </div>

        {/* Edge Level */}
        <div className="w-full my-2">
          <div className="w-full flex flex-wrap">
            <label className="w-full text-sm text-gray-400">Edge Level</label>
            <span className="w-full text-xs text-gray-400">
              Changes if edge is above or below others
            </span>
          </div>
          <InputNumber
            className="w-8"
            value={edgeUpdateDialog.zIndex}
            onChange={(e) =>
              setEdgeUpdateDialog((prev) => ({
                ...prev,
                zIndex: e.value as number,
              }))
            }
            showButtons
          />
        </div>

        {/* Edge Color */}
        <div className="my-1">
          <label className="w-full text-sm text-gray-400">Edge Color</label>
          <div className="flex align-items-center flex-row-reverse">
            <InputText
              value={edgeUpdateDialog.lineColor}
              className="w-full ml-2"
              onChange={(e) =>
                setEdgeUpdateDialog((prev) => ({
                  ...prev,
                  lineColor: "#" + e.target.value.replaceAll("#", ""),
                }))
              }
            />
            <ColorPicker
              value={edgeUpdateDialog.lineColor}
              onChange={(e) =>
                setEdgeUpdateDialog((prev) => ({
                  ...prev,
                  lineColor: ("#" +
                    e.value?.toString().replaceAll("#", "")) as string,
                }))
              }
            />
          </div>
        </div>
        <div className="w-full flex justify-content-center">
          <Button
            label="Save Edge"
            icon="pi pi-save"
            iconPos="right"
            type="submit"
            className="p-button-outlined p-button-success mt-2"
            onClick={() => {
              const { show, ...rest } = edgeUpdateDialog;
              updateEdgeMutation.mutate({
                ...rest,
                board_id: board_id as string,
              });
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
