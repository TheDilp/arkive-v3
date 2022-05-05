import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { nodeUpdateDialog } from "../../custom-types";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useGetDocuments, useUpdateNode } from "../../utils/customHooks";
import { useParams } from "react-router-dom";
import { boardNodeShapes } from "../../utils/utils";
type Props = {
  nodeUpdateDialog: nodeUpdateDialog;
  setNodeUpdateDialog: (nodeUpdateDialog: nodeUpdateDialog) => void;
};

type Inputs = Pick<nodeUpdateDialog, "label" | "type" | "doc_id">;

export default function NodeUpdateDialog({
  nodeUpdateDialog,
  setNodeUpdateDialog,
}: Props) {
  const { project_id, board_id } = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      label: nodeUpdateDialog.label,
      type: nodeUpdateDialog.type,
      doc_id: nodeUpdateDialog.doc_id,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) =>
    updateNodeMutation.mutate({
      id: nodeUpdateDialog.id,
      board_id: board_id as string,
      label: data.label,
      type: data.type,
      doc_id: data.doc_id,
    });
  const documents = useGetDocuments(project_id as string);
  const updateNodeMutation = useUpdateNode(project_id as string);
  return (
    <Dialog
      header={`Update Node ${nodeUpdateDialog.label || ""}`}
      visible={nodeUpdateDialog.show}
      onHide={() =>
        setNodeUpdateDialog({
          id: "",
          label: "",
          type: "",
          doc_id: "",
          show: false,
        })
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          {...register("label")}
          placeholder="Node Label"
          //   value={nodeUpdateDialog.label}
          //   onChange={(e) =>
          //     setNodeUpdateDialog({ ...nodeUpdateDialog, label: e.target.value })
          //   }
        />
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              options={boardNodeShapes}
              className="w-full"
              placeholder="Node Shape"
              value={value}
              onChange={(e) => onChange(e.value)}
            />
          )}
        />
        <Controller
          control={control}
          name="doc_id"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              className="w-full"
              placeholder="Link Document"
              value={value}
              onChange={(e) => onChange(e.value)}
              options={documents.data?.filter((doc) => !doc.template)}
              optionLabel={"title"}
              optionValue={"id"}
            />
          )}
        />
        <Button label="Save Node" type="submit" />
      </form>
    </Dialog>
  );
}
