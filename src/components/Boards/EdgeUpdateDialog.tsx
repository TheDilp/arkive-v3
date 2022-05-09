import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { edgeUpdateDialogProps, UpdateEdgeInputs } from "../../custom-types";
import { useUpdateEdge } from "../../utils/customHooks";
import { boardEdgeCurveStyles, boardEdgeLineStyles } from "../../utils/utils";

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
    control,
    watch,
    formState: { errors },
  } = useForm<UpdateEdgeInputs>({
    defaultValues: {
      label: edgeUpdateDialog.label,
      curveStyle: edgeUpdateDialog.curveStyle,
      lineStyle: edgeUpdateDialog.lineStyle,
      lineColor: edgeUpdateDialog.lineColor.replace("#", ""),
    },
  });
  const onSubmit: SubmitHandler<UpdateEdgeInputs> = (data) => {
    updateEdgeMutation.mutate({
      id: edgeUpdateDialog.id,
      board_id: board_id as string,
      ...data,
      lineColor: `#${data.lineColor}`,
    });
  };

  const updateEdgeMutation = useUpdateEdge(project_id as string);
  return (
    <Dialog
      header={`Update Edge ${edgeUpdateDialog.label || ""}`}
      visible={edgeUpdateDialog.show}
      modal={false}
      onHide={() =>
        setEdgeUpdateDialog({
          id: "",
          label: "",
          curveStyle: "",
          lineStyle: "",
          lineColor: "",
          controlPointDistances: 0,
          controlPointWeights: 0,
          show: false,
        })
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-nowrap">
          <InputText {...register("label")} placeholder="Node Label" />
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
        </div>
        <Controller
          control={control}
          name="lineStyle"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              className="w-full"
              placeholder="Line style"
              value={value}
              filter
              emptyFilterMessage="No documents found"
              onChange={(e) => onChange(e.value)}
              options={boardEdgeLineStyles}
            />
          )}
        />

        <div className="my-3">
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
