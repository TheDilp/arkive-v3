import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useGetAllItems, useGetAllMapImages, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { MapCreateType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultMap } from "../../../utils/DefaultValues/MapDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { MapImageDropdownItem } from "../../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../Dropdown/ImageDropdownValue";
import Tags from "../../Tags/Tags";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerMapContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const { data: map_images } = useGetAllMapImages(project_id as string);
  const { data: maps } = useGetAllItems(project_id as string, "maps");
  const createMapMutation = useCreateItem("maps");
  const updateMapMutation = useUpdateItem("maps");
  const deleteMapMutation = useDeleteItem("maps", project_id as string);

  const { data: map } = useGetItem(drawer?.id as string, "maps", { enabled: !!drawer?.id }) as { data: MapType };
  const [localItem, setLocalItem] = useState<MapType | MapCreateType>(
    map ?? {
      ...DefaultMap,
      project_id: project_id as string,
    },
  );

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  function CreateUpdateMap(newData: MapCreateType) {
    if (map) {
      if (!newData.folder && maps?.some((mapItem) => mapItem.parent === map.id)) {
        toaster("warning", "Cannot turn folder into map if it contains children");
        return;
      }
      updateMapMutation?.mutate(
        {
          id: localItem.id,
          ...changedData,
        },
        {
          onSuccess: () => {
            toaster("success", "Your map was successfully updated.");
            resetChanges();
          },
        },
      );
    } else {
      if (!localItem.folder && !localItem.image) {
        toaster("warning", "Maps must have a map image.");
        return;
      }
      createMapMutation.mutate({
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
  }, [map, project_id]);

  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center text-2xl">{map ? `Edit ${map.title}` : "Create New Map"}</h2>
      <InputText
        autoFocus
        className="w-full"
        onChange={(e) => handleChange({ name: "title", value: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter" && map) {
            updateMapMutation?.mutate({
              id: map.id,
              parent: localItem.parent,
              title: localItem.title,
            });
          }
        }}
        value={localItem?.title || ""}
      />

      <Dropdown
        itemTemplate={MapImageDropdownItem}
        onChange={(e) => handleChange({ name: "image", value: e.target.value })}
        options={map_images || []}
        placeholder="Select map"
        value={localItem.image}
        valueTemplate={ImageDropdownValue({ image: localItem?.image })}
      />
      <div>
        <Tags handleChange={handleChange} localItem={localItem} type="maps" />
      </div>
      <div className="flex items-center justify-between">
        <span className="p-checkbox-label">Is Folder?</span>
        <Checkbox checked={localItem.folder} onChange={(e) => handleChange({ name: "folder", value: e.checked })} />
      </div>
      <Button
        className="p-button-outlined p-button-success ml-auto"
        onClick={() => {
          CreateUpdateMap(localItem);
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto w-full">
        {map ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            onClick={() => {
              if (document)
                deleteItem(
                  map.folder
                    ? "Are you sure you want to delete this folder? Deleting it will also delete all of its children!"
                    : "Are you sure you want to delete this map?",
                  () => {
                    deleteMapMutation?.mutate(map.id);
                    handleCloseDrawer(setDrawer, "right");
                  },
                  () => toaster("info", "Item not deleted."),
                );
            }}
            type="submit">
            {buttonLabelWithIcon("Delete", "mdi:trash")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
