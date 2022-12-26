import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteItem, useGetAllMapImages, useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { MapLayerType, MapType } from "../../types/mapTypes";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { toaster } from "../../utils/toast";
import { MapImageDropdownItem } from "../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../Dropdown/ImageDropdownValue";

export default function UpdateMapLayers() {
  const { project_id } = useParams();
  const [dialog] = useAtom(DialogAtom);
  const { data: currentMap } = useGetItem(dialog.data?.id as string, "maps") as { data: MapType };
  const { data: map_images } = useGetAllMapImages(project_id as string);
  const createMapLayer = useCreateSubItem(project_id as string, "map_layers", "maps");
  const updateMapLayer = useUpdateSubItem(project_id as string, "map_layers", "maps");
  const deleteMapLayer = useDeleteItem("map_layers", project_id as string);
  const [layers, setLayers] = useState<MapLayerType[]>(currentMap?.map_layers || []);
  useEffect(() => {
    if (currentMap?.map_layers) setLayers(currentMap.map_layers);
  }, [currentMap?.map_layers]);

  return (
    <>
      <div className="mb-2 flex w-full items-center justify-between">
        <span className="font-medium text-blue-300">New Layer</span>
        <Button
          className="p-button-outlined"
          onClick={() =>
            createMapLayer.mutate({
              title: "New Layer",
              parent: dialog.data?.id,
            })
          }>
          <Icon icon="mdi:layers-plus" />
        </Button>
      </div>

      <div className="flex w-min flex-wrap items-center gap-y-1">
        <span className="w-full text-sm text-zinc-400">Only layers with a set map image will be visible</span>

        {layers &&
          layers.map((layer: MapLayerType) => (
            <div key={layer.id} className="flex w-full items-center justify-start gap-x-2">
              <InputText
                className="w-48"
                onChange={(e) =>
                  setLayers((prev) =>
                    prev?.map((stateLayer) => {
                      if (stateLayer.id === layer.id) {
                        return { ...layer, title: e.target.value };
                      }
                      return stateLayer;
                    }),
                  )
                }
                value={layer.title}
              />
              <div className="w-48">
                <Dropdown
                  itemTemplate={MapImageDropdownItem}
                  onChange={(e) =>
                    setLayers((prev) =>
                      prev.map((stateLayer) => {
                        if (stateLayer.id === layer.id) return { ...stateLayer, image: e.value };
                        return stateLayer;
                      }),
                    )
                  }
                  options={map_images || []}
                  placeholder="Select map image"
                  value={layer.image}
                  valueTemplate={ImageDropdownValue({ image: layer?.image })}
                />
              </div>
              <div className="flex w-fit gap-x-4">
                <Button
                  className="p-button-outlined p-button-success w-24"
                  icon="pi pi-save"
                  onClick={() => {
                    updateMapLayer.mutate({
                      id: layer.id,
                      title: layer.title,
                      image: layer.image,
                    });
                  }}
                />
                <Button
                  className={`p-button-outlined w-1/12 p-button-${layer.public ? "info" : "secondary"}`}
                  icon={`pi pi-${layer.public ? "eye" : "eye-slash"}`}
                  onClick={() => {
                    updateMapLayer.mutate(
                      {
                        id: layer.id,
                        public: !layer.public,
                      },
                      {
                        onSuccess: () =>
                          toaster(
                            "success",
                            `Visiblity of this layer has been changed to: ${!layer.public ? "public" : "private."}`,
                          ),
                      },
                    );
                    setLayers((prev) =>
                      prev?.map((prevLayer) => {
                        if (prevLayer.id === layer.id) {
                          return { ...layer, public: !layer.public };
                        }
                        return prevLayer;
                      }),
                    );
                  }}
                  tooltip="Toggle public"
                />
                <Button
                  className="p-button-outlined p-button-danger w-1/12"
                  icon="pi pi-trash"
                  onClick={() => deleteMapLayer.mutate(layer.id)}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
