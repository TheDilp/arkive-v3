import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useGetAllItems, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useGetItem } from "../../../hooks/getItemHook";
import { DocumentType } from "../../../types/documentTypes";
import { MapPinCreateType, MapPinType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { IconSelect } from "../../IconSelect/IconSelect";

export default function DrawerMapPinContent() {
  const { project_id, item_id } = useParams();
  const [drawer] = useAtom(DrawerAtom);
  const createMapPin = useCreateSubItem(project_id as string, "map_pins", "maps");
  const updateMapPin = useUpdateSubItem(project_id as string, "map_pins", "maps");
  const map = useGetItem(project_id as string, drawer?.data?.parent, "maps") as MapType;
  const currentPin = map?.map_pins.find((pin) => pin.id === drawer.id);
  const { data: documents } = useGetAllItems(project_id as string, "documents");
  const { data: maps } = useGetAllItems(project_id as string, "maps");
  const [localItem, setLocalItem] = useState<MapPinType | MapPinCreateType>(
    currentPin ?? {
      backgroundColor: "#000000",
      color: "#ffffff",
      icon: "mdi:user",
      lat: drawer?.data?.lat,
      lng: drawer?.data?.lng,
      parent: item_id as string,
      public: false,
      text: "",
    },
  );
  return (
    <div className="flex flex-col w-full gap-y-5">
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
            className="rounded-full cursor-pointer hover:bg-sky-400"
            color={localItem.color}
            fontSize={24}
            icon={localItem.icon}
            inline
          />
        </IconSelect>
        <ColorPicker
          onChange={(e) => setLocalItem((prev) => ({ ...prev, color: `#${e.value}` as string }))}
          value={localItem.color}
        />
        <InputText onChange={(e) => setLocalItem((prev) => ({ ...prev, color: e.target.value }))} value={localItem.color} />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Marker Background</h4>

        <ColorPicker
          onChange={(e) => setLocalItem((prev) => ({ ...prev, backgroundColor: `#${e.value}` as string }))}
          value={localItem.backgroundColor}
        />
        <InputText
          onChange={(e) => setLocalItem((prev) => ({ ...prev, backgroundColor: e.target.value }))}
          value={localItem.backgroundColor}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <span>Public:</span>
        <Checkbox checked={localItem.public} />
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
        className="ml-auto p-button-outlined p-button-success"
        onClick={() => {
          if (localItem?.id) updateMapPin.mutate(localItem);
          else createMapPin.mutate(localItem);
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}