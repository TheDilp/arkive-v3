import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteItem, useGetAllImages, useGetAllMapImages, useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { BoardExportType, BoardType, NodeType } from "../../types/boardTypes";
import { baseURLS, createURLS } from "../../types/CRUDenums";
import { MapLayerType, MapType } from "../../types/mapTypes";
import { BoardReferenceAtom, DialogAtom } from "../../utils/Atoms/atoms";
import { exportBoardFunction } from "../../utils/boardUtils";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";
import { ImageDropdownItem, MapImageDropdownItem } from "../Dropdown/ImageDropdownItem";
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
function UpdateMapLayers() {
  const { project_id } = useParams();
  const [dialog] = useAtom(DialogAtom);
  const { data: currentMap } = useGetItem(dialog.data?.id as string, "maps") as { data: MapType };
  const { data: map_images } = useGetAllMapImages(project_id as string);
  const createMapLayer = useCreateSubItem(project_id as string, "map_layers", "maps");
  const updateMapLayer = useUpdateSubItem(project_id as string, "map_layers", "maps");
  const deleteMapLayer = useDeleteItem("map_layers", project_id as string);
  const [layers, setLayers] = useState<MapLayerType[]>(currentMap?.map_layers || []);
  useEffect(() => {
    if (currentMap?.map_layers) setLayers(currentMap.map_layers);
  }, [currentMap?.map_layers]);

  return (
    <>
      <div className="mb-2 flex w-full items-center justify-between">
        <span className="font-medium text-blue-300">New Layer</span>
        <Button
          className="p-button-outlined"
          onClick={() =>
            createMapLayer.mutate({
              title: "New Layer",
              parent: dialog.data?.id,
            })
          }>
          <Icon icon="mdi:layers-plus" />
        </Button>
      </div>

      <div className="flex w-min flex-wrap items-center gap-y-1">
        <span className="w-full text-sm text-zinc-400">Only layers with a set map image will be visible</span>

        {layers &&
          layers.map((layer: MapLayerType) => (
            <div key={layer.id} className="flex w-full items-center justify-start gap-x-2">
              <InputText
                className="w-48"
                onChange={(e) =>
                  setLayers((prev) =>
                    prev?.map((stateLayer) => {
                      if (stateLayer.id === layer.id) {
                        return { ...layer, title: e.target.value };
                      }
                      return stateLayer;
                    }),
                  )
                }
                value={layer.title}
              />
              <div className="w-48">
                <Dropdown
                  itemTemplate={MapImageDropdownItem}
                  onChange={(e) =>
                    setLayers((prev) =>
                      prev.map((stateLayer) => {
                        if (stateLayer.id === layer.id) return { ...stateLayer, image: e.value };
                        return stateLayer;
                      }),
                    )
                  }
                  options={map_images || []}
                  placeholder="Select map image"
                  value={layer.image}
                  valueTemplate={ImageDropdownValue({ image: layer?.image })}
                />
              </div>
              <div className="flex w-fit gap-x-4">
                <Button
                  className="p-button-outlined p-button-success w-24"
                  icon="pi pi-save"
                  onClick={() => {
                    updateMapLayer.mutate({
                      id: layer.id,
                      title: layer.title,
                      image: layer.image,
                    });
                  }}
                />
                <Button
                  className={`p-button-outlined w-1/12 p-button-${layer.public ? "info" : "secondary"}`}
                  icon={`pi pi-${layer.public ? "eye" : "eye-slash"}`}
                  onClick={() => {
                    updateMapLayer.mutate(
                      {
                        id: layer.id,
                        public: !layer.public,
                      },
                      {
                        onSuccess: () =>
                          toaster(
                            "success",
                            `Visiblity of this layer has been changed to: ${!layer.public ? "public" : "private."}`,
                          ),
                      },
                    );
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
                  className="p-button-outlined p-button-danger w-1/12"
                  icon="pi pi-trash"
                  onClick={() => deleteMapLayer.mutate(layer.id)}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
function InsertEditorImage() {
  const { project_id } = useParams();
  const { data: images } = useGetAllImages(project_id as string);
  const [dialog] = useAtom(DialogAtom);
  const [localImage, setLocalImage] = useState("");

  return (
    <div>
      <Dropdown
        itemTemplate={ImageDropdownItem}
        onChange={(e) => setLocalImage(e.value)}
        options={images || []}
        placeholder="Select map"
        value={localImage}
        valueTemplate={ImageDropdownValue({ image: localImage })}
      />
      <Button
        className="p-button-rounded p-button-outlined"
        icon="pi pi-image"
        iconPos="right"
        onClick={() => {
          dialog.data?.insertImage({ src: `${baseURLS.baseServer}getimage/images/${project_id}/${localImage}` });
        }}
      />
    </div>
  );
}
function NodeSearch() {
  const [, setDialog] = useAtom(DialogAtom);
  const [boardRef] = useAtom(BoardReferenceAtom);
  const { item_id } = useParams();
  const { data: board } = useGetItem(item_id as string, "boards") as { data: BoardType };
  const [search, setSearch] = useState("");
  const [filteredNodes, setFilteredNodes] = useState<NodeType[]>(board?.nodes.filter((node) => node.label) || []);

  return (
    <div className="flex flex-col justify-center">
      <AutoComplete
        autoFocus
        className="w-15rem ml-2"
        completeMethod={(e) =>
          setFilteredNodes(board?.nodes.filter((node) => node.label?.toLowerCase().includes(e.query.toLowerCase())) || [])
        }
        field="label"
        onChange={(e) => setSearch(e.value)}
        onSelect={(e) => {
          if (!boardRef) return;
          if (e.value) {
            const foundNode = boardRef.getElementById(e.value.id);
            boardRef.animate(
              {
                center: {
                  eles: foundNode,
                },
                zoom: 1,
              },
              {
                duration: 1250,
              },
            );
            setDialog((prev) => ({ ...DefaultDialog, position: prev.position }));
          }
        }}
        placeholder="Search Nodes"
        suggestions={filteredNodes}
        value={search}
      />
    </div>
  );
}

function ExportBoard() {
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [dialog] = useAtom(DialogAtom);
  const [exportSettings, setExportSettings] = useState<BoardExportType>({ view: "Graph", background: "Color", type: "PNG" });
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex w-full flex-col items-center">
        <h3 className="mb-1 mt-0 w-full text-center">View</h3>
        <SelectButton
          onChange={(e) => setExportSettings({ ...exportSettings, view: e.value })}
          options={["Graph", "Current"]}
          value={exportSettings.view}
        />
      </div>
      <div className="flex w-full flex-col items-center">
        <h3 className="my-2">Background</h3>
        <SelectButton
          onChange={(e) => setExportSettings({ ...exportSettings, background: e.value })}
          options={["Color", "Transparent"]}
          value={exportSettings.background}
        />
      </div>
      <div className="flex w-full flex-col items-center">
        <h3 className="my-2">File Type</h3>
        <SelectButton
          onChange={(e) => setExportSettings({ ...exportSettings, type: e.value })}
          options={["PNG", "JPEG", "JSON"]}
          value={exportSettings.type}
        />
      </div>
      <div className="mt-2 flex w-full justify-center">
        <Button
          className="p-button-outlined p-button-success"
          icon="pi pi-download"
          iconPos="right"
          label="Export"
          onClick={() => {
            if (boardRef) {
              exportBoardFunction(
                boardRef,
                exportSettings.view,
                exportSettings.background,
                exportSettings.type,
                dialog.data?.title,
              );
            } else {
              toaster("error", "There was an error exporting your board.");
            }
          }}
        />
      </div>
    </div>
  );
}
export default function DialogWrapper() {
  const [dialog, setDialog] = useAtom(DialogAtom);
  const [uploading, setUploading] = useState(false);

  return (
    <Dialog
      className="p-0"
      contentClassName="pb-0"
      header={() => {
        if (dialog.type === "files") return "Upload Files";
        if (dialog.type === "map_layer") return "Edit Map Layers";
        if (dialog.type === "editor_image") return "Insert An Image";
        if (dialog.type === "node_search") return "Search nodes";
        if (dialog.type === "export_board") return "Export board";
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
      {dialog.type === "editor_image" && <InsertEditorImage />}
      {dialog.type === "node_search" && <NodeSearch />}
      {dialog.type === "export_board" && <ExportBoard />}
    </Dialog>
  );
}
