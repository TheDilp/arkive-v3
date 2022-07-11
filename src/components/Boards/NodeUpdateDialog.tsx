import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { ImageProps, NodeUpdateDialogProps } from "../../custom-types";
import {
  boardNodeFontSizes,
  boardNodeShapes,
  textHAlignOptions,
  textVAlignOptions,
} from "../../utils/boardUtils";
import {
  useGetDocuments,
  useGetImages,
  useUpdateNode,
} from "../../utils/customHooks";
import { NodeUpdateDialogDefault } from "../../utils/defaultDisplayValues";
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

  // Update the form data when a new node is opened

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
      }}
      visible={nodeUpdateDialog.show}
      modal={false}
      position={"bottom-left"}
      onHide={() => setNodeUpdateDialog(NodeUpdateDialogDefault)}
    >
      <div>
        <TabView className="w-full">
          <TabPanel header="Node Label">
            <div className="w-full flex flex-nowrap">
              <div className="w-full flex flex-wrap my-1">
                <label className="w-full text-sm">Node Label</label>
                <div className="w-full flex flex-wrap">
                  <InputText
                    value={nodeUpdateDialog.label}
                    onChange={(e) =>
                      setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="Node Label"
                    className="w-9"
                    autoComplete="false"
                  />
                  <Dropdown
                    className="w-3"
                    options={boardNodeFontSizes}
                    placeholder="Label Font Size"
                    value={nodeUpdateDialog.fontSize}
                    onChange={(e) =>
                      setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
                        ...prev,
                        fontSize: e.value,
                      }))
                    }
                  />
                  <div className="flex flex-nowrap w-full mt-1">
                    <div className="w-6">
                      <label htmlFor="" className="text-xs">
                        Horizontal Align
                      </label>
                      <Dropdown
                        className="w-full"
                        options={textHAlignOptions}
                        value={nodeUpdateDialog.textHAlign}
                        onChange={(e) =>
                          setNodeUpdateDialog(
                            (prev: NodeUpdateDialogProps) => ({
                              ...prev,
                              textHAlign: e.value,
                            })
                          )
                        }
                      />
                    </div>
                    <div className="w-6">
                      <label htmlFor="" className="text-xs">
                        Vertical Align
                      </label>
                      <Dropdown
                        className="w-full"
                        options={textVAlignOptions}
                        value={nodeUpdateDialog.textVAlign}
                        onChange={(e) =>
                          setNodeUpdateDialog(
                            (prev: NodeUpdateDialogProps) => ({
                              ...prev,
                              textVAlign: e.value,
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Node Shape">
            <div className="w-full flex flex-wrap">
              <div className="w-full my-1">
                <label className="w-full text-sm">Node Shape</label>
                <Dropdown
                  options={boardNodeShapes}
                  className="w-full"
                  placeholder="Node Shape"
                  filter
                  value={nodeUpdateDialog.type}
                  onChange={(e) =>
                    setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
                      ...prev,
                      type: e.value,
                    }))
                  }
                />
              </div>
              <div className="w-6">
                <div className="">Width</div>
                <InputNumber
                  inputClassName="w-full"
                  showButtons
                  min={10}
                  max={5000}
                  step={10}
                  value={nodeUpdateDialog.width}
                  onChange={(e) =>
                    setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
                      ...prev,
                      width: e.value as number,
                    }))
                  }
                />
              </div>
              <div className="w-6">
                <div className="">Height</div>
                <InputNumber
                  inputClassName="w-full"
                  showButtons
                  min={10}
                  max={5000}
                  step={10}
                  value={nodeUpdateDialog.height}
                  onChange={(e) =>
                    setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
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
              <label className="w-full text-sm">Linked Document</label>
              <Dropdown
                className="w-full"
                placeholder="Link Document"
                value={nodeUpdateDialog.doc_id}
                filter
                emptyFilterMessage="No documents found"
                onChange={(e) => {
                  setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
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
              <label className="w-full text-sm">Custom Image</label>
              <div className="text-xs">
                Note: Custom images override images from linked documents.
              </div>
              <Dropdown
                filter
                filterBy="title"
                className="w-full"
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
                        ...images?.data.filter(
                          (image) => image.type === "Image"
                        ),
                      ]
                    : []
                }
                value={nodeUpdateDialog.customImage}
                onChange={(e) =>
                  setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
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
                <label className="w-full text-sm">Node Level</label>
                <span className="w-full text-xs">
                  Changes if node is above or below others
                </span>
              </div>
              <InputNumber
                className="w-full"
                value={nodeUpdateDialog.zIndex}
                onChange={(e) =>
                  setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
                    ...prev,
                    zIndex: e.value as number,
                  }))
                }
                showButtons
              />
            </div>
            <div className="w-full flex flex-nowrap my-1">
              <div className="w-4">
                <label className="w-full text-sm">Background Color</label>
                <div className="flex align-items-center flex-row-reverse">
                  <InputText
                    value={nodeUpdateDialog.backgroundColor}
                    className="w-full ml-2"
                    onChange={(e) =>
                      setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
                        ...prev,
                        backgroundColor: e.target.value,
                      }))
                    }
                  />
                  <ColorPicker
                    value={nodeUpdateDialog.backgroundColor}
                    onChange={(e) =>
                      setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
                        ...prev,
                        backgroundColor: e.value as string,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="w-8">
                <label className="w-full text-sm">Background Opacity</label>
                <div className="flex align-items-center flex-row-reverse">
                  <InputNumber
                    showButtons
                    mode="decimal"
                    min={0}
                    step={0.01}
                    max={1}
                    value={nodeUpdateDialog.backgroundOpacity}
                    className="w-full ml-1"
                    onChange={(e) =>
                      setNodeUpdateDialog((prev: NodeUpdateDialogProps) => ({
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
