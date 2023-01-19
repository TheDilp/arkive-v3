import { useQueryClient } from "@tanstack/react-query";
import { FileUpload } from "primereact/fileupload";
import { SelectButton } from "primereact/selectbutton";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { baseURLS, createURLS } from "../../types/CRUDenums";

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
    <div className="flex items-center justify-between w-full">
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

export default function QuickUploadDialog({ setUploading }: { setUploading: Dispatch<SetStateAction<boolean>> }) {
  const { project_id } = useParams();
  const fileUploadRef = useRef<FileUpload>(null);
  const [types, setTypes] = useState<{ name: string; type: "Image" | "Map" }[]>([]);
  const queryClient = useQueryClient();
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
        <div
          onClick={() => {
            fileUploadRef.current?.clear();
          }}
          onKeyDown={() => {}}
          role="button"
          tabIndex={-1}>
          {cancelButton}
        </div>
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
      uploadHandler={async (e) => {
        setUploading(true);
        const imageFormData = new FormData();
        const mapsFormData = new FormData();

        e.files.forEach((file, index) => {
          if (types[index].type === "Image") imageFormData.append(file.name, file);
          if (types[index].type === "Map") mapsFormData.append(file.name, file);
        });
        if (types.some((type) => type.type === "Image")) {
          await fetch(`${baseURLS.baseServer}${createURLS.uploadImage}${project_id}`, {
            body: imageFormData,
            method: "POST",
          });
          queryClient.refetchQueries({ queryKey: ["allImages", project_id] });
        }
        if (types.some((type) => type.type === "Map")) {
          await fetch(`${baseURLS.baseServer}${createURLS.uploadMap}${project_id}`, {
            body: mapsFormData,
            method: "POST",
          });
          queryClient.refetchQueries({ queryKey: ["allMaps", project_id] });
        }
        setUploading(false);
        setTypes([]);
        e.options.clear();
      }}
      uploadOptions={uploadOptions}
    />
  );
}
