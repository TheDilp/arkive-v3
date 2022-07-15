import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateMapLayer,
  useGetMapData,
} from "../../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";
import ImageSelectDropdown from "../../../Util/ImageSelectDropdown";

type Props = {
  visible: { map_id: string; show: boolean };
  setVisible: Dispatch<SetStateAction<{ map_id: string; show: boolean }>>;
};

export default function MapLayersDialog({ visible, setVisible }: Props) {
  const { project_id } = useParams();
  const map = useGetMapData(project_id as string, visible.map_id);
  const createMapLayerMutation = useCreateMapLayer(project_id as string);
  return (
    <Dialog
      visible={visible.show}
      onHide={() => setVisible({ map_id: "", show: false })}
      modal={false}
    >
      <div className="w-full flex justify-content-between align-items-center">
        <span className="text-blue-300 font-medium">New Layer</span>
        <Button
          className="p-button-outlined"
          onClick={() =>
            createMapLayerMutation.mutate({
              id: uuid(),
              title: "New Layer",
              map_id: visible.map_id,
            })
          }
        >
          <Icon icon="mdi:layers-plus" />
        </Button>
      </div>
      <div className="w-full flex flex-wrap">
        {map?.map_layers.map((layer) => (
          <div key={layer.id} className="w-full">
            {layer.title}
            <ImageSelectDropdown value={layer.image} onChange={() => {}} />
          </div>
        ))}
      </div>
    </Dialog>
  );
}
