import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { EdgeUpdateDialogProps } from "../../custom-types";
import {
  boardEdgeCurveStyles,
  boardEdgeLineStyles,
  boardEdgeTaxiDirections,
  edgeTargetArrowShapes
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
      onHide={() => setEdgeUpdateDialog(EdgeUpdateDialogDefault)}
    >
      <div className="w-full flex flex-nowrap">
        <InputText
          value={edgeUpdateDialog.label}
          onChange={(e) =>
            setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
              ...prev,
              label: e.target.value,
            }))
          }
          placeholder="Edge Label"
          className="w-full"
        />
        {/* <Dropdown
              options={boardNodeFontSizes}
              placeholder="Label Font Size"
              value={value}
              onChange={(e) => onChange(e.value)}
            /> */}
      </div>
      <div className="w-full my-2">
        <label className="w-full text-sm">Edge Curve Type</label>

        <Dropdown
          options={boardEdgeCurveStyles}
          className="w-full"
          placeholder="Curve Type"
          value={edgeUpdateDialog.curveStyle}
          onChange={(e) =>
            setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
              ...prev,
              curveStyle: e.value,
            }))
          }
        />
        <div>
          <Slider
            value={edgeUpdateDialog.controlPointDistances}
            min={-1000}
            max={1000}
            step={10}
            onChange={(e) =>
              setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
                ...prev,
                controlPointDistances: e.value as number,
              }))
            }
          />
          <Slider
            value={edgeUpdateDialog.controlPointWeights}
            min={0}
            max={1}
            step={0.1}
            onChange={(e) =>
              setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
                ...prev,
                controlPointWeights: e.value as number,
              }))
            }
          />
        </div>
        <div className="my-1 flex flex-nowrap">
          <div className="w-4">
            <label className="w-full text-sm">Taxi Edge Direction</label>
            <div className="w-4">
              <Dropdown
                value={edgeUpdateDialog.taxiDirection}
                options={boardEdgeTaxiDirections}
                onChange={(e) =>
                  setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
                    ...prev,
                    taxiDirection: e.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="w-8">
            <InputNumber
              className="w-full"
              showButtons
              value={edgeUpdateDialog.taxiTurn}
              min={-1000}
              max={1000}
              step={5}
              onChange={(e) =>
                setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
                  ...prev,
                  taxiTurn: e.value as number,
                }))
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full my-1">
        <label className="w-full text-sm">Line Style</label>
        <Dropdown
          className="w-full"
          placeholder="Edge Line style"
          value={edgeUpdateDialog.lineStyle}
          onChange={(e) =>
            setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
              ...prev,
              lineStyle: e.value,
            }))
          }
          options={boardEdgeLineStyles}
        />
      </div>
      <div className="w-full my-1">
        <label className="w-full text-sm">Arrow Shape</label>
        <Dropdown
          className="w-full"
          placeholder="Arrow Shape"
          value={edgeUpdateDialog.targetArrowShape}
          optionLabel="label"
          optionValue="value"
          onChange={(e) =>
            setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
              ...prev,
              targetArrowShape: e.value,
            }))
          }
          options={edgeTargetArrowShapes}
        />
      </div>
      <div className="w-full my-2">
        <div className="w-full flex flex-wrap">
          <label className="w-full text-sm">Edge Level</label>
          <span className="w-full text-xs">
            Changes if edge is above or below others
          </span>
        </div>
        <InputNumber
          className="w-8"
          value={edgeUpdateDialog.zIndex}
          onChange={(e) =>
            setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
              ...prev,
              zIndex: e.value as number,
            }))
          }
          showButtons
        />
      </div>

      <div className="my-1">
        <label className="w-full text-sm">Edge Color</label>
        <div className="flex align-items-center flex-row-reverse">
          <InputText
            value={edgeUpdateDialog.lineColor}
            className="w-full ml-2"
            onChange={(e) =>
              setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
                ...prev,
                lineColor: "#" + e.target.value.replaceAll("#", ""),
              }))
            }
          />
          <ColorPicker
            value={edgeUpdateDialog.lineColor}
            onChange={(e) =>
              setEdgeUpdateDialog((prev: EdgeUpdateDialogProps) => ({
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
        />
      </div>
    </Dialog>
  );
}
