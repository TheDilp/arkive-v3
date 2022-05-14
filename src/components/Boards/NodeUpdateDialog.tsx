import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { nodeUpdateDialogProps, UpdateNodeInputs } from "../../custom-types";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useGetDocuments, useUpdateNode } from "../../utils/customHooks";
import { useParams } from "react-router-dom";
import {
  boardNodeFontSizes,
  boardNodeShapes,
  textHAlignOptions,
  textVAlignOptions,
} from "../../utils/utils";
import { ColorPicker } from "primereact/colorpicker";
import { InputNumber } from "primereact/inputnumber";
import { useEffect } from "react";

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
    setValue,
    formState: { errors },
  } = useForm<UpdateNodeInputs>({});

  // Submit handler to update the node
  const onSubmit: SubmitHandler<UpdateNodeInputs> = (data) => {
    updateNodeMutation.mutate({
      id: nodeUpdateDialog.id,
      board_id: board_id as string,
      ...data,
      backgroundColor: `#${data.backgroundColor.replace("#", "")}`,
    });
  };
  const documents = useGetDocuments(project_id as string);
  const updateNodeMutation = useUpdateNode(project_id as string);

  // Update the form data when a new node is opened
  useEffect(() => {
    Object.entries(nodeUpdateDialog).forEach(([key, value]) => {
      if (key === "backgroundColor" && typeof value === "string") {
        setValue(key as any, value.replace("#", ""));
      } else {
        setValue(key as any, value);
      }
    });
  }, [nodeUpdateDialog]);

  return (
    <Dialog
      header={`Update Node ${nodeUpdateDialog.label || ""}`}
      style={{
        maxWidth: "20vw",
      }}
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
          textHAlign: "center",
          textVAlign: "top",
          zIndex: 1,
          show: false,
        })
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-nowrap">
          <div className="w-full flex flex-wrap my-1">
            <label className="w-full text-sm">Node Label</label>
            <div className="w-full flex flex-wrap">
              <InputText
                {...register("label")}
                placeholder="Node Label"
                className="w-9"
                autoComplete="false"
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
              <div className="flex flex-nowrap w-full mt-1">
                <div className="w-6">
                  <label htmlFor="" className="text-xs">
                    Horizontal Align
                  </label>
                  <Controller
                    control={control}
                    name="textHAlign"
                    render={({ field: { onChange, value } }) => (
                      <Dropdown
                        className="w-full"
                        options={textHAlignOptions}
                        value={value}
                        onChange={(e) => onChange(e.value)}
                      />
                    )}
                  />
                </div>
                <div className="w-6">
                  <label htmlFor="" className="text-xs">
                    Vertical Align
                  </label>
                  <Controller
                    control={control}
                    name="textVAlign"
                    render={({ field: { onChange, value } }) => (
                      <Dropdown
                        className="w-full"
                        options={textVAlignOptions}
                        value={value}
                        onChange={(e) => onChange(e.value)}
                      />
                    )}
                  />
                </div>
              </div>
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
                value={(value as string) || ""}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />
        </div>
        <div className="my-1">
          <div className="mt-2">Width</div>
          <Controller
            control={control}
            name="width"
            render={({ field: { onChange, value } }) => (
              <InputNumber
                className="w-full"
                showButtons
                min={10}
                max={1000}
                step={10}
                value={value}
                onChange={(e) => onChange(e.value)}
              />
            )}
          />
        </div>
        <div className="my-1">
          <div className="mt-2">Height</div>
          <Controller
            control={control}
            name="height"
            render={({ field: { onChange, value } }) => (
              <InputNumber
                className="w-full"
                min={10}
                max={1000}
                step={10}
                showButtons
                value={value}
                onChange={(e) => onChange(e.value)}
              />
            )}
          />
        </div>
        <div className="w-full my-2">
          <div className="w-full flex flex-wrap">
            <label className="w-full text-sm">Node Level</label>
            <span className="w-full text-xs">
              Changes if node is above or below others
            </span>
          </div>
          <Controller
            control={control}
            name="zIndex"
            render={({ field: { onChange, value } }) => (
              <InputNumber
                className="w-full"
                value={value}
                onChange={(e) => onChange(e.value)}
                showButtons
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
