import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { nodeUpdateDialogProps, UpdateNodeInputs } from "../../custom-types";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useGetDocuments, useUpdateNode } from "../../utils/customHooks";
import { useParams } from "react-router-dom";
import { boardNodeFontSizes, boardNodeShapes } from "../../utils/utils";
import { Slider } from "primereact/slider";
import { ColorPicker } from "primereact/colorpicker";

type Props = {
  nodeUpdateDialog: nodeUpdateDialogProps;
  setNodeUpdateDialog: (nodeUpdateDialog: nodeUpdateDialogProps) => void;
};

export default function NodeUpdateDialog({
  nodeUpdateDialog,
  setNodeUpdateDialog,
}: Props) {
  const { project_id, board_id } = useParams();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<UpdateNodeInputs>({
    defaultValues: {
      label: nodeUpdateDialog.label,
      type: nodeUpdateDialog.type,
      doc_id: nodeUpdateDialog.doc_id,
      width: nodeUpdateDialog.width,
      height: nodeUpdateDialog.height,
      fontSize: nodeUpdateDialog.fontSize,
      backgroundColor: nodeUpdateDialog.backgroundColor.replace("#", ""),
      customImage: nodeUpdateDialog.customImage,
    },
  });
  const onSubmit: SubmitHandler<UpdateNodeInputs> = (data) => {
    updateNodeMutation.mutate({
      id: nodeUpdateDialog.id,
      board_id: board_id as string,
      ...data,
      backgroundColor: `#${data.backgroundColor}`,
    });
  };
  const documents = useGetDocuments(project_id as string);
  const updateNodeMutation = useUpdateNode(project_id as string);
  return (
    <Dialog
      header={`Update Node ${nodeUpdateDialog.label || ""}`}
      visible={nodeUpdateDialog.show}
      modal={false}
      onHide={() =>
        setNodeUpdateDialog({
          id: "",
          label: "",
          type: "",
          doc_id: undefined,
          width: 0,
          height: 0,
          fontSize: 0,
          backgroundColor: "",
          customImage: "",
          show: false,
        })
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-nowrap">
          <div className="w-full flex flex-wrap my-1">
            <label className="w-full text-sm">Node Label</label>
            <div className="w-full">
              <InputText
                {...register("label")}
                placeholder="Node Label"
                className="w-9"
              />
              <Controller
                control={control}
                name="fontSize"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    className="w-3"
                    options={boardNodeFontSizes}
                    placeholder="Label Font Size"
                    value={value}
                    onChange={(e) => onChange(e.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-full my-1">
          <label className="w-full text-sm">Node Shape</label>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                options={boardNodeShapes}
                className="w-full"
                placeholder="Node Shape"
                filter
                value={value}
                onChange={(e) => onChange(e.value)}
              />
            )}
          />
        </div>
        <div className="w-full my-1">
          <label className="w-full text-sm">Linked Document</label>
          <Controller
            control={control}
            name="doc_id"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                className="w-full"
                placeholder="Link Document"
                value={value}
                filter
                emptyFilterMessage="No documents found"
                onChange={(e) => onChange(e.value)}
                options={
                  documents.data
                    ? [
                        { title: "No document", id: null },
                        ...documents.data.filter(
                          (doc) => !doc.template && !doc.folder
                        ),
                      ]
                    : []
                }
                optionLabel={"title"}
                optionValue={"id"}
              />
            )}
          />
        </div>
        <div className="w-full my-1">
          <label className="w-full text-sm">Custom Image</label>
          <div className="text-xs">
            Note: Custom images override linked documents.
          </div>
          <Controller
            control={control}
            name="customImage"
            render={({ field: { onChange, value } }) => (
              <InputText
                className="w-full"
                placeholder="Custom Image"
                value={value as string}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />
        </div>
        <div className="my-3">
          <div className="my-2">Width: {watch("width")}</div>
          <Controller
            control={control}
            name="width"
            render={({ field: { onChange, value } }) => (
              <Slider
                min={50}
                max={1000}
                step={10}
                value={value}
                onChange={(e) => onChange(e.value)}
              />
            )}
          />
        </div>
        <div className="my-3">
          <div className="my-2">Height: {watch("height")}</div>
          <Controller
            control={control}
            name="height"
            render={({ field: { onChange, value } }) => (
              <Slider
                min={50}
                max={1000}
                step={10}
                value={value}
                onChange={(e) => onChange(e.value)}
              />
            )}
          />
        </div>
        <div className="my-3">
          <label className="w-full text-sm">Node Background Color</label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            name="backgroundColor"
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
        <Button
          label="Save Node"
          type="submit"
          className="p-button-outlined p-button-success"
          icon="pi pi-save"
          iconPos="right"
        />
      </form>
    </Dialog>
  );
}
