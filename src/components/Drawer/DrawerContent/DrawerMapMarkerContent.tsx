import { Icon } from "@iconify/react";
import { InputText } from "primereact/inputtext";
import { IconSelect } from "../../IconSelect/IconSelect";
import { ColorPicker } from "primereact/colorpicker";
import { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { useGetAllItems } from "../../../CRUD/ItemsCRUD";
import { useParams } from "react-router-dom";
import { DocumentType } from "../../../types/documentTypes";
import { MapType } from "../../../types/mapTypes";
import { Button } from "primereact/button";
import { buttonLabelWithIcon } from "../../../utils/transform";

export default function DrawerMapMarkerContent() {
  const { project_id } = useParams();
  const { data: documents } = useGetAllItems(project_id as string, "documents");
  const { data: maps } = useGetAllItems(project_id as string, "maps");
  const [localItem, setLocalItem] = useState({
    bgColor: "#000000",
    color: "#ffffff",
    icon: "mdi:user",
    public: false,
    title: "",
  });
  return (
    <div className="w-full flex flex-col gap-y-5">
      <div className="flex flex-wrap items-center">
        <h4 className="w-full text-lg underline">Marker Text</h4>
        <InputText className="w-full" placeholder="Marker Popup Text" />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Marker Icon</h4>
        <IconSelect setIcon={(newIcon) => setLocalItem((prev) => ({ ...prev, icon: newIcon }))}>
          <Icon
            color={localItem.color}
            icon={localItem.icon}
            inline={true}
            className="rounded-full cursor-pointer hover:bg-sky-400"
            fontSize={24}
          />
        </IconSelect>
        <ColorPicker
          value={localItem.color}
          onChange={(e) => setLocalItem((prev) => ({ ...prev, color: `#${e.value}` as string }))}
        />
        <InputText
          value={localItem.color}
          onChange={(e) => setLocalItem((prev) => ({ ...prev, color: e.target.value }))}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="w-full text-lg underline">Marker Background</h4>

        <ColorPicker
          value={localItem.bgColor}
          onChange={(e) => setLocalItem((prev) => ({ ...prev, bgColor: `#${e.value}` as string }))}
        />
        <InputText
          value={localItem.bgColor}
          onChange={(e) => setLocalItem((prev) => ({ ...prev, bgColor: e.target.value }))}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <label>Public:</label>
        <Checkbox checked={localItem.public} />
        <p className="w-full pt-2 text-xs text-zinc-400">
          If a document is linked, the marker will use its public setting by default.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <Dropdown
          className="w-full"
          optionLabel="title"
          optionValue="id"
          options={
            documents ? [...(documents as DocumentType[])]?.filter((item) => !item.template && !item.folder) : []
          }
          placeholder="Link Document"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <Dropdown
          className="w-full"
          optionLabel="title"
          optionValue="id"
          options={maps ? [...(maps as MapType[])]?.filter((item) => !item.folder) : []}
          placeholder="Link Map"
        />
      </div>
      <Button
        className="ml-auto p-button-outlined p-button-success"
        type="submit"
        onClick={() => {
          // CreateUpdateDocument(localItem);
        }}>
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
