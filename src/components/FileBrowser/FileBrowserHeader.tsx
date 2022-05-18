import { DataViewLayoutOptions } from "primereact/dataview";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../utils/supabaseUtils";
import { ProgressBar } from "primereact/progressbar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
type Props = {
  refetch: any;
  filter: string;
  layout: string;
  setFilter: (filter: string) => void;
  setLayout: (layout: string) => void;
};

export default function FileBrowserHeader({
  refetch,
  filter,
  layout,
  setFilter,
  setLayout,
}: Props) {
  const { project_id } = useParams();
  const fileUploadRef = useRef<FileUpload>(null);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploading, setUploading] = useState({
    current: 0,
    total: 0,
  });
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
    let files = e.files;
    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size;
    }
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
            chooseOptions={chooseOptions}
            uploadOptions={uploadOptions}
            cancelOptions={cancelOptions}
            onSelect={onTemplateSelect}
            customUpload
            uploadHandler={async (e) => {
              let files = e.files;
              setUploading({ current: 0, total: e.files.length });
              for (let i = 0; i < files.length; i++) {
                setUploading({
                  current: uploading.current + 1,
                  total: uploading.total,
                });
                try {
                  await uploadImage(project_id as string, files[i]);
                  console.log(e.files.length);
                } catch (error) {
                  //
                }
              }
              refetch();
              setUploading({
                current: 0,
                total: 0,
              });
              setUploadDialog(false);
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
          <ProgressBar
            className="w-full h-2rem"
            value={(uploading.current * 100) / uploading.total || 0}
          />
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
