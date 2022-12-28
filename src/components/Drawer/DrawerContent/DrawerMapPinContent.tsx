import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/documentTypes";
import { MapPinCreateType, MapPinType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { buttonLabelWithIcon, getHexColor } from "../../../utils/transform";
import { IconSelect } from "../../IconSelect/IconSelect";

export default function DrawerMapPinContent() {
  const { project_id, item_id } = useParams();
  const queryClient = useQueryClient();
  const [drawer] = useAtom(DrawerAtom);
  const createMapPin = useCreateSubItem(item_id as string, "map_pins", "maps");
  const updateMapPin = useUpdateSubItem(item_id as string, "map_pins", "maps");
  const { data: map } = useGetItem(item_id as string, "maps") as { data: MapType };
  const currentPin = map?.map_pins?.find((pin) => pin.id === drawer.id);
  const documents: DocumentType[] | undefined = queryClient.getQueryData(["allItems", project_id, "documents"]);
  const maps: MapType[] | undefined = queryClient.getQueryData(["allItems", project_id, "maps"]);
  const [localItem, setLocalItem] = useState<MapPinType | MapPinCreateType>(
    currentPin ?? {
      backgroundColor: "#000000",
      color: "#ffffff",
      icon: "mdi:user",
      lat: drawer?.data?.lat,
      lng: drawer?.data?.lng,
      parent: item_id as string,
      isPublic: false,
      text: "",
    },
  );
  return (
    <div className="flex w-full flex-col gap-y-5">
      <div className="flex flex-wrap items-center">
        <h4 className="w-full text-lg underline">Marker Text</h4>
        <InputText
          className="w-full"
          onChange={(e) => setLocalItem((prev) => ({ ...prev, text: e.target.value }))}
          placeholder="Marker Popup Text"
          value={localItem.text}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Marker Icon</h4>
        <IconSelect setIcon={(newIcon) => setLocalItem((prev) => ({ ...prev, icon: newIcon }))}>
          <Icon
            className="cursor-pointer rounded-full hover:bg-sky-400"
            color={localItem.color}
            fontSize={24}
            icon={localItem.icon ?? "mdi:map-pin"}
            inline
          />
        </IconSelect>
        <ColorPicker
          onChange={(e) => setLocalItem((prev) => ({ ...prev, color: getHexColor(e.value) }))}
          value={localItem.color}
        />
        <InputText onChange={(e) => setLocalItem((prev) => ({ ...prev, color: e.target.value }))} value={localItem.color} />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Marker Background</h4>

        <ColorPicker
          onChange={(e) => setLocalItem((prev) => ({ ...prev, backgroundColor: getHexColor(e.value) }))}
          value={localItem.backgroundColor}
        />
        <InputText
          onChange={(e) => setLocalItem((prev) => ({ ...prev, backgroundColor: e.target.value }))}
          value={localItem.backgroundColor}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <span>Public:</span>
        <Checkbox checked={localItem.isPublic} onChange={(e) => setLocalItem((prev) => ({ ...prev, isPublic: e.checked }))} />
        <p className="w-full pt-2 text-xs text-zinc-400">
          If a document is linked, the marker will use its public setting by default.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <Dropdown
          className="w-full"
          optionLabel="title"
          options={documents ? [...(documents as DocumentType[])]?.filter((item) => !item.template && !item.folder) : []}
          optionValue="id"
          placeholder="Link Document"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <Dropdown
          className="w-full"
          optionLabel="title"
          options={maps ? [...(maps as MapType[])]?.filter((item) => !item.folder) : []}
          optionValue="id"
          placeholder="Link Map"
        />
      </div>
      <Button
        className="p-button-outlined p-button-success ml-auto"
        onClick={() => {
          if (currentPin) updateMapPin.mutate(localItem);
          else createMapPin.mutate({ ...localItem, id: crypto.randomUUID() });
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
