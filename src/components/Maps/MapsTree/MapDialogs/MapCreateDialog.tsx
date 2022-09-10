import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { CreateMapInputs, MapProps } from "../../../../types/MapTypes";
import { useCreateMap, useGetImages } from "../../../../utils/customHooks";
import { ImageProps } from "../../../../custom-types";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";

type Props = {
  mapData: boolean;
  setMapData: Dispatch<SetStateAction<boolean>>;
};

export default function MapCreateDialog({ mapData, setMapData }: Props) {
  const [closeOnDone, setCloseOnDone] = useState(true);
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  const images = useGetImages(project_id as string);
  const createMapMutation = useCreateMap();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMapInputs>({
    defaultValues: { title: "New Map", folder: false },
  });
  const onSubmit: SubmitHandler<CreateMapInputs> = (data) => {
    let id = uuid();
    createMapMutation.mutate({
      id,
      project_id: project_id as string,
      expanded: false,
      ...data,
    });
    reset();
    if (closeOnDone) {
      setMapData(false);
    }
  };
  return (
    <Dialog
      className="w-3"
      header={"Create Map"}
      visible={mapData}
      onHide={() => setMapData(false)}
      modal={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-content-center">
          <div className="w-8">
            <InputText
              placeholder="Map Title"
              className="w-full"
              {...register("title", { required: true, maxLength: 100 })}
              autoFocus={true}
            />
            {errors.title?.type === "required" && (
              <span className="py-1" style={{ color: "var(--red-500)" }}>
                <i className="pi pi-exclamation-triangle"></i>
                This field is required!
              </span>
            )}
          </div>
          <div className="w-8 py-2">
            <Controller
              name="map_image"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Dropdown
                  value={value}
                  itemTemplate={(item: ImageProps) => (
                    <ImgDropdownItem title={item.title} link={item.link} />
                  )}
                  options={
                    images?.data.filter((image) => image.type === "Map") || []
                  }
                  virtualScrollerOptions={{
                    lazy: true, onLazyLoad: () => { }, itemSize: 50, showLoader: true, loading: images?.data.length === 0, delay: 0, loadingTemplate: (options) => {
                      return (
                        <div className="flex align-items-center p-2" style={{ height: '38px' }}>
                        </div>
                      )
                    }
                  }}
                  onChange={(e) => onChange(e.value)}
                  placeholder="Map Image"
                  optionLabel="title"
                  className="w-full"
                />
              )}
            />
            {errors.map_image?.link?.type === "required" && (
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
                  placeholder="Map Parent"
                  optionLabel="title"
                  optionValue="id"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={maps?.filter((map) => map.folder) || []}
                />
              )}
            />
          </div>
          <div className="w-8 flex justify-content-between my-2">
            <div className="w-1/2 flex align-items-center">
              <span className="pr-1">Is Folder:</span>
              <Controller
                name="folder"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.checked)}
                  />
                )}
              />
            </div>
          </div>
          <div className="w-8 flex mb-2 justify-content-between  align-items-center">
            <span>Close Dialog on Done:</span>
            <Checkbox
              checked={closeOnDone}
              onChange={(e) => setCloseOnDone(e.checked)}
            />
          </div>
          <div className="w-full flex justify-content-end">
            <Button
              label="Create Map"
              className="p-button-success p-button-outlined p-button-raised"
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
