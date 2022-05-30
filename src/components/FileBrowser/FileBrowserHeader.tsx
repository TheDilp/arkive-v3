import { saveAs } from "file-saver";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataViewLayoutOptions } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { SelectButton } from "primereact/selectbutton";
import { useContext, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { ImageProps } from "../../custom-types";
import { useGetImages } from "../../utils/customHooks";
import {
  deleteImageRecords,
  deleteImagesStorage,
  downloadImage,
  uploadImage,
} from "../../utils/supabaseUtils";
import { toastWarn } from "../../utils/utils";
import { FileBrowserContext } from "../Context/FileBrowserContext";
import { MediaQueryContext } from "../Context/MediaQueryContext";

export default function FileBrowserHeader() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const images = useGetImages(project_id as string);
  const fileUploadRef = useRef<FileUpload>(null);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const {
    filter,
    setFilter,
    layout,
    setLayout,
    selected,
    setSelected,
    tableRef,
  } = useContext(FileBrowserContext);
  const { isTabletOrMobile } = useContext(MediaQueryContext);
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
      </div>
    );
  };
  return (
    <div className="w-full h-2rem mb-2 flex flex-wrap">
      <Dialog visible={uploadDialog} onHide={() => setUploadDialog(false)}>
        <FileUpload
          style={{
            maxHeight: "45rem",
            overflowY: "auto",
          }}
          name="filebrowser[]"
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
      <ConfirmDialog />
      <div className="w-6 flex flex-nowrap align-content-start align-items-start">
        <Button
          className="p-button-outlined px-3"
          label={isTabletOrMobile ? "" : "Upload"}
          icon="pi pi-upload"
          iconPos="right"
          onClick={() => setUploadDialog(true)}
        />
        <InputText
          placeholder="Quick search"
          className="ml-2 h-min"
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="w-6 ml-2 text-white">
          {uploading && <ProgressSpinner className="w-2rem" />}
        </div>
      </div>
      <div className="w-6 flex flex-nowrap justify-content-end align-items-start">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => {
            setLayout(e.value);
          }}
          className="mr-2"
        />
        <div
          style={{
            opacity: layout === "list" ? 1 : 0,
            pointerEvents: layout === "list" ? "all" : "none",
          }}
        >
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label={isTabletOrMobile ? "" : "Reset"}
            tooltip="Resets Filters, Sorting and Pagination"
            className="p-button-outlined mr-2"
            onClick={() => {
              tableRef.current?.reset();
            }}
          />
          <Button
            label={isTabletOrMobile ? "" : "Delete Selected"}
            icon="pi pi-trash"
            className="p-button-danger p-button-outlined mx-2"
            disabled={selected.length === 0}
            onClick={() =>
              confirmDialog({
                message: `Are you sure you want to delete ${selected.length} images?`,
                header: `Deleting ${selected.length} images`,
                icon: "pi pi-exclamation-triangle",
                acceptClassName: "p-button-danger",
                // className: selectAll ? "deleteAllDocuments" : "",
                accept: () => {
                  deleteImagesStorage(selected.map((image) => image.link));
                  deleteImageRecords(selected.map((image) => image.id)).then(
                    () => {
                      queryClient.setQueryData(
                        `${project_id}-images`,
                        (oldData: ImageProps[] | undefined) => {
                          if (oldData) {
                            return oldData.filter(
                              (img) =>
                                !selected.some((image) => image.id === img.id)
                            );
                          } else {
                            return [];
                          }
                        }
                      );
                      setSelected([]);
                    }
                  );
                },
              })
            }
          />
          <Button
            label={isTabletOrMobile ? "" : "Download Selected"}
            icon="pi pi-download"
            iconPos="right"
            className="p-button-outlined p-button-success"
            disabled={selected.length === 0}
            onClick={async () => {
              for (const image of selected) {
                const d = await downloadImage(image.link);
                if (d) {
                  saveAs(
                    new Blob([d], {
                      type: d.type,
                    }),
                    `${image.title || image.id || project_id + "-image"}`
                  );
                }
              }
              setSelected([]);
            }}
          />
        </div>
      </div>
    </div>
  );
}
