import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { SelectButton } from "primereact/selectbutton";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { baseURLS, createURLS } from "../../types/CRUDenums";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { toaster } from "../../utils/toast";

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
      <div>
        <p className="truncate">{name}</p>
      </div>
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
      <Button
        className="p-button-rounded p-button-outlined p-button-danger"
        icon="pi pi-times"
        onClick={() => {
          const allTypes = [...(types || [])].filter((t) => t.name !== name);
          setTypes(allTypes);
        }}
      />
    </div>
  );
}

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
  const headerTemplate = (options: any) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;

    return (
      <div
        className={className}
        style={{
          alignItems: "center",
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "column",
        }}>
        <div className="flex w-full items-center justify-start">
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
        <span className="max-w-[250px] text-xs text-zinc-400">
          Images are converted to WEBP format for better compression and smaller size.
        </span>
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
      maxFileSize={20000000}
      multiple
      name="quickupload[]"
      onClear={() => setTypes([])}
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
          await FetchFunction({
            url: `${baseURLS.baseServer}${createURLS.uploadImage}${project_id}`,
            body: imageFormData,
            method: "POST",
          });
          await queryClient.refetchQueries({ queryKey: ["allImages", project_id] });
        }
        if (types.some((type) => type.type === "Map")) {
          await FetchFunction({
            url: `${baseURLS.baseServer}${createURLS.uploadMap}${project_id}`,
            body: mapsFormData,
            method: "POST",
          });
          await queryClient.refetchQueries({ queryKey: ["allMapImages", project_id] });
        }
        await queryClient.refetchQueries({ queryKey: ["allSettingsImages", project_id] });
        setUploading(false);
        setTypes([]);
        e.options.clear();
        toaster("success", "Upload completed.");
      }}
      uploadOptions={uploadOptions}
    />
  );
}
