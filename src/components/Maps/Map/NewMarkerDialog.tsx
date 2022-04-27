import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "primereact/button";
import { useCreateMapMarker } from "../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";

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
};
export default function NewMarkerDialog({ show, setVisible, lat, lng }: Props) {
  const { project_id, map_id } = useParams();
  const createMapMarkerMutation = useCreateMapMarker();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
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
  return (
    <Dialog
      header="New Map Marker"
      visible={show}
      style={{ width: "25vw" }}
      onHide={() => setVisible()}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText {...register("text")} autoComplete={"false"} />
        <InputText defaultValue={"wizard-hat"} {...register("icon")} />
        <InputText defaultValue={"yellow"} {...register("color")} />
        <Button
          className="p-button-outlined"
          label="Create Marker"
          icon="pi pi-map-marker"
          iconPos="right"
          type="submit"
        />
      </form>
    </Dialog>
  );
}
