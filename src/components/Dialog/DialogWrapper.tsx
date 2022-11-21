import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { SelectButton } from "primereact/selectbutton";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURLS, createURLS } from "../../types/CRUDenums";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function DialogWrapper() {
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useAtom(DialogAtom);
  const [uploading, setUploading] = useState(false);

  return (
    <Dialog
      position={dialog.position}
      visible={dialog.show}
      modal={dialog.modal}
      header={() => {
        if (dialog.type === "files") return "Upload Files";
        if (dialog.type === "map_marker") return "Map Marker";
        if (uploading) "Uploading...";
      }}
      onHide={() => {
        setDialog({ ...DefaultDialog, position: dialog.position });
      }}>
      {dialog.type === "files" && <QuickUploadDialog setUploading={setUploading} />}
    </Dialog>
  );
}

function QuickUploadDialog({ setUploading }: { setUploading: Dispatch<SetStateAction<boolean>> }) {
  const { project_id } = useParams();
  const fileUploadRef = useRef<FileUpload>(null);
  const [types, setTypes] = useState<{ name: string; type: "Image" | "Map" }[]>([]);

  const onTemplateSelect = (e: any) => {
    const _types = types;
    const files = e.files;
    for (let i = 0; i < files.length; i++) {
      types.push({ name: files[i].name, type: "Image" });
    }
    setTypes(_types);
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
        <span
          onClick={() => {
            fileUploadRef.current?.clear();
          }}>
          {cancelButton}
        </span>
      </div>
    );
  };

  return (
    <FileUpload
      name="quickupload[]"
      headerTemplate={headerTemplate}
      ref={fileUploadRef}
      customUpload
      onUpload={(e) => console.log(e)}
      onSelect={onTemplateSelect}
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
      itemTemplate={(file: any) => {
        return (
          <div className="w-full flex items-center justify-between">
            <img src={file.objectURL} className="w-12" alt="Error" />
            <p className="truncate">{file.name}</p>
            <SelectButton
              value={types.find((t) => t.name === file.name)?.type}
              options={["Image", "Map"]}
              onChange={(e) => {
                const _types = [...types];
                const idx = _types.findIndex((t) => t.name === file.name);
                if (idx !== -1) {
                  _types[idx].type = e.value;
                  setTypes(_types);
                }
              }}
            />
          </div>
        );
      }}
      multiple
      accept="image/*"
      chooseOptions={chooseOptions}
      uploadOptions={uploadOptions}
      cancelOptions={cancelOptions}
      emptyTemplate={<p className="text-center text-gray-400">Drag and Drop image files here!</p>}
    />
  );
}
