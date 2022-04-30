import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  CreateMapInputs,
  Map,
  mapItemDisplayDialog,
} from "../../../custom-types";
import { useUpdateMap } from "../../../utils/customHooks";

type Props = {
  visible: mapItemDisplayDialog;
  setVisible: (visible: mapItemDisplayDialog) => void;
};

export default function MapUpdateDialog({ visible, setVisible }: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const maps = queryClient.getQueryData<Map[]>(`${project_id}-maps`);
  const updateMapMutation = useUpdateMap(project_id as string);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<CreateMapInputs, "folder">>({
    defaultValues: {
      title: visible.title,
      map_image: visible.map_image,
      parent: visible.parent === "0" ? undefined : visible.parent,
    },
  });
  const onSubmit: SubmitHandler<Omit<CreateMapInputs, "folder">> = (data) => {
    updateMapMutation.mutate({
      id: visible.id,
      ...data,
    });
    setVisible({
      id: "",
      title: "",
      map_image: "",
      parent: "",
      show: false,
      folder: false,
      depth: 0,
    });
  };
  return (
    <Dialog
      className="w-3"
      header={`Update Map - ${visible.title}`}
      visible={visible.show}
      onHide={() =>
        setVisible({
          id: "",
          title: "",
          map_image: "",
          parent: "",
          show: false,
          folder: false,
          depth: 0,
        })
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-content-center">
          <div className="w-8">
            <InputText
              placeholder="Map Title"
              className="w-full"
              {...register("title", { required: true, maxLength: 100 })}
            />
            {errors.title?.type === "required" && (
              <span className="py-1" style={{ color: "var(--red-500)" }}>
                <i className="pi pi-exclamation-triangle"></i>
                This field is required!
              </span>
            )}
          </div>
          <div className="w-8 py-2">
            <InputText
              placeholder="Map Image"
              className="w-full"
              {...register("map_image", {
                required: true,
              })}
            />
            {errors.map_image?.type === "required" && (
              <span className="py-1" style={{ color: "var(--red-500)" }}>
                <i className="pi pi-exclamation-triangle"></i>
                This field is required!
              </span>
            )}
          </div>
          <div className="w-8">
            <Controller
              name="parent"
              control={control}
              render={({ field }) => (
                <Dropdown
                  className="w-full"
                  placeholder="Map Folder"
                  optionLabel="title"
                  optionValue="id"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={maps?.filter((map) => map.folder) || []}
                />
              )}
            />
          </div>

          <div className="w-full flex justify-content-end">
            <Button
              label="Update Map"
              className="p-button-success p-button-outlined mt-2"
              icon="pi pi-plus"
              iconPos="right"
              type="submit"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
