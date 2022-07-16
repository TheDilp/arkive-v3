import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateMapLayer,
  useDeleteMapLayer,
  useUpdateMapLayer,
} from "../../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import ImageSelectDropdown from "../../../Util/ImageSelectDropdown";
import { ImageProps } from "../../../../custom-types";
import { InputText } from "primereact/inputtext";
import { useQueryClient } from "react-query";
import { MapProps } from "../../../../types/MapTypes";

type Props = {
  visible: { map_id: string; show: boolean };
  setVisible: Dispatch<SetStateAction<{ map_id: string; show: boolean }>>;
};

export default function MapLayersDialog({ visible, setVisible }: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  const map = maps?.filter((map) => map.id === visible.map_id)[0];
  const createMapLayerMutation = useCreateMapLayer(project_id as string);
  const updateMapLayerMutation = useUpdateMapLayer(project_id as string);
  const deleteMapLayerMutation = useDeleteMapLayer();
  const [layers, setLayers] = useState(map?.map_layers);

  useEffect(() => {
    if (map) {
      setLayers(map.map_layers);
    }
  }, [map, visible.map_id]);

  return (
    <Dialog
      header={`Update ${map?.title} Layers`}
      visible={visible.show}
      className="w-3"
      onHide={() => {
        setVisible({ map_id: "", show: false });
        setLayers([]);
      }}
      modal={false}
    >
      <div className="w-full mb-2 flex justify-content-between align-items-center">
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
      <div className="w-full flex flex-wrap row-gap-1">
        {layers &&
          layers
            .sort((a, b) => {
              if (a.title > b.title) return 1;
              if (a.title < b.title) return -1;
              return 0;
            })
            .map((layer) => (
              <div
                key={layer.id}
                className="w-full flex justify-content-between align-items-center "
              >
                <InputText
                  className="w-4"
                  value={layer.title}
                  onChange={(e) =>
                    setLayers((prev) =>
                      prev?.map((prevLayer) => {
                        if (prevLayer.id === layer.id) {
                          layer = { ...layer, title: e.target.value };
                          return layer;
                        } else {
                          return prevLayer;
                        }
                      })
                    )
                  }
                />
                <div className="w-5">
                  <ImageSelectDropdown
                    value={layer.image}
                    onChange={(e) =>
                      updateMapLayerMutation.mutate({
                        id: layer.id,
                        image: e.value as ImageProps,
                        map_id: visible.map_id,
                      })
                    }
                    filter="Map"
                  />
                </div>
                <Button
                  className="w-1 p-button-outlined p-button-success"
                  icon="pi pi-save"
                  onClick={() => {
                    let newTitle = layers.find(
                      (map_layer) => map_layer.id === layer.id
                    )?.title;

                    if (newTitle)
                      updateMapLayerMutation.mutate({
                        id: layer.id,
                        title: newTitle,
                        map_id: visible.map_id,
                      });
                  }}
                />
                <Button
                  className="w-1 p-button-outlined p-button-danger"
                  icon="pi pi-trash"
                  onClick={() =>
                    deleteMapLayerMutation.mutate({
                      id: layer.id,
                      project_id: project_id as string,
                      map_id: visible.map_id,
                    })
                  }
                />
              </div>
            ))}
      </div>
    </Dialog>
  );
}
