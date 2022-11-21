import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateMutation, useGetAllMapImages, useUpdateMutation } from "../../../CRUD/ItemsCRUD";
import { useGetItem } from "../../../hooks/getItemHook";
import { baseURLS } from "../../../types/CRUDenums";
import { MapCreateType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultMap } from "../../../utils/DefaultValues/MapDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";

export default function DrawerMapContent() {
  const { project_id } = useParams();
  const [drawer] = useAtom(DrawerAtom);
  const { data: map_images } = useGetAllMapImages(project_id as string);
  const updateMapMutation = useUpdateMutation("maps");
  const createMapMutation = useCreateMutation("maps");
  const map = useGetItem(project_id as string, drawer?.id, "maps") as MapType;
  const [localItem, setLocalItem] = useState<MapType | MapCreateType>(
    map ?? {
      ...DefaultMap,
      project_id: project_id as string,
    },
  );

  function CreateUpdateMap(newData: MapCreateType) {
    if (map) {
      updateMapMutation?.mutate(
        {
          folder: newData.folder,
          id: map.id,
          title: newData.title,
        },
        {
          onSuccess: () => toaster("success", "Your map was successfully updated."),
        },
      );
    } else {
      if (!localItem.folder && !localItem.map_image) {
        toaster("warning", "Maps must have a map image.");
        return;
      }

      createMapMutation?.mutate({
        ...DefaultMap,
        ...newData,
      });
    }
  }

  useEffect(() => {
    if (map) {
      setLocalItem(map);
    } else {
      setLocalItem({
        ...DefaultMap,
        project_id: project_id as string,
      });
    }
  }, [map]);
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-2xl text-center">Create New Map</h2>
      <InputText
        className="w-full"
        value={localItem?.title || ""}
        onChange={(e) =>
          setLocalItem((prev) => ({
            ...prev,
            title: e.target.value,
          }))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" && map) {
            updateMapMutation?.mutate({
              id: map.id,
              parent: localItem.parent,
              title: localItem.title,
            });
          }
        }}
        autoFocus={true}
      />

      <Dropdown
        options={map_images}
        placeholder="Select map"
        valueTemplate={() => {
          return <div>{localItem?.map_image || "Select Map"}</div>;
        }}
        onChange={(e) => setLocalItem((prev) => ({ ...prev, map_image: e.value }))}
        value={localItem.map_image}
        itemTemplate={(e) => (
          <div className="flex items-center justify-between max-w-[200px]">
            <span className="truncate">{e}</span>
            <img className="w-12 h-12" src={`${baseURLS.baseServer}getimage/maps/${project_id}/${e}`} />
          </div>
        )}
      />
      <div className="flex items-center justify-between">
        <label htmlFor="cb1" className="p-checkbox-label">
          Is Folder?
        </label>
        <Checkbox
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              folder: e.checked,
            }))
          }
          checked={localItem.folder}
        />
      </div>
      <Button
        className="ml-auto p-button-outlined p-button-success"
        type="submit"
        onClick={() => {
          CreateUpdateMap(localItem);
        }}>
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
