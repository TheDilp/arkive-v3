import { Button } from "primereact/button";
import { DataViewLayoutOptions } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../utils/supabaseUtils";
import { SelectButton } from "primereact/selectbutton";
import { useGetImages } from "../../utils/customHooks";
import { toastWarn } from "../../utils/utils";
type Props = {
  filter: string;
  layout: string;
  setFilter: (filter: string) => void;
  setLayout: (layout: string) => void;
};

export default function FileBrowserHeader({
  filter,
  layout,
  setFilter,
  setLayout,
}: Props) {
  const { project_id } = useParams();
  const images = useGetImages(project_id as string);
  const fileUploadRef = useRef<FileUpload>(null);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadDialog, setUploadDialog] = useState(false);
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
    let _totalSize = totalSize;
    let _types = types;
    let files = e.files;
    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size;
      types.push({ name: files[i].name, type: "Image" });
    }
    setTypes(_types);
    setTotalSize(_totalSize);
  };
  const headerTemplate = (options: any) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

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
        <span
          onClick={() => {
            fileUploadRef.current?.upload();
            setTotalSize(0);
          }}
        >
          {uploadButton}
        </span>
        <span
          onClick={() => {
            fileUploadRef.current?.clear();
            setTotalSize(0);
          }}
        >
          {cancelButton}
        </span>
        <ProgressBar
          value={value}
          displayValueTemplate={() => `${formatedValue} / 10 MB`}
          style={{ width: "300px", height: "20px", marginLeft: "auto" }}
        ></ProgressBar>
      </div>
    );
  };

  return (
    <div className="w-10 mb-2 flex flex-wrap">
      <div className="w-full">
        <Dialog visible={uploadDialog} onHide={() => setUploadDialog(false)}>
          <FileUpload
            style={{
              maxHeight: "45rem",
              overflowY: "auto",
            }}
            name="demo[]"
            ref={fileUploadRef}
            headerTemplate={headerTemplate}
            accept="image/*"
            maxFileSize={10000000}
            multiple
            emptyTemplate={
              <p className="text-center text-gray-400">
                Drag and Drop image files here!
              </p>
            }
            chooseOptions={chooseOptions}
            uploadOptions={uploadOptions}
            cancelOptions={cancelOptions}
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
              let files = e.files;
              setUploading(true);
              for (let i = 0; i < files.length; i++) {
                // Safeguard to not attempt uploading already existing image
                if (images?.data.some((img) => img.title === files[i].name)) {
                  toastWarn(`Image "${files[i].name}" already exists.`);
                  continue;
                } else {
                  try {
                    await uploadImage(
                      project_id as string,
                      files[i],
                      types[i].type
                    );
                  } catch (error) {
                    //
                  }
                }
              }
              images?.refetch();
              setUploading(false);
              setUploadDialog(false);
              setTypes([]);
              e.options.clear();
            }}
          />
        </Dialog>
      </div>
      <div className="w-6 flex flex-wrap align-content-top align-items-center">
        <Button
          className="p-button-outlined"
          label="Upload"
          icon="pi pi-upload"
          iconPos="right"
          onClick={() => setUploadDialog(true)}
        />
        <InputText
          placeholder="Search by title"
          className="ml-2 h-min"
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="w-6 ml-2 text-white">
          {uploading && <ProgressSpinner className="w-2rem" />}
        </div>
      </div>
      <div className="w-6 flex justify-content-end">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    </div>
  );
}
