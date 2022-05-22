import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Slider } from "primereact/slider";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { edgeUpdateDialogProps, UpdateEdgeInputs } from "../../custom-types";
import { useUpdateEdge } from "../../utils/customHooks";
import {
  boardEdgeCurveStyles,
  boardEdgeLineStyles,
  boardEdgeTaxiDirections,
  edgeTargetArrowShapes,
} from "../../utils/utils";
import { useEffect } from "react";

type Props = {
  edgeUpdateDialog: edgeUpdateDialogProps;
  setEdgeUpdateDialog: (edgeUpdateDialog: edgeUpdateDialogProps) => void;
};

export default function EdgeUpdateDialog({
  edgeUpdateDialog,
  setEdgeUpdateDialog,
}: Props) {
  const { project_id, board_id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<UpdateEdgeInputs>({
    defaultValues: {
      label: edgeUpdateDialog.label,
      curveStyle: edgeUpdateDialog.curveStyle,
      lineStyle: edgeUpdateDialog.lineStyle,
      lineColor: edgeUpdateDialog.lineColor.replace("#", ""),
      controlPointDistances: edgeUpdateDialog.controlPointDistances,
      controlPointWeights: edgeUpdateDialog.controlPointWeights,
      taxiDirection: edgeUpdateDialog.taxiDirection,
      taxiTurn: edgeUpdateDialog.taxiTurn,
      targetArrowShape: edgeUpdateDialog.targetArrowShape,
      zIndex: edgeUpdateDialog.zIndex,
    },
  });
  const onSubmit: SubmitHandler<UpdateEdgeInputs> = (data) => {
    updateEdgeMutation.mutate({
      id: edgeUpdateDialog.id,
      board_id: board_id as string,
      ...data,
      lineColor: `#${data.lineColor.replace("#", "")}`,
    });
  };

  const updateEdgeMutation = useUpdateEdge(project_id as string);

  useEffect(() => {
    Object.entries(edgeUpdateDialog).forEach(([key, value]) => {
      if (key === "backgroundColor" && typeof value === "string") {
        setValue(key as any, value.replace("#", ""));
      } else if (key === "show") {
        //
      } else {
        setValue(key as any, value);
      }
    });
  }, [edgeUpdateDialog]);

  return (
    <Dialog
      header={`Update Edge ${edgeUpdateDialog.label || ""}`}
      visible={edgeUpdateDialog.show}
      modal={false}
      position="top-left"
      onHide={() =>
        setEdgeUpdateDialog({
          id: "",
          label: "",
          curveStyle: "",
          lineStyle: "",
          lineColor: "",
          controlPointDistances: 0,
          controlPointWeights: 0,
          taxiDirection: "",
          taxiTurn: 0,
          targetArrowShape: "",
          zIndex: 1,
          show: false,
        })
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-nowrap">
          <InputText
            {...register("label")}
            placeholder="Edge Label"
            className="w-full"
          />
          {/* <Controller
            control={control}
            name="fontSize"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                options={boardNodeFontSizes}
                placeholder="Label Font Size"
                value={value}
                onChange={(e) => onChange(e.value)}
              />
            )}
          /> */}
        </div>
        <div className="w-full my-2">
          <label className="w-full text-sm">Edge Curve Type</label>
          <Controller
            control={control}
            name="curveStyle"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                options={boardEdgeCurveStyles}
                className="w-full"
                placeholder="Curve Type"
                value={value}
                onChange={(e) => onChange(e.value)}
              />
            )}
          />
          {watch("curveStyle") === "unbundled-bezier" && (
            <div>
              <Controller
                control={control}
                name={"controlPointDistances"}
                render={({ field: { onChange, value } }) => (
                  <div className="my-2">
                    <div className="my-2">
                      Curve Strength: {watch("controlPointDistances")}
                    </div>
                    <Slider
                      value={value}
                      min={-1000}
                      max={1000}
                      step={10}
                      onChange={(e) => onChange(e.value)}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name={"controlPointWeights"}
                render={({ field: { onChange, value } }) => (
                  <div className="my-2">
                    <div className="my-2">
                      Curve Center: {watch("controlPointWeights")}
                    </div>
                    <Slider
                      value={value}
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={(e) => onChange(e.value)}
                    />
                  </div>
                )}
              />
            </div>
          )}
          {watch("curveStyle") === "taxi" && (
            <div className="my-1 flex flex-nowrap">
              <div className="w-4">
                <label className="w-full text-sm">Taxi Edge Direction</label>
                <Controller
                  control={control}
                  name={"taxiDirection"}
                  render={({ field: { onChange, value } }) => (
                    <div className="w-4">
                      <Dropdown
                        value={value}
                        options={boardEdgeTaxiDirections}
                        min={-1000}
                        max={1000}
                        step={10}
                        onChange={(e) => onChange(e.value)}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="w-8">
                <Controller
                  control={control}
                  name={"taxiTurn"}
                  render={({ field: { onChange, value } }) => (
                    <div className="">
                      <label className="w-full text-sm">
                        Edge Turn: {watch("taxiTurn")}
                      </label>

                      <InputNumber
                        className="w-full"
                        showButtons
                        value={value}
                        min={-1000}
                        max={1000}
                        step={5}
                        onChange={(e) => onChange(e.value)}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-full my-1">
          <label className="w-full text-sm">Line Style</label>
          <Controller
            control={control}
            name="lineStyle"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                className="w-full"
                placeholder="Edge Line style"
                value={value}
                emptyFilterMessage="No documents found"
                onChange={(e) => onChange(e.value)}
                options={boardEdgeLineStyles}
              />
            )}
          />
        </div>
        <div className="w-full my-1">
          <label className="w-full text-sm">Arrow Shape</label>
          <Controller
            control={control}
            name="targetArrowShape"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                className="w-full"
                placeholder="Arrow Shape"
                value={value}
                optionLabel="label"
                optionValue="value"
                emptyFilterMessage="No documents found"
                onChange={(e) => onChange(e.value)}
                options={edgeTargetArrowShapes}
              />
            )}
          />
        </div>
        <div className="w-full my-2">
          <div className="w-full flex flex-wrap">
            <label className="w-full text-sm">Edge Level</label>
            <span className="w-full text-xs">
              Changes if edge is above or below others
            </span>
          </div>
          <Controller
            control={control}
            name="zIndex"
            render={({ field: { onChange, value } }) => (
              <InputNumber
                className="w-8"
                value={value}
                onChange={(e) => onChange(e.value)}
                showButtons
              />
            )}
          />
        </div>

        <div className="my-1">
          <label className="w-full text-sm">Edge Color</label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            name="lineColor"
            render={({ field: { onChange, value } }) => (
              <div className="flex align-items-center flex-row-reverse">
                <InputText
                  value={value.replace("#", "")}
                  className="w-full ml-2"
                  onChange={onChange}
                />
                <ColorPicker
                  value={value.replace("#", "")}
                  onChange={onChange}
                />
              </div>
            )}
          />
        </div>
        <Button label="Save Edge" type="submit" />
      </form>
    </Dialog>
  );
}
