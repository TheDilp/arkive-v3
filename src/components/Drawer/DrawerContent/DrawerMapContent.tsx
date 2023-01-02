import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useGetAllMapImages, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { MapCreateType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultMap } from "../../../utils/DefaultValues/MapDefaults";
import { DropdownFilter } from "../../../utils/filters";
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
  const queryClient = useQueryClient();
  const maps = queryClient.getQueryData<MapType[]>(["allItems", project_id, "maps"]);
  const createMapMutation = useCreateItem<MapType>("maps");
  const updateMapMutation = useUpdateItem<MapType>("maps", project_id as string);
  const deleteMapMutation = useDeleteItem("maps", project_id as string);
  const { data: map } = useGetItem<MapType>(drawer?.id as string, "maps", { enabled: !!drawer?.id });
  const [localItem, setLocalItem] = useState<MapType | MapCreateType>(
    map ?? {
      ...DefaultMap,
      project_id: project_id as string,
    },
  );

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  function CreateUpdateMap(newData: MapCreateType) {
    if (map) {
      if (!newData.folder && maps?.some((mapItem) => mapItem.parentId === map.id)) {
        toaster("warning", "Cannot turn folder into map if it contains children");
        return;
      }
      if (!changedData) {
        toaster("info", "No data was changed.");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tags, ...rest } = changedData;
      updateMapMutation?.mutate(
        {
          id: localItem.id,
          ...rest,
        },
        {
          onSuccess: () => {
            toaster("success", "Your map was successfully updated.");
            queryClient.refetchQueries({ queryKey: ["allItems", project_id, "maps"] });
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
  if (!map) return null;
  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center text-2xl">
        {map ? (
          `Edit ${map.title}`
        ) : (
          <div className="flex items-center justify-center">
            Create New Map
            <Icon fontSize={36} icon="mdi:map" />
          </div>
        )}
      </h2>
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
      <div className="">
        <Dropdown
          className="w-full"
          filter
          onChange={(e) => handleChange({ name: "parentId", value: e.target.value })}
          optionLabel="title"
          options={
            maps
              ? [{ id: null, title: "Root" }, ...(maps as MapType[]).filter((m) => DropdownFilter(m, map))]
              : [{ id: null, title: "Root" }]
          }
          optionValue="id"
          placeholder="Map Folder"
          value={localItem?.parent?.id}
        />
      </div>
      <Tags handleChange={handleChange} localItem={localItem} type="maps" />
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
