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
import { MapCreateType, MapType } from "../../../types/ItemTypes/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { DefaultMap } from "../../../utils/DefaultValues/MapDefaults";
import { DropdownFilter } from "../../../utils/filters";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { virtualScrollerSettings } from "../../../utils/uiUtils";
import { MapImageDropdownItem } from "../../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../Dropdown/ImageDropdownValue";
import Tags from "../../Tags/Tags";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

export default function DrawerMapContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const { data: map_images } = useGetAllMapImages(project_id as string);
  const queryClient = useQueryClient();
  const allMaps = queryClient.getQueryData<MapType[]>(["allItems", project_id, "maps"]);
  const createMapMutation = useCreateItem<MapType>("maps");
  const updateMapMutation = useUpdateItem<MapType>("maps", project_id as string);
  const deleteMapMutation = useDeleteItem("maps", project_id as string);
  const map = allMaps?.find((m) => m.id === drawer.id);
  const [localItem, setLocalItem] = useState<MapType | MapCreateType>(
    map ?? {
      ...DefaultMap,
      project_id: project_id as string,
    },
  );

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
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
    <div className="flex h-full flex-col gap-y-2 font-Lato">
      <h2 className="text-center text-2xl">
        {map ? `Edit ${map.title}` : <div className="flex items-center justify-center">Create New Map</div>}
      </h2>
      <DrawerSection title="Map title">
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
      </DrawerSection>

      <DrawerSection title="Map image">
        <Dropdown
          filter
          itemTemplate={MapImageDropdownItem}
          onChange={(e) => handleChange({ name: "image", value: e.target.value })}
          options={map_images || []}
          placeholder="Select map"
          value={localItem.image}
          valueTemplate={ImageDropdownValue({ image: localItem?.image })}
          virtualScrollerOptions={virtualScrollerSettings}
        />
      </DrawerSection>

      <DrawerSection title="Map folder">
        <Dropdown
          className="w-full"
          filter
          onChange={(e) => handleChange({ name: "parentId", value: e.target.value })}
          optionLabel="title"
          options={
            allMaps
              ? [{ id: null, title: "Root" }, ...(allMaps as MapType[]).filter((m) => DropdownFilter(m, map))]
              : [{ id: null, title: "Root" }]
          }
          optionValue="id"
          placeholder="Map folder"
          value={localItem?.parent?.id}
          virtualScrollerOptions={virtualScrollerSettings}
        />
      </DrawerSection>
      <DrawerSection title="Tags">
        <Tags handleChange={handleChange} localItem={localItem} type="maps" />
      </DrawerSection>
      <div className="flex items-center justify-between">
        <span className="p-checkbox-label">Is Folder?</span>
        <Checkbox checked={localItem.folder ?? false} onChange={(e) => handleChange({ name: "folder", value: e.checked })} />
      </div>
      <div className="flex items-center justify-between">
        <span className="p-checkbox-label">Cluster pins?</span>
        <Checkbox
          checked={localItem.clusterPins ?? false}
          onChange={(e) => handleChange({ name: "clusterPins", value: e.checked })}
        />
      </div>
      <div className="mt-auto flex w-full flex-col gap-y-2">
        <Button
          className="p-button-outlined p-button-success ml-auto"
          loading={createMapMutation.isLoading || updateMapMutation.isLoading}
          onClick={async () =>
            createUpdateItem<MapType>(
              map,
              localItem,
              changedData,
              DefaultMap,
              allMaps,
              resetChanges,
              createMapMutation.mutateAsync,
              updateMapMutation.mutateAsync,
              setDrawer,
            )
          }
          type="submit">
          {buttonLabelWithIcon("Save", IconEnum.save)}
        </Button>
        {map ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            onClick={() => {
              if (map)
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
            {buttonLabelWithIcon("Delete", IconEnum.trash)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
