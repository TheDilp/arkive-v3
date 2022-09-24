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
} from "react";
import { useParams } from "react-router-dom";
import { ImageProps } from "../../custom-types";
import { NodeUpdateDialogProps } from "../../types/BoardTypes";
import {
  BoardFontSizes,
  boardNodeShapes,
  BoardFontFamilies,
  textHAlignOptions,
  textVAlignOptions,
} from "../../utils/boardUtils";
import {
  useGetDocuments,
  useGetImages,
  useUpdateNode,
} from "../../utils/customHooks";
import { NodeUpdateDialogDefault } from "../../utils/defaultValues";
import ImgDropdownItem from "../Util/ImgDropdownItem";
type Props = {
  nodeUpdateDialog: NodeUpdateDialogProps;
  setNodeUpdateDialog: Dispatch<SetStateAction<NodeUpdateDialogProps>>;
};

export default function NodeUpdateDialog({
  nodeUpdateDialog,
  setNodeUpdateDialog,
}: Props) {
  const { project_id, board_id } = useParams();

  const documents = useGetDocuments(project_id as string);
  const images = useGetImages(project_id as string);
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
      onHide={() => setNodeUpdateDialog(NodeUpdateDialogDefault)}
    >
      <div className="h-full flex flex-column justify-content-between">
        <TabView className="w-full">
          <TabPanel header="Node Label">
            <div className="w-full flex flex-nowrap">
              <div className="w-full flex flex-wrap  my-1">
                <div className="w-full flex flex-wrap justify-content-between align-items-center">
                  {/* Label text */}

                  <div className="w-full flex flex-wrap">
                    <label className="w-full text-sm text-gray-400">
                      Node Labels
                    </label>

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
                    <label htmlFor="" className="w-full text-sm text-gray-400">
                      Font Family
                    </label>
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
                    <label className="w-full text-sm text-gray-400">
                      Label Size
                    </label>
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
                    <label className="w-full text-sm text-gray-400">
                      Label Color
                    </label>
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
                      <label htmlFor="" className="text-sm text-gray-400">
                        Horizontal Align
                      </label>
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
                      <label htmlFor="" className="text-sm text-gray-400">
                        Vertical Align
                      </label>
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
                <label className="w-full text-sm text-gray-400">
                  Node Shape
                </label>
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
                <label className="text-sm text-gray-400">Width</label>
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
                <label className="text-sm text-gray-400">Height</label>
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
              <label className="w-full text-sm text-gray-400">
                Linked Document
              </label>
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
              <label className="w-full text-sm text-gray-400">
                Custom Image
              </label>
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
            <div className="w-full my-2">
              <div className="w-full flex flex-wrap">
                <label className="w-full text-sm text-gray-400">
                  Node Level
                </label>
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
                <label className="w-full text-sm text-gray-400">
                  Background Color
                </label>
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
                <label className="w-full text-sm text-gray-400 pl-1">
                  Background Opacity
                </label>
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
          </TabPanel>
        </TabView>
        <div className="w-full flex justify-content-end">
          <Button
            label="Save Node"
            type="submit"
            className="p-button-outlined p-button-success"
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              const { show, ...rest } = nodeUpdateDialog;
              updateNodeMutation.mutate({
                ...rest,
                board_id: board_id as string,
              });
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
