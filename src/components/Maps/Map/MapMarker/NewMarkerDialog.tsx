import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import {
  useCreateMapMarker,
  useGetDocuments,
} from "../../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import CreateMarkerIconSelect from "./MarkerIconSelect";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
type Props = {
  lat: number;
  lng: number;
  show: boolean;
  setVisible: () => void;
};
type Inputs = {
  icon: string;
  text: string;
  color: string;
  doc_id: string;
};
export default function NewMarkerDialog({ show, setVisible, lat, lng }: Props) {
  const { project_id, map_id } = useParams();
  const createMapMarkerMutation = useCreateMapMarker();
  const [iconSelect, setIconSelect] = useState({
    show: false,
    top: 0,
    left: 0,
  });
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { icon: "wizard-hat", color: "ffffff" },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let id = uuid();
    createMapMarkerMutation.mutate({
      id,
      project_id: project_id as string,
      map_id: map_id as string,
      lat,
      lng,
      ...data,
    });
  };
  const documents = useGetDocuments(project_id as string);
  return (
    <Dialog
      header="New Map Marker"
      visible={show}
      style={{ width: "25vw" }}
      onHide={() => setVisible()}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap">
        <div className="w-full"></div>
        <div className="w-full">
          <InputText
            {...register("text")}
            autoComplete={"false"}
            className="w-full"
            placeholder="Marker popup text"
          />
        </div>
        <div className="w-full my-2 flex align-items-center justify-content-evenly flex-wrap">
          <span>Marker Icon:</span>
          <Icon
            className="cursor-pointer"
            fontSize={40}
            icon={`mdi:${watch("icon")}`}
            color={watch("color")}
            onClick={(e) =>
              setIconSelect({
                ...iconSelect,
                show: true,
                top: e.clientY,
                left: e.clientX,
              })
            }
          />
          <CreateMarkerIconSelect
            {...iconSelect}
            setValue={setValue}
            setIconSelect={setIconSelect}
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            name="color"
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <div className="flex align-items-center flex-row-reverse">
                <InputText
                  value={value}
                  className="w-full ml-2"
                  onChange={onChange}
                />
                <ColorPicker value={value} onChange={onChange} />
              </div>
            )}
          />
          {errors.color?.type === "required" && (
            <div
              className="w-full text-center my-2"
              style={{
                color: "var(--red-600)",
              }}
            >
              The color property is required!
            </div>
          )}
        </div>
        <div className="w-full">
          <Controller
            control={control}
            name="doc_id"
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <Dropdown
                className="w-full"
                placeholder="Link Document"
                value={value}
                onChange={(e) => onChange(e.value)}
                options={documents}
                optionLabel={"title"}
                optionValue={"id"}
              />
            )}
          />
        </div>
        <div className="w-full flex justify-content-end mt-2">
          <Button
            className="p-button-outlined"
            label="Create Marker"
            icon="pi pi-map-marker"
            iconPos="right"
            type="submit"
          />
        </div>
      </form>
    </Dialog>
  );
}
