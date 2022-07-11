import { Icon } from "@iconify/react";
import { saveAs } from "file-saver";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Tooltip } from "primereact/tooltip";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
  BoardExportProps,
  BoardNodeProps,
  CytoscapeNodeProps,
  ImageProps,
  NodeUpdateDialogProps,
  UpdateNodeProps,
} from "../../custom-types";
import {
  boardNodeFontSizes,
  boardNodeShapes,
  changeLockState,
  nodeColorPresets,
  textHAlignOptions,
  textVAlignOptions,
  updateColor,
} from "../../utils/boardUtils";
import {
  useDeleteEdge,
  useDeleteNode,
  useGetBoardData,
  useGetDocuments,
  useGetImages,
  useUpdateEdge,
  useUpdateNode,
} from "../../utils/customHooks";
import { NodeUpdateDialogDefault } from "../../utils/defaultDisplayValues";
import { toastWarn } from "../../utils/utils";
import { BoardRefsContext } from "../Context/BoardRefsContext";
import ImgDropdownItem from "../Util/ImgDropdownItem";

type Props = {};
export default function BoardQuickBar({}: Props) {
  const { project_id, board_id } = useParams();
  const { cyRef, ehRef } = useContext(BoardRefsContext);
  const board = useGetBoardData(project_id as string, board_id as string);
  const documents = useGetDocuments(project_id as string);
  const images = useGetImages(project_id as string);
  const [drawMode, setDrawMode] = useState(false);
  const [search, setSearch] = useState("");
  const [manyNodesDialog, setManyNodesDialog] = useState<
    Omit<NodeUpdateDialogProps, "id">
  >(NodeUpdateDialogDefault);
  const [filteredNodes, setFilteredNodes] = useState<BoardNodeProps[]>(
    board?.nodes.filter((node) => node.label) || []
  );
  const [searchDialog, setSearchDialog] = useState(false);
  const [exportDialog, setExportDialog] = useState<BoardExportProps>({
    view: "Graph",
    background: "Color",
    type: "PNG",
    show: false,
  });

  const updateNodeMutation = useUpdateNode(project_id as string);
  const updateEdgeMutation = useUpdateEdge(project_id as string);
  const deleteNodeMutation = useDeleteNode(project_id as string);
  const deleteEdgeMutation = useDeleteEdge(project_id as string);
  const debouncedColorPick = useDebouncedCallback(
    // function
    (color) => {
      updateColor(
        cyRef,
        `#${color}`,
        board_id as string,
        updateNodeMutation,
        updateEdgeMutation
      );
    },
    // delay in ms
    400
  );

  const exportBoardFunction = (
    view: "Graph" | "View",
    background: "Color" | "Transparent",
    type: "PNG" | "JPEG" | "JSON",
    boardTitle?: string
  ) => {
    if (!cyRef) return;
    if (type === "PNG") {
      saveAs(
        new Blob(
          [
            cyRef.current.png({
              output: "blob",
              bg: background === "Color" ? "#121212" : "transparent",
              full: view === "Graph" ? true : false,
            }),
          ],
          {
            type: "image/png",
          }
        ),
        `${boardTitle || "ArkiveBoard"}.png`
      );
    } else if (type === "JPEG") {
      saveAs(
        new Blob(
          [
            cyRef.current.jpg({
              output: "blob",
              bg: background === "Color" ? "#121212" : "transparent",
              full: view === "Graph" ? true : false,
            }),
          ],
          {
            type: "image/jpg",
          }
        ),
        `${boardTitle || "ArkiveBoard"}.jpg`
      );
    } else if (type === "JSON") {
      saveAs(
        new Blob([JSON.stringify(cyRef.current.json(true))], {
          type: "application/json",
        }),
        `${boardTitle || "ArkiveBoard"}.json`
      );
    }
  };
  const updateManyNodesFunction = (
    values: { [key: string]: any },
    cyRef: any
  ) => {
    let ids: string[] = cyRef.current
      .elements(":selected")
      .nodes()
      .map((node: any) => node.data().id);

    if (ids.length === 0) {
      toastWarn("No elements are selected!");
      return;
    }
    for (const id of ids) {
      updateNodeMutation.mutate({
        ...values,
        id,
        board_id: board_id as string,
      });
    }
  };
  return (
    <div
      className="w-2 absolute border-round surface-50 text-white h-3rem flex align-items-center justify-content-around shadow-5"
      style={{
        top: "95.6vh",
        left: "50%",
        zIndex: 5,
      }}
    >
      {/* Dialogs */}
      <>
        <Dialog
          visible={searchDialog}
          onHide={() => {
            setSearchDialog(false);
            setSearch("");
            setFilteredNodes(board?.nodes || []);
          }}
          modal={false}
          header="Search Nodes"
          className="w-20rem"
          position={"center"}
        >
          <AutoComplete
            autoFocus
            className="ml-2 w-15rem"
            placeholder="Search Nodes"
            value={search}
            field="label"
            suggestions={filteredNodes}
            onSelect={(e) => {
              if (!cyRef) return;
              if (e.value) {
                let foundNode = cyRef.current.getElementById(e.value.id);
                cyRef.current.animate(
                  {
                    center: {
                      eles: foundNode,
                    },
                    zoom: 1,
                  },
                  {
                    duration: 1250,
                  }
                );
              }
            }}
            completeMethod={(e) =>
              setFilteredNodes(
                board?.nodes.filter((node) =>
                  node.label?.toLowerCase().includes(e.query.toLowerCase())
                ) || []
              )
            }
            itemTemplate={(item: BoardNodeProps) => (
              <span
                onClick={(e: any) => {
                  if (!cyRef) return;
                  let foundNode = cyRef.current.getElementById(item.id);
                  cyRef.current.animate(
                    {
                      center: {
                        eles: foundNode,
                      },
                      zoom: 1,
                    },
                    {
                      duration: 1250,
                    }
                  );
                }}
              >
                <ImgDropdownItem
                  title={item.label || ""}
                  link={item.customImage?.link || ""}
                />
              </span>
            )}
            onChange={(e) => setSearch(e.value)}
          />
        </Dialog>
        <Dialog
          header={`Export Board - ${board?.title}`}
          modal={false}
          position="top-left"
          style={{
            maxWidth: "14vw",
          }}
          visible={exportDialog.show}
          onHide={() =>
            setExportDialog({
              view: "Graph",
              background: "Color",
              type: "PNG",
              show: false,
            })
          }
        >
          <div className="flex flex-wrap">
            <div className="w-full flex flex-wrap justify-content-center">
              <h3 className="w-full text-center mb-1 mt-0">View</h3>
              <SelectButton
                value={exportDialog.view}
                options={["Graph", "Current"]}
                onChange={(e) =>
                  setExportDialog({ ...exportDialog, view: e.value })
                }
              />
            </div>
            <div className="w-full flex flex-wrap justify-content-center">
              <h3 className="my-2">Background</h3>
              <SelectButton
                value={exportDialog.background}
                options={["Color", "Transparent"]}
                onChange={(e) =>
                  setExportDialog({ ...exportDialog, background: e.value })
                }
              />
            </div>
            <div className="w-full flex flex-wrap justify-content-center">
              <h3 className="my-2">File Type</h3>
              <SelectButton
                value={exportDialog.type}
                options={["PNG", "JPEG", "JSON"]}
                onChange={(e) =>
                  setExportDialog({ ...exportDialog, type: e.value })
                }
              />
            </div>
            <div className="w-full flex justify-content-center mt-2">
              <Button
                label="Export"
                className="p-button-outlined p-button-success"
                icon="pi pi-download"
                iconPos="right"
                onClick={() => {
                  if (cyRef && cyRef.current) {
                    exportBoardFunction(
                      exportDialog.view,
                      exportDialog.background,
                      exportDialog.type,
                      board?.title
                    );
                  } else {
                    toastWarn("Ooops");
                  }
                }}
              />
            </div>
          </div>
        </Dialog>
        <Dialog
          visible={manyNodesDialog.show}
          position="right"
          modal={false}
          header="Update Many"
          className="w-25rem overflow-y-auto"
          style={{
            height: "45rem",
          }}
          onHide={() => setManyNodesDialog(NodeUpdateDialogDefault)}
        >
          <div className="w-full flex flex-nowrap">
            <div className="w-full flex flex-wrap my-1">
              <label className="w-full text-sm">Node Label</label>
              <div className="w-full flex flex-wrap justify-content-between">
                <InputText
                  value={manyNodesDialog.label}
                  onChange={(e) =>
                    setManyNodesDialog(
                      (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                        ...prev,
                        label: e.target.value,
                      })
                    )
                  }
                  placeholder="Node Label"
                  className="w-5"
                  autoComplete="false"
                />
                <Dropdown
                  className="w-3"
                  options={boardNodeFontSizes}
                  placeholder="Label Font Size"
                  value={manyNodesDialog.fontSize}
                  onChange={(e) =>
                    setManyNodesDialog(
                      (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                        ...prev,
                        fontSize: e.value,
                      })
                    )
                  }
                />
                <Button
                  type="submit"
                  className="p-button-square p-button-success p-button-outlined w-2"
                  icon="pi pi-save"
                  iconPos="right"
                  onClick={() => {
                    if (!cyRef) return;
                    updateManyNodesFunction(
                      {
                        label: manyNodesDialog.label,
                        fontSize: manyNodesDialog.fontSize,
                      },
                      cyRef
                    );
                  }}
                />

                <div className="flex flex-nowrap justify-content-between align-items-end align-content-center w-full mt-1">
                  <div className="w-4">
                    <label htmlFor="" className="text-xs">
                      Horizontal Align
                    </label>
                    <Dropdown
                      className="w-full"
                      options={textHAlignOptions}
                      value={manyNodesDialog.textHAlign}
                      onChange={(e) =>
                        setManyNodesDialog(
                          (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                            ...prev,
                            textHAlign: e.value,
                          })
                        )
                      }
                    />
                  </div>
                  <div className="w-4">
                    <label htmlFor="" className="text-xs">
                      Vertical Align
                    </label>
                    <Dropdown
                      className="w-full"
                      options={textVAlignOptions}
                      value={manyNodesDialog.textVAlign}
                      onChange={(e) =>
                        setManyNodesDialog(
                          (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                            ...prev,
                            textVAlign: e.value,
                          })
                        )
                      }
                    />
                  </div>
                  <div className="w-2">
                    <Button
                      type="submit"
                      className="p-button-square p-button-success p-button-outlined w-full"
                      icon="pi pi-save"
                      iconPos="right"
                      onClick={() => {
                        if (!cyRef) return;
                        updateManyNodesFunction(
                          {
                            textVAlign: manyNodesDialog.textVAlign,
                            textHAlign: manyNodesDialog.textHAlign,
                            fontSize: manyNodesDialog.fontSize,
                          },
                          cyRef
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-wrap justify-content-between align-items-end">
            <div className="w-full flex flex-wrap justify-content-between my-1">
              <label className="w-full text-sm">Node Shape</label>
              <Dropdown
                options={boardNodeShapes}
                className="w-9"
                placeholder="Node Shape"
                filter
                value={manyNodesDialog.type}
                onChange={(e) =>
                  setManyNodesDialog(
                    (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                      ...prev,
                      type: e.value,
                    })
                  )
                }
              />
              <Button
                type="submit"
                className="p-button-square p-button-success p-button-outlined w-2"
                icon="pi pi-save"
                iconPos="right"
                onClick={() => {
                  if (!cyRef) return;
                  updateManyNodesFunction(
                    {
                      type: manyNodesDialog.type,
                      fontSize: manyNodesDialog.fontSize,
                    },
                    cyRef
                  );
                }}
              />
            </div>
            <div className="w-4">
              <div className="">Width</div>
              <InputNumber
                inputClassName="w-full"
                showButtons
                min={10}
                max={5000}
                step={10}
                value={manyNodesDialog.width}
                onChange={(e) =>
                  setManyNodesDialog(
                    (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                      ...prev,
                      width: e.value as number,
                    })
                  )
                }
              />
            </div>
            <div className="w-4">
              <div className="">Height</div>
              <InputNumber
                inputClassName="w-full"
                showButtons
                min={10}
                max={5000}
                step={10}
                value={manyNodesDialog.height}
                onChange={(e) =>
                  setManyNodesDialog(
                    (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                      ...prev,
                      height: e.value as number,
                    })
                  )
                }
              />
            </div>
            <div className="w-2">
              <Button
                type="submit"
                className="p-button-square p-button-success p-button-outlined w-full"
                icon="pi pi-save"
                iconPos="right"
                onClick={() => {
                  if (!cyRef) return;
                  updateManyNodesFunction(
                    {
                      width: manyNodesDialog.width,
                      height: manyNodesDialog.height,
                      fontSize: manyNodesDialog.fontSize,
                    },
                    cyRef
                  );
                }}
              />
            </div>
          </div>
          <div className="w-full my-1 flex flex-wrap justify-content-between">
            <label className="w-full text-sm">Linked Document</label>
            <Dropdown
              className="w-9"
              placeholder="Link Document"
              value={manyNodesDialog.doc_id}
              filter
              emptyFilterMessage="No documents found"
              onChange={(e) => {
                setManyNodesDialog(
                  (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                    ...prev,
                    doc_id: e.value,
                  })
                );
              }}
              options={
                documents.data
                  ? [
                      { title: "No document", id: null },
                      ...documents.data.filter(
                        (doc) => !doc.template && !doc.folder
                      ),
                    ]
                  : []
              }
              optionLabel={"title"}
              optionValue={"id"}
            />
            <Button
              type="submit"
              className="p-button-square p-button-success p-button-outlined w-2"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!cyRef) return;
                updateManyNodesFunction(
                  {
                    doc_id: manyNodesDialog.doc_id,
                    fontSize: manyNodesDialog.fontSize,
                  },
                  cyRef
                );
              }}
            />
          </div>
          <div className="w-full my-1 flex flex-wrap justify-content-between">
            <label className="w-full text-sm">Custom Image</label>
            <div className="text-xs">
              Note: Custom images override images from linked documents.
            </div>
            <Dropdown
              filter
              filterBy="title"
              className="w-9"
              placeholder="Custom Image"
              optionLabel="title"
              virtualScrollerOptions={{ itemSize: 38 }}
              itemTemplate={(item: ImageProps) => (
                <ImgDropdownItem title={item.title} link={item.link} />
              )}
              options={
                images?.data
                  ? [
                      { title: "No image", id: null },
                      ...images?.data.filter((image) => image.type === "Image"),
                    ]
                  : []
              }
              value={manyNodesDialog.customImage}
              onChange={(e) =>
                setManyNodesDialog(
                  (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                    ...prev,
                    customImage: e.value,
                  })
                )
              }
            />
            <Button
              type="submit"
              className="p-button-square p-button-success p-button-outlined w-2"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!cyRef) return;
                updateManyNodesFunction(
                  {
                    doc_id: manyNodesDialog.doc_id,
                    fontSize: manyNodesDialog.fontSize,
                  },
                  cyRef
                );
              }}
            />
          </div>
          <div className="w-full my-2 flex flex-wrap justify-content-between">
            <div className="w-full flex flex-wrap">
              <label className="w-full text-sm">Node Level</label>
              <span className="w-full text-xs">
                Changes if node is above or below others
              </span>
            </div>
            <InputNumber
              className="w-9"
              value={manyNodesDialog.zIndex}
              onChange={(e) =>
                setManyNodesDialog(
                  (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                    ...prev,
                    zIndex: e.value as number,
                  })
                )
              }
              showButtons
            />
            <Button
              type="submit"
              className="p-button-square p-button-success p-button-outlined w-2"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!cyRef) return;
                updateManyNodesFunction(
                  {
                    zIndex: manyNodesDialog.zIndex,
                    fontSize: manyNodesDialog.fontSize,
                  },
                  cyRef
                );
              }}
            />
          </div>
          <div className="w-full flex flex-nowrap justify-content-between align-items-end my-1">
            <div className="w-4">
              <label className="w-full text-sm">Background Color</label>
              <div className="flex align-items-center flex-row-reverse">
                <InputText
                  value={manyNodesDialog.backgroundColor}
                  className="w-full ml-2"
                  onChange={(e) =>
                    setManyNodesDialog(
                      (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                        ...prev,
                        backgroundColor: e.target.value,
                      })
                    )
                  }
                />
                <ColorPicker
                  value={manyNodesDialog.backgroundColor}
                  onChange={(e) =>
                    setManyNodesDialog(
                      (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                        ...prev,
                        backgroundColor: e.value as string,
                      })
                    )
                  }
                />
              </div>
            </div>
            <div className="w-5 flex flex-wrap">
              <label className="w-full text-sm">Background Opacity</label>
              <InputNumber
                showButtons
                mode="decimal"
                min={0}
                step={0.01}
                max={1}
                value={manyNodesDialog.backgroundOpacity}
                className="ml-1"
                inputClassName="w-full"
                onChange={(e) =>
                  setManyNodesDialog(
                    (prev: Omit<NodeUpdateDialogProps, "id">) => ({
                      ...prev,
                      backgroundOpacity: e.value as number,
                    })
                  )
                }
              />
            </div>
            <Button
              type="submit"
              className="p-button-square p-button-success p-button-outlined w-2"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!cyRef) return;
                updateManyNodesFunction(
                  {
                    backgroundColor:
                      "#" + manyNodesDialog.backgroundColor.replaceAll("#", ""),
                    backgroundOpacity: manyNodesDialog.backgroundOpacity,
                    fontSize: manyNodesDialog.fontSize,
                  },
                  cyRef
                );
              }}
            />
          </div>
        </Dialog>
      </>

      <span>
        <Tooltip
          target={".lockSelected"}
          content="Lock selected nodes"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".unlockSelected"}
          content="Unlock selected nodes"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".deleteSelected"}
          content="Delete selected elements"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".drawMode"}
          content="Toggle Draw Mode"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".saveButton"}
          content="Save Board"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".searchButton"}
          content="Search Board"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".resetColors"}
          content="Reset selected to default color"
          position="top"
          autoHide={true}
        />
        <Tooltip
          target={".editSelectedElements"}
          content="Edit selected elements"
          position="top"
          autoHide={true}
        />

        <Tooltip
          target={".colorPresets"}
          position="top"
          autoHide={false}
          hideEvent="focus"
        >
          <div className="flex flex-wrap w-10rem">
            {nodeColorPresets.map((color) => (
              <div
                key={color}
                className="w-1rem h-1rem border-rounded cursor-pointer"
                style={{
                  backgroundColor: `#${color}`,
                }}
                onClick={() => {
                  updateColor(
                    cyRef,
                    `#${color}`,
                    board_id as string,
                    updateNodeMutation,
                    updateEdgeMutation
                  );
                }}
              ></div>
            ))}
          </div>
        </Tooltip>
        <Tooltip
          target={".pickColor"}
          content="Pick color for selected elements"
          position="top"
        />
      </span>
      {/* Lock selected elements button */}
      <i
        className="pi pi-fw pi-lock cursor-pointer hover:text-blue-300 lockSelected"
        onClick={() => changeLockState(cyRef, true)}
      ></i>
      {/* Unlock selected elements button */}
      <i
        className="pi pi-fw pi-lock-open cursor-pointer hover:text-blue-300 unlockSelected"
        onClick={() => changeLockState(cyRef, false)}
      ></i>
      {/* Delete selected elements button */}
      <i
        className="pi pi-fw pi-trash cursor-pointer hover:text-blue-300 deleteSelected"
        onClick={() => {
          if (!cyRef) return;
          if (cyRef.current.elements(":selected")?.length > 0) {
            cyRef.current.elements(":selected").forEach((el: any) => {
              if (el.isNode()) {
                deleteNodeMutation.mutate({
                  id: el.data().id,
                  board_id: board_id as string,
                });
              } else {
                deleteEdgeMutation.mutate({
                  id: el.data().id,
                  board_id: board_id as string,
                });
              }
            });
          } else {
            toastWarn("No elements are selected.");
          }
        }}
      ></i>

      {/* Drawmode button */}
      <i
        className={`pi pi-pencil cursor-pointer hover:text-blue-300 ${
          drawMode ? "text-green-500" : ""
        } drawMode`}
        onClick={() => {
          setDrawMode((prev: boolean) => {
            if (!ehRef || !cyRef) return prev;
            if (prev && ehRef.current) {
              ehRef.current.disable();
              ehRef.current.disableDrawMode();
              cyRef.current.autoungrabify(false);
              cyRef.current.autounselectify(false);
              cyRef.current.autolock(false);
              cyRef.current.zoomingEnabled(true);
              cyRef.current.userZoomingEnabled(true);
              cyRef.current.panningEnabled(true);
              setDrawMode(false);
            } else {
              ehRef.current.enable();
              ehRef.current.enableDrawMode();
              setDrawMode(true);
            }
            return !prev;
          });
        }}
      ></i>
      {/* Save button */}
      <i
        className="pi pi-save cursor-pointer hover:text-blue-300 saveButton"
        onClick={() => {
          setExportDialog({ ...exportDialog, show: true });
        }}
      ></i>
      {/* Search button */}
      <i
        className="pi pi-search cursor-pointer hover:text-blue-300 searchButton"
        onClick={() => setSearchDialog((prev) => !prev)}
      ></i>

      {/* Reset to default color button */}
      <span
        className="cursor-pointer flex hover:text-blue-300 resetColors"
        onClick={() =>
          updateColor(
            cyRef,
            "#595959",
            board_id as string,
            updateNodeMutation,
            updateEdgeMutation
          )
        }
      >
        <Icon icon="mdi:invert-colors-off" fontSize={20} />
      </span>
      {/* Edit selected button */}
      <span
        className="cursor-pointer flex hover:text-blue-300 editSelectedElements"
        onClick={() => {
          if (!cyRef) return;
          if (cyRef.current.elements(":selected")?.length > 0) {
            setManyNodesDialog({ ...NodeUpdateDialogDefault, show: true });
          } else {
            toastWarn("No elements are selected.");
          }
        }}
      >
        <Icon icon="mdi:vector-polyline-edit" />
      </span>
      {/* Color preset button */}
      <i className="pi pi-fw pi-palette cursor-pointer hover:text-blue-300 colorPresets"></i>
      {/* Color picker square */}
      <ColorPicker
        onChange={(e) => {
          debouncedColorPick(e.target.value);
        }}
        className="w-2rem h-2rem"
        defaultColor="595959"
      ></ColorPicker>
    </div>
  );
}
