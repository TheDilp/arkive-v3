import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import {
  Dispatch,
  KeyboardEvent,
  KeyboardEventHandler,
  SetStateAction,
  useState,
} from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { ImageProps } from "../../custom-types";
import {
  BoardNodeType,
  BoardType,
  NodeUpdateDialogType,
} from "../../types/BoardTypes";
import {
  BoardFontSizes,
  boardNodeShapes,
  BoardFontFamilies,
  textHAlignOptions,
  textVAlignOptions,
} from "../../utils/boardUtils";
import {
  useGetBoardData,
  useGetDocuments,
  useGetImages,
  useUpdateNode,
} from "../../utils/customHooks";
import { NodeUpdateDialogDefault } from "../../utils/defaultValues";
import { toastSuccess } from "../../utils/utils";
import DialogLabel from "../Util/DialogLabel";
import ImgDropdownItem from "../Util/ImgDropdownItem";
type Props = {
  nodeUpdateDialog: NodeUpdateDialogType;
  setNodeUpdateDialog: Dispatch<SetStateAction<NodeUpdateDialogType>>;
};

export default function NodeUpdateDialog({
  nodeUpdateDialog,
  setNodeUpdateDialog,
}: Props) {
  const { project_id, board_id } = useParams();
  const queryClient = useQueryClient();
  const documents = useGetDocuments(project_id as string);
  const board = useGetBoardData(
    project_id as string,
    board_id as string,
    false
  );
  const images = useGetImages(project_id as string);
  const [selectedTemplate, setSelectedTemplate] =
    useState<BoardNodeType | null>(null);
  const updateNodeMutation = useUpdateNode(project_id as string);

  const handleEnter: KeyboardEventHandler = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const { show, ...rest } = nodeUpdateDialog;
      updateNodeMutation.mutate({
        ...rest,
        board_id: board_id as string,
      });
    }
  };

  function setTemplateStyle(templateStyle: BoardNodeType) {
    setSelectedTemplate(templateStyle);
    queryClient.setQueryData(
      `${project_id}-boards`,
      (oldData: BoardType[] | undefined) => {
        if (oldData) {
          let newData = oldData.map((board) => {
            if (board.id === board_id) {
              return {
                ...board,
                nodes: board.nodes.map((node) => {
                  if (node.id === nodeUpdateDialog.id) {
                    return {
                      ...node,
                      ...templateStyle,
                      id: node.id,
                      label: node.label,
                      document: node.document,
                      customImage: node.customImage,
                      template: node.template,
                    };
                  }
                  return node;
                }),
              };
            }
            return board;
          });
          return newData;
        } else {
          return [];
        }
      }
    );
  }

  function resetTemplateStyle() {
    setSelectedTemplate(null);
    queryClient.setQueryData(
      `${project_id}-boards`,
      (oldData: BoardType[] | undefined) => {
        if (oldData) {
          return oldData.map((board) => {
            if (board.id === board_id) {
              return {
                ...board,
                nodes: board.nodes.map((node) => {
                  if (node.id === nodeUpdateDialog.id) {
                    node = {
                      ...node,
                      ...nodeUpdateDialog,
                    };
                  }
                  return node;
                }),
              };
            }
            return board;
          });
        } else {
          return [];
        }
      }
    );
  }

  return (
    <Dialog
      header={`Update ${
        typeof nodeUpdateDialog.id === "string" ? "Node" : "Many Nodes"
      } ${
        typeof nodeUpdateDialog.id === "string"
          ? nodeUpdateDialog.label
          : "" || ""
      }`}
      style={{
        width: "24.75vw",
        height: "27rem",
      }}
      visible={nodeUpdateDialog.show}
      modal={false}
      position={"bottom-left"}
      onHide={() => {
        if (selectedTemplate) resetTemplateStyle();
        setNodeUpdateDialog(NodeUpdateDialogDefault);
      }}
    >
      <div className="h-full flex flex-column justify-content-between">
        <TabView className="w-full">
          <TabPanel header="Node Label">
            <div className="w-full flex flex-nowrap">
              <div className="w-full flex flex-wrap  my-1">
                <div className="w-full flex flex-wrap justify-content-between align-items-center">
                  {/* Label text */}

                  <div className="w-full flex flex-wrap">
                    <DialogLabel text="Node Label" />

                    <InputText
                      value={nodeUpdateDialog.label}
                      onChange={(e) =>
                        setNodeUpdateDialog((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                      onKeyDown={handleEnter}
                      placeholder="Node Label"
                      className="w-full"
                      autoComplete="false"
                    />
                  </div>
                  {/* Label size */}

                  {/* Font Family */}

                  <div className="w-4 flex flex-wrap">
                    <DialogLabel text="Font Family" />
                    <Dropdown
                      className="w-full"
                      options={BoardFontFamilies}
                      value={nodeUpdateDialog.fontFamily}
                      onChange={(e) =>
                        setNodeUpdateDialog((prev) => ({
                          ...prev,
                          fontFamily: e.value,
                        }))
                      }
                    />
                  </div>
                  <div className="w-3 flex flex-wrap">
                    <DialogLabel text="Label Size" />
                    <Dropdown
                      className="w-full"
                      options={BoardFontSizes}
                      placeholder="Label Font Size"
                      value={nodeUpdateDialog.fontSize}
                      onChange={(e) =>
                        setNodeUpdateDialog((prev) => ({
                          ...prev,
                          fontSize: e.value,
                        }))
                      }
                    />
                  </div>
                  {/* Label color */}
                  <div className="w-4 flex flex-wrap justify-content-between align-items-center">
                    <DialogLabel text="Label Color" />
                    <InputText
                      className="w-8"
                      value={nodeUpdateDialog.fontColor}
                      onChange={(e) =>
                        setNodeUpdateDialog((prev) => ({
                          ...prev,
                          fontColor: e.target.value,
                        }))
                      }
                      onKeyDown={handleEnter}
                    />
                    <ColorPicker
                      className="w-min"
                      value={nodeUpdateDialog.fontColor}
                      onChange={(e) =>
                        setNodeUpdateDialog((prev) => ({
                          ...prev,
                          fontColor: ("#" +
                            e.value?.toString().replaceAll("#", "")) as string,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-nowrap w-full mt-1">
                    <div className="w-6">
                      <DialogLabel text="Horizontal Align" />
                      <Dropdown
                        className="w-full"
                        options={textHAlignOptions}
                        value={nodeUpdateDialog.textHAlign}
                        onChange={(e) =>
                          setNodeUpdateDialog((prev) => ({
                            ...prev,
                            textHAlign: e.value,
                          }))
                        }
                      />
                    </div>
                    <div className="w-6">
                      <DialogLabel text="Vertical Align" />
                      <Dropdown
                        className="w-full"
                        options={textVAlignOptions}
                        value={nodeUpdateDialog.textVAlign}
                        onChange={(e) =>
                          setNodeUpdateDialog((prev) => ({
                            ...prev,
                            textVAlign: e.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Node Shape">
            <div className="w-full flex flex-wrap justify-content-between">
              <div className="w-full my-1">
                <DialogLabel text="Node Shape" />
                <Dropdown
                  options={boardNodeShapes}
                  className="w-full"
                  placeholder="Node Shape"
                  filter
                  value={nodeUpdateDialog.type}
                  onChange={(e) =>
                    setNodeUpdateDialog((prev) => ({
                      ...prev,
                      type: e.value,
                    }))
                  }
                />
              </div>
              <div className="w-5">
                <DialogLabel text="Width" />
                <InputNumber
                  inputClassName="w-full"
                  showButtons
                  min={10}
                  max={5000}
                  step={10}
                  value={nodeUpdateDialog.width}
                  onKeyDown={handleEnter}
                  onChange={(e) =>
                    setNodeUpdateDialog((prev) => ({
                      ...prev,
                      width: e.value as number,
                    }))
                  }
                />
              </div>
              <div className="w-5">
                <DialogLabel text="Height" />
                <InputNumber
                  inputClassName="w-full"
                  showButtons
                  min={10}
                  max={5000}
                  step={10}
                  value={nodeUpdateDialog.height}
                  onKeyDown={handleEnter}
                  onChange={(e) =>
                    setNodeUpdateDialog((prev) => ({
                      ...prev,
                      height: e.value as number,
                    }))
                  }
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Node Image">
            <div className="w-full my-1">
              <DialogLabel text="Linked Document" />
              <Dropdown
                className="w-full"
                placeholder="Link Document"
                value={nodeUpdateDialog.doc_id}
                filter
                emptyFilterMessage="No documents found"
                onChange={(e) => {
                  setNodeUpdateDialog((prev) => ({
                    ...prev,
                    doc_id: e.value,
                  }));
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
            </div>
            <div className="w-full my-1">
              <DialogLabel text="Custom Image" />
              <div className="text-xs text-gray-400">
                Note: Custom images override images from linked documents.
              </div>
              <Dropdown
                filter
                filterBy="title"
                className="w-full"
                placeholder="Custom Image"
                optionLabel="title"
                virtualScrollerOptions={{
                  lazy: true,
                  onLazyLoad: () => {},
                  itemSize: 50,
                  showLoader: true,
                  loading: images?.data.length === 0,
                  delay: 0,
                  loadingTemplate: (options) => {
                    return (
                      <div
                        className="flex align-items-center p-2"
                        style={{ height: "38px" }}
                      ></div>
                    );
                  },
                }}
                itemTemplate={(item: ImageProps) => (
                  <ImgDropdownItem title={item.title} link={item.link} />
                )}
                options={
                  images?.data
                    ? [
                        { title: "No image", id: null },
                        ...images?.data.filter(
                          (image) => image.type === "Image"
                        ),
                      ]
                    : []
                }
                value={nodeUpdateDialog.customImage}
                onChange={(e) =>
                  setNodeUpdateDialog((prev) => ({
                    ...prev,
                    customImage: e.value,
                  }))
                }
              />
            </div>
          </TabPanel>
          <TabPanel header="Misc">
            <div className="w-full mb-2">
              <div className="w-full flex flex-wrap">
                <DialogLabel text="Node Level" />
                <span className="w-full text-xs text-gray-400">
                  Changes if node is above or below others
                </span>
              </div>
              <InputNumber
                className="w-full"
                value={nodeUpdateDialog.zIndex}
                onKeyDown={handleEnter}
                onChange={(e) =>
                  setNodeUpdateDialog((prev) => ({
                    ...prev,
                    zIndex: e.value as number,
                  }))
                }
                showButtons
              />
            </div>
            <div className="w-full flex flex-nowrap my-1">
              <div className="w-4">
                <DialogLabel text="Background Color" />
                <div className="flex align-items-center flex-row-reverse">
                  <InputText
                    value={nodeUpdateDialog.backgroundColor}
                    className="w-full ml-2"
                    onKeyDown={handleEnter}
                    onChange={(e) =>
                      setNodeUpdateDialog((prev) => ({
                        ...prev,
                        backgroundColor: e.target.value,
                      }))
                    }
                  />
                  <ColorPicker
                    value={nodeUpdateDialog.backgroundColor}
                    onChange={(e) =>
                      setNodeUpdateDialog((prev) => ({
                        ...prev,
                        backgroundColor: ("#" +
                          e.value?.toString().replaceAll("#", "")) as string,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="w-8">
                <span className="pl-1">
                  <DialogLabel text="Background Opacity" />
                </span>
                <div className="flex align-items-center flex-row-reverse">
                  <InputNumber
                    showButtons
                    mode="decimal"
                    min={0}
                    step={0.01}
                    max={1}
                    value={nodeUpdateDialog.backgroundOpacity}
                    className="w-full ml-1"
                    onKeyDown={handleEnter}
                    onChange={(e) =>
                      setNodeUpdateDialog((prev) => ({
                        ...prev,
                        backgroundOpacity: e.value as number,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-wrap">
              <DialogLabel text="Template" />
              <Dropdown
                tooltip="Select template and save to save changes"
                onChange={(e) => {
                  if (e.value as NodeUpdateDialogType) {
                    setTemplateStyle(e.value);
                  } else {
                    resetTemplateStyle();
                  }
                }}
                value={nodeUpdateDialog.template}
                options={
                  board?.nodes
                    ? [
                        { label: "None", value: null },
                        ...board.nodes.filter((node) => node.template),
                      ]
                    : []
                }
              />
            </div>
          </TabPanel>
        </TabView>
        <div className="w-full flex justify-content-end">
          <label className=""></label>
          <Button
            label="Save Node"
            type="submit"
            className="p-button-outlined p-button-success"
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              if (selectedTemplate) {
                const {
                  id,
                  board_id,
                  template,
                  customImage,
                  document,
                  doc_id,
                  label,
                  ...restTemplate
                } = selectedTemplate;
                const { show, ...restDialog } = nodeUpdateDialog;

                updateNodeMutation.mutate({
                  ...restDialog,
                  ...restTemplate,
                  board_id: board_id as string,
                });
                setSelectedTemplate(null);
                toastSuccess("Template Applied");
              } else {
                const { show, ...rest } = nodeUpdateDialog;
                updateNodeMutation.mutate({
                  ...rest,
                  board_id: board_id as string,
                });
              }
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
