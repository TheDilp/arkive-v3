import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { MapPinCreateType, MapPinType, MapType } from "../../../types/ItemTypes/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { buttonLabelWithIcon } from "../../../utils/transform";
import ColorInput from "../../ColorInput/ColorInput";
import { IconSelect } from "../../IconSelect/IconSelect";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerMapPinContent() {
  const { project_id, item_id } = useParams();
  const queryClient = useQueryClient();
  const [, setDrawer] = useAtom(DrawerAtom);
  const [drawer] = useAtom(DrawerAtom);
  const createMapPin = useCreateSubItem<MapPinType>(item_id as string, "map_pins", "maps");
  const updateMapPin = useUpdateSubItem<MapPinType>(item_id as string, "map_pins", "maps");
  const { data: map } = useGetItem<MapType>(item_id as string, "maps");
  const currentPin = map?.map_pins?.find((pin) => pin.id === drawer.id);
  const documents = queryClient.getQueryData<DocumentType[]>(["allItems", project_id, "documents"]);
  const maps: MapType[] | undefined = queryClient.getQueryData(["allItems", project_id, "maps"]);
  const [localItem, setLocalItem] = useState<MapPinType | MapPinCreateType>(
    currentPin ?? {
      backgroundColor: "#000000",
      color: "#ffffff",
      icon: "mdi:user",
      lat: drawer?.data?.lat,
      lng: drawer?.data?.lng,
      parentId: item_id as string,
      isPublic: false,
      text: "",
    },
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  if (!map) return null;
  return (
    <div className="flex w-full flex-col gap-y-5">
      <div className="flex flex-wrap items-center">
        <h4 className="w-full text-lg underline">Marker Text</h4>
        <InputText
          className="w-full"
          onChange={(e) => handleChange({ name: "text", value: e.target.value })}
          placeholder="Marker Popup Text"
          value={localItem.text}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Marker Icon</h4>

        <IconSelect setIcon={(newIcon) => handleChange({ name: "icon", value: newIcon })}>
          <Icon
            className="cursor-pointer rounded-full hover:bg-sky-400"
            color={localItem.color}
            fontSize={32}
            icon={localItem.icon ?? "mdi:map-pin"}
            inline
          />
        </IconSelect>
        <div className="">
          <ColorInput color={localItem.color || "#ffffff"} name="color" onChange={handleChange} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Marker Background</h4>

        <ColorInput color={localItem.backgroundColor || "#000000"} name="backgroundColor" onChange={handleChange} />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <span>Is Public?</span>
        <Checkbox checked={localItem.isPublic} onChange={(e) => handleChange({ name: "isPublic", value: e.target.checked })} />
        <p className="w-full pt-2 text-xs text-zinc-400">
          If a document is linked, the marker will use its public setting by default.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <Dropdown
          className="w-full"
          onChange={(e) => handleChange({ name: "doc_id", value: e.target.value })}
          optionLabel="title"
          options={documents ? [...(documents as DocumentType[])]?.filter((item) => !item.template && !item.folder) : []}
          optionValue="id"
          placeholder="Link Document"
          value={localItem.doc_id}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <Dropdown
          className="w-full"
          onChange={(e) => handleChange({ name: "map_link", value: e.target.value })}
          optionLabel="title"
          options={maps ? [...(maps as MapType[])]?.filter((item) => !item.folder && item.id !== item_id) : []}
          optionValue="id"
          placeholder="Link Map"
          value={localItem?.map_link}
        />
      </div>
      <Button
        className="p-button-outlined p-button-success ml-auto"
        loading={createMapPin.isLoading || updateMapPin.isLoading}
        onClick={async () => {
          if (currentPin) await updateMapPin.mutateAsync({ id: localItem.id, ...changedData });
          else await createMapPin.mutateAsync({ ...localItem, id: crypto.randomUUID() });
          resetChanges();
          handleCloseDrawer(setDrawer, "right");
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
