import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { ProgressSpinner } from "primereact/progressspinner";
import { SelectButton } from "primereact/selectbutton";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetImages, useUploadImage } from "../../utils/customHooks";
import { toastWarn } from "../../utils/utils";

type Props = {
  uploadDialog: boolean;
  setUploadDialog: (uploadDialog: boolean) => void;
};

export default function Quickupload({ uploadDialog, setUploadDialog }: Props) {
  const { project_id } = useParams();
  const images = useGetImages(project_id as string);
  const uploadImageMutation = useUploadImage(project_id as string);
  const fileUploadRef = useRef<FileUpload>(null);
  const [uploading, setUploading] = useState(false);
  const [types, setTypes] = useState<{ name: string; type: "Image" | "Map" }[]>(
    []
  );
  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };
  const onTemplateSelect = (e: any) => {
    let _types = types;
    let files = e.files;
    for (let i = 0; i < files.length; i++) {
      types.push({ name: files[i].name, type: "Image" });
    }
    setTypes(_types);
  };
  const headerTemplate = (options: any) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        <span onClick={() => {}}>{uploadButton}</span>
        <span
          onClick={() => {
            fileUploadRef.current?.clear();
          }}
        >
          {cancelButton}
        </span>
      </div>
    );
  };

  return (
    <Dialog
      className="w-30rem"
      visible={uploadDialog}
      modal={false}
      position="top-right"
      onHide={() => {
        fileUploadRef.current?.clear();
        setUploadDialog(false);
      }}
      header={
        <div className="flex justify-content-start align-items-center">
          <div>Quick Upload</div>
          {uploading && (
            <div className="ml-2 flex align-items-center w-4">
              (Uploading...
              <ProgressSpinner className="w-full h-1rem" />)
            </div>
          )}
        </div>
      }
    >
      <FileUpload
        style={{
          maxHeight: "40rem",
          overflowY: "auto",
        }}
        name="quickupload[]"
        ref={fileUploadRef}
        headerTemplate={headerTemplate}
        accept="image/*"
        maxFileSize={20000000}
        multiple
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        emptyTemplate={
          <p className="text-center text-gray-400">
            Drag and Drop image files here!
          </p>
        }
        onSelect={onTemplateSelect}
        itemTemplate={(file: any) => {
          return (
            <div className="flex justify-content-between align-items-center">
              <img src={file.objectURL} className="w-3rem" alt="Error" />
              {file.name}
              <SelectButton
                value={types.find((t) => t.name === file.name)?.type}
                options={["Image", "Map"]}
                onChange={(e) => {
                  let _types = [...types];
                  let idx = _types.findIndex((t) => t.name === file.name);
                  if (idx !== -1) {
                    _types[idx].type = e.value;
                    setTypes(_types);
                  }
                }}
              />
            </div>
          );
        }}
        customUpload
        uploadHandler={async (e) => {
          setUploading(true);
          let files = e.files;
          for (let i = 0; i < files.length; i++) {
            // Safeguard to not attempt uploading already existing image
            if (images?.data.some((img) => img.title === files[i].name)) {
              toastWarn(`Image "${files[i].name}" already exists.`);
              continue;
            } else {
              await uploadImageMutation.mutateAsync({
                file: files[i],
                type: types[i].type,
              });
            }
          }
          setUploading(false);
          setTypes([]);
          e.options.clear();
        }}
      />
    </Dialog>
  );
}
