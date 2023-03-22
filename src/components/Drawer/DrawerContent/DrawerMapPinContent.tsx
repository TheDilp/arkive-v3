import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useGetAllImages, useGetAllItems, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { MapPinCreateType, MapPinType, MapType } from "../../../types/ItemTypes/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { virtualScrollerSettings } from "../../../utils/uiUtils";
import ColorInput from "../../ColorInput/ColorInput";
import { ImageDropdownItem } from "../../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../Dropdown/ImageDropdownValue";
import { IconSelect } from "../../IconSelect/IconSelect";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

export default function DrawerMapPinContent() {
  const { project_id, item_id } = useParams();
  const queryClient = useQueryClient();
  const maps: MapType[] | undefined = queryClient.getQueryData(["allItems", project_id, "maps"]);
  const { data: map } = useGetItem<MapType>(item_id as string, "maps");
  const { data: documents } = useGetAllItems<DocumentType>(project_id as string, "documents", {
    staleTime: 5 * 60 * 1000,
  });
  const { data: images } = useGetAllImages(project_id as string, {
    staleTime: 5 * 60 * 1000,
  });
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const currentPin = map?.map_pins?.find((pin) => pin.id === drawer?.data?.id);

  const createMapPin = useCreateSubItem<MapPinType>(item_id as string, "map_pins", "maps");
  const updateMapPin = useUpdateSubItem<MapPinType>(item_id as string, "map_pins", "maps");

  const [localItem, setLocalItem] = useState<MapPinType | MapPinCreateType>(
    currentPin ?? {
      backgroundColor: "#000000",
      showBackground: true,
      showBorder: true,
      borderColor: "#ffffff",
      color: "#ffffff",
      icon: IconEnum.user,
      lat: drawer?.data?.lat,
      lng: drawer?.data?.lng,
      parentId: item_id as string,
      isPublic: false,
      text: "",
    },
  );

  useEffect(() => {
    if (currentPin) setLocalItem(currentPin);
  }, [currentPin]);

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  if (!map) return null;
  return (
    <div className="flex w-full flex-col gap-y-5">
      <DrawerSection title="Marker text">
        <div className="flex flex-wrap items-center">
          <InputText
            className="w-full"
            onChange={(e) => handleChange({ name: "text", value: e.target.value })}
            placeholder="Marker Popup Text"
            value={localItem?.text}
          />
        </div>
      </DrawerSection>
      <DrawerSection title="Marker icon">
        <div className="flex flex-wrap items-center justify-between">
          <IconSelect setIcon={(newIcon) => handleChange({ name: "icon", value: newIcon })}>
            <Icon
              className="cursor-pointer rounded-full hover:bg-sky-400"
              color={localItem.color}
              fontSize={32}
              icon={localItem.icon ?? IconEnum.map_pin}
              inline
            />
          </IconSelect>
          <div className="">
            <ColorInput color={localItem.color || "#ffffff"} name="color" onChange={handleChange} />
          </div>
        </div>
      </DrawerSection>
      <DrawerSection title="Marker background">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <ColorInput color={localItem.backgroundColor || "#000000"} name="backgroundColor" onChange={handleChange} />
          </div>
          <div className="flex flex-1 justify-end">
            <InputSwitch
              checked={localItem.showBackground}
              onChange={(e) => handleChange({ name: "showBackground", value: e.value })}
              tooltip="Show background"
              tooltipOptions={{ position: "left" }}
            />
          </div>
        </div>
      </DrawerSection>
      <DrawerSection title="Marker border">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <ColorInput color={localItem.borderColor || "#ffffff"} name="borderColor" onChange={handleChange} />
          </div>
          <div className="flex flex-1 justify-end">
            <InputSwitch
              checked={localItem.showBorder}
              onChange={(e) => handleChange({ name: "showBorder", value: e.value })}
              tooltip="Show border"
              tooltipOptions={{ position: "left" }}
            />
          </div>
        </div>
      </DrawerSection>
      <div className="flex flex-wrap items-center justify-between">
        <span>Public:</span>
        <Checkbox checked={localItem.isPublic} onChange={(e) => handleChange({ name: "isPublic", value: e.target.checked })} />
        <p className="w-full pt-2 text-xs text-zinc-400">
          If a document is linked, the marker will use its public setting by default.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <Dropdown
          className="w-full"
          filter
          onChange={(e) => handleChange({ name: "doc_id", value: e.target.value })}
          optionLabel="title"
          options={documents ? [...(documents as DocumentType[])]?.filter((item) => !item.template && !item.folder) : []}
          optionValue="id"
          placeholder="Link Document"
          value={localItem.doc_id}
        />
      </div>
      <DrawerSection subtitle="If an image is selected it will replace the icon." title="Pin image (optional)">
        <Dropdown
          className="w-full"
          filter
          itemTemplate={ImageDropdownItem}
          name="image"
          onChange={(e) => handleChange({ name: "image", value: e.value === "None" ? undefined : e.value })}
          options={["None", ...(images || [])] || []}
          placeholder="Select map"
          value={localItem?.image}
          valueTemplate={ImageDropdownValue({ image: localItem?.image })}
          virtualScrollerOptions={virtualScrollerSettings}
        />
      </DrawerSection>
      <div className="flex flex-wrap items-center justify-between">
        <Dropdown
          className="w-full"
          filter
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
          if (currentPin)
            await updateMapPin.mutateAsync(
              { id: localItem.id, ...changedData },
              {
                onSuccess: () => {
                  toaster("success", "Pin updated successfully.");
                },
              },
            );
          else {
            await createMapPin.mutateAsync(
              { ...localItem, id: crypto.randomUUID() },
              {
                onSuccess: () => {
                  toaster("success", "Pin created successfully.");
                },
              },
            );
          }
          resetChanges();

          handleCloseDrawer(setDrawer, "right");
        }}
        type="submit">
        {buttonLabelWithIcon("Save", IconEnum.save)}
      </Button>
    </div>
  );
}
