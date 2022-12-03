import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem } from "../../CRUD/ItemsCRUD";
import { baseURLS, createURLS } from "../../types/CRUDenums";
import { MapLayerType } from "../../types/mapTypes";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";
import ImageDropdownItem from "../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../Dropdown/ImageDropdownValue";

function FileUploadItemTemplate(
  file: any,
  types: { name: string; type: "Image" | "Map" }[],
  setTypes: Dispatch<
    SetStateAction<
      {
        name: string;
        type: "Image" | "Map";
      }[]
    >
  >,
) {
  const { name, objectURL } = file;
  return (
    <div className="flex w-full items-center justify-between">
      <img alt="Error" className="w-12" src={objectURL} />
      <p className="truncate">{name}</p>
      <SelectButton
        onChange={(e) => {
          const allTypes = [...types];
          const idx = allTypes.findIndex((t) => t.name === name);
          if (idx !== -1) {
            allTypes[idx].type = e.value;
            setTypes(allTypes);
          }
        }}
        options={["Image", "Map"]}
        value={[...types].find((t) => t.name === name)?.type}
      />
    </div>
  );
}

function QuickUploadDialog({ setUploading }: { setUploading: Dispatch<SetStateAction<boolean>> }) {
  const { project_id } = useParams();
  const fileUploadRef = useRef<FileUpload>(null);
  const [types, setTypes] = useState<{ name: string; type: "Image" | "Map" }[]>([]);

  const onTemplateSelect = (e: any) => {
    const allTypes = types;
    const { files } = e;
    for (let i = 0; i < files.length; i += 1) {
      types.push({ name: files[i].name, type: "Image" });
    }
    setTypes(allTypes);
  };

  const chooseOptions = {
    className: "custom-choose-btn p-button-rounded p-button-outlined",
    icon: "pi pi-fw pi-images",
    iconOnly: true,
  };
  const uploadOptions = {
    className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
  };
  const cancelOptions = {
    className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
    icon: "pi pi-fw pi-times",
    iconOnly: true,
  };
  const headerTemplate = (options: any) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;

    return (
      <div
        className={className}
        style={{
          alignItems: "center",
          backgroundColor: "transparent",
          display: "flex",
        }}>
        {chooseButton}
        <span>{uploadButton}</span>
        <button
          onClick={() => {
            fileUploadRef.current?.clear();
          }}
          type="button">
          {cancelButton}
        </button>
      </div>
    );
  };

  return (
    <FileUpload
      ref={fileUploadRef}
      accept="image/*"
      cancelOptions={cancelOptions}
      chooseOptions={chooseOptions}
      customUpload
      emptyTemplate={<p className="text-center text-gray-400">Drag and Drop image files here!</p>}
      headerTemplate={headerTemplate}
      itemTemplate={(files: any) => FileUploadItemTemplate(files, types, setTypes)}
      multiple
      name="quickupload[]"
      onSelect={onTemplateSelect}
      onUpload={(e) => console.log(e)}
      uploadHandler={async (e) => {
        setUploading(true);
        const imageFormData = new FormData();
        const mapsFormData = new FormData();

        e.files.forEach((file, index) => {
          if (types[index].type === "Image") imageFormData.append(file.name, file);
          if (types[index].type === "Map") mapsFormData.append(file.name, file);
        });
        await fetch(`${baseURLS.baseServer}${createURLS.uploadImage}${project_id}`, {
          body: imageFormData,
          method: "POST",
        });
        await fetch(`${baseURLS.baseServer}${createURLS.uploadMap}${project_id}`, {
          body: mapsFormData,
          method: "POST",
        });
        setUploading(false);
        setTypes([]);
        e.options.clear();
      }}
      uploadOptions={uploadOptions}
    />
  );
}
function UpdateMapLayers() {
  const { project_id } = useParams();
  const [, setLayers] = useState<MapLayerType[]>([]);
  const [dialog] = useAtom(DialogAtom);
  const createMapLayer = useCreateSubItem(project_id as string, "map_layers");
  return (
    <>
      <div className="mb-2 flex w-full items-center justify-between">
        <span className="font-medium text-blue-300">New Layer</span>
        <Button
          className="p-button-outlined"
          onClick={() =>
            createMapLayer.mutate({
              title: "New Layer",
              parent: dialog.data?.parent,
            })
          }>
          <Icon icon="mdi:layers-plus" />
        </Button>
      </div>
      <div className="flex w-full flex-wrap items-center gap-y-1">
        {dialog?.data?.layers &&
          dialog.data.layers
            .sort((a: MapLayerType, b: MapLayerType) => {
              if (a.title > b.title) return 1;
              if (a.title < b.title) return -1;
              return 0;
            })
            .map((layer: MapLayerType) => (
              <div key={layer.id} className="justify-content-between align-items-center flex w-full ">
                <InputText
                  className="w-4"
                  onChange={(e) =>
                    setLayers((prev) =>
                      prev?.map((prevLayer) => {
                        if (prevLayer.id === layer.id) {
                          return { ...layer, title: e.target.value };
                        }
                        return prevLayer;
                      }),
                    )
                  }
                  value={layer.title}
                />
                <div className="w-4">
                  <Dropdown
                    itemTemplate={ImageDropdownItem}
                    // onChange={(e) => setLayers((prev) => ({ ...prev, map_image: e.value[0] }))}
                    // options={map_images ? [map_images] : []}
                    placeholder="Select map"
                    value={layer.image}
                    valueTemplate={ImageDropdownValue({ map_image: layer?.image })}
                  />
                </div>
                <Button
                  className="p-button-outlined p-button-success w-1"
                  icon="pi pi-save"
                  // onClick={() => {
                  //   updateMapLayerMutation.mutate({
                  //     id: layer.id,
                  //     title: layer.title,
                  //     map_id: visible.map_id,
                  //     public: layer.public,
                  //     image: layer.image,
                  //   });
                  // }}
                />
                <Button
                  className={`p-button-outlined w-1 p-button-${layer.public ? "info" : "secondary"}`}
                  icon={`pi pi-${layer.public ? "eye" : "eye-slash"}`}
                  onClick={() => {
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
                  className="p-button-outlined p-button-danger w-1"
                  icon="pi pi-trash"
                  // onClick={() =>
                  //   deleteMapLayerMutation.mutate({
                  //     id: layer.id,
                  //     project_id: project_id as string,
                  //     map_id: visible.map_id,
                  //   })
                  // }
                />
              </div>
            ))}
      </div>
    </>
  );
}
export default function DialogWrapper() {
  const [dialog, setDialog] = useAtom(DialogAtom);
  const [uploading, setUploading] = useState(false);

  return (
    <Dialog
      header={() => {
        if (dialog.type === "files") return "Upload Files";
        if (dialog.type === "map_layer") return "Edit Map Layers";
        if (uploading) return "Uploading...";
        return null;
      }}
      modal={dialog.modal}
      onHide={() => {
        setDialog({ ...DefaultDialog, position: dialog.position });
      }}
      position={dialog.position}
      visible={dialog.show}>
      {dialog.type === "files" && <QuickUploadDialog setUploading={setUploading} />}
      {dialog.type === "map_layer" && <UpdateMapLayers />}
    </Dialog>
  );
}
