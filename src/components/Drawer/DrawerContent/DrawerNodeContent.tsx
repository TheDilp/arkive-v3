import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllItems } from "../../../CRUD/ItemsCRUD";
import { NodeType } from "../../../types/boardTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import {
  BoardFontFamilies,
  BoardFontSizes,
  boardNodeShapes,
  textHAlignOptions,
  textVAlignOptions,
} from "../../../utils/boardUtils";
import { DefaultNode } from "../../../utils/DefaultValues/BoardDefaults";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { ImageDropdownItem } from "../../Dropdown/ImageDropdownItem";

type Props = {};

export default function DrawerNodeContent({}: Props) {
  const { project_id, board_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const queryClient = useQueryClient();
  const documents = useGetAllItems(project_id as string, "documents");
  //   const board = useGetBoardData(project_id as string, board_id as string, false);
  //   const images = useGetImages(project_id as string);
  const [selectedTemplate, setSelectedTemplate] = useState<NodeType | null>(null);
  //   const updateNodeMutation = useUpdateNode(project_id as string);
  const [localItem, setLocalItem] = useState<NodeType | undefined>(drawer?.data as NodeType);
  //   const handleEnter: KeyboardEventHandler = (e: KeyboardEvent) => {
  //     if (e.key === "Enter") {
  //       const { show, ...rest } = localItem;
  //       updateNodeMutation.mutate({
  //         ...rest,
  //         board_id: board_id as string,
  //       });
  //     }
  //   };
  if (!localItem) {
    setDrawer(DefaultDrawer);
    return null;
  }
  return (
    <div className="flex h-full flex-col justify-between">
      <TabView className="w-full">
        <TabPanel header="Node Label">
          <div className="flex w-full flex-nowrap">
            <div className="my-1 flex w-full flex-wrap">
              <div className="flex w-full flex-wrap items-center justify-between gap-x-1 gap-y-2">
                {/* Label text */}

                <div className="flex w-full flex-wrap">
                  <span className="w-full text-sm text-zinc-400">Node label</span>

                  <InputText
                    autoComplete="false"
                    onChange={
                      (e) => {}
                      //   setLocalItem((prev) => ({
                      //     ...prev,
                      //     label: e.target.value,
                      //   }))
                    }
                    // onKeyDown={handleEnter}
                    className="w-full"
                    placeholder="Node Label"
                    value={localItem.label}
                  />
                </div>

                {/* Font Family */}

                <div className="flex w-fit flex-wrap">
                  <span className="w-full text-sm text-zinc-400">Node Font</span>
                  <Dropdown
                    className="w-full"
                    onChange={(e) => {
                      setLocalItem((prev) => {
                        if (prev)
                          return {
                            ...prev,
                            fontFamily: e.value,
                          };
                      });
                    }}
                    options={BoardFontFamilies}
                    value={localItem.fontFamily}
                  />
                </div>
                {/* Label size */}

                <div className="flex w-min flex-wrap">
                  <span className="w-full text-sm text-zinc-400">Label size</span>
                  <Dropdown
                    className="w-full"
                    onChange={(e) =>
                      setLocalItem((prev) => {
                        if (prev)
                          return {
                            ...prev,
                            fontSize: e.value,
                          };
                      })
                    }
                    options={BoardFontSizes}
                    placeholder="Label Font Size"
                    value={localItem.fontSize}
                  />
                </div>
                {/* Label color */}
                <div className="flex w-full flex-wrap items-center justify-between">
                  <span className="w-full text-sm text-zinc-400">Label color</span>
                  <ColorPicker
                    onChange={(e) =>
                      setLocalItem((prev) => {
                        if (prev) return { ...prev, defaultNodeColor: `#${e.value}` as string };
                        return undefined;
                      })
                    }
                    value={localItem.fontColor}
                  />
                  <InputText
                    onChange={(e) =>
                      setLocalItem((prev) => {
                        if (prev) return { ...prev, defaultNodeColor: e.target.value };

                        return undefined;
                      })
                    }
                    value={localItem.fontColor}
                  />
                </div>

                <div className="mt-1 flex w-full flex-nowrap">
                  <div className="w-1/2">
                    <span className="w-full text-sm text-zinc-400">Horizontal align</span>
                    <Dropdown
                      className="w-full"
                      options={textHAlignOptions}
                      value={localItem.textHAlign}
                      onChange={(e) => {}}
                      // setLocalItem((prev) => ({
                      //   ...prev,
                      //   textHAlign: e.value,
                      // }))
                    />
                  </div>
                  <div className="w-1/2">
                    <span className="w-full text-sm text-zinc-400">Vertical align</span>
                    <Dropdown
                      className="w-full"
                      options={textVAlignOptions}
                      value={localItem.textVAlign}
                      //   onChange={(e) =>
                      //     setLocalItem((prev) => ({
                      //       ...prev,
                      //       textVAlign: e.value,
                      //     }))
                      //   }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Node Shape">
          <div className="flex w-full flex-wrap justify-between">
            <div className="my-1 w-full">
              <span className="w-full text-sm text-zinc-400">Node shape</span>
              <Dropdown
                className="w-full"
                filter
                options={boardNodeShapes}
                placeholder="Node Shape"
                value={localItem.type}
                // onChange={(e) =>
                //   setLocalItem((prev) => ({
                //     ...prev,
                //     type: e.value,
                //   }))
                // }
              />
            </div>
            <div className="w-5">
              <span className="w-full text-sm text-zinc-400">Width</span>
              <InputNumber
                inputClassName="w-full"
                max={5000}
                min={10}
                showButtons
                step={10}
                value={localItem.width}
                // onKeyDown={handleEnter}
                // onChange={(e) =>
                //   setLocalItem((prev) => ({
                //     ...prev,
                //     width: e.value as number,
                //   }))
                // }
              />
            </div>
            <div className="w-5">
              <span className="w-full text-sm text-zinc-400">Height</span>
              <InputNumber
                inputClassName="w-full"
                max={5000}
                min={10}
                showButtons
                step={10}
                value={localItem.height}
                // onKeyDown={handleEnter}
                // onChange={(e) =>
                //   setLocalItem((prev) => ({
                //     ...prev,
                //     height: e.value as number,
                //   }))
                // }
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Node Image">
          <div className="my-1 w-full">
            <span className="w-full text-sm text-zinc-400">Linked document</span>
            <Dropdown
              className="w-full"
              filter
              optionLabel={"title"}
              optionValue={"id"}
              emptyFilterMessage="No documents found"
              //   onChange={(e) => {
              //     setLocalItem((prev) => ({
              //       ...prev,
              //       doc_id: e.value,
              //     }));
              //   }}
              //   options={
              //     documents.data
              //       ? [{ title: "No document", id: null }, ...documents.data.filter((doc) => !doc.template && !doc.folder)]
              //       : []
              //   }
              placeholder="Link Document"
              value={localItem.doc_id}
            />
          </div>
          <div className="my-1 w-full">
            <span className="w-full text-sm text-zinc-400">Custom image</span>
            <div className="text-xs text-zinc-400">Note: Custom images override images from linked documents.</div>
            {/* <Dropdown
              filter
              filterBy="title"
              className="w-full"
              placeholder="Custom Image"
              optionLabel="title"
              virtualScrollerOptions={virtualScrollerSettings}
            //   itemTemplate={(item: ImageProps) => <key ImageDropdownItem  image={item}/>}
            //   options={
            //     images?.data ? [{ title: "No image", id: null }, ...images?.data.filter((image) => image.type === "Image")] : []
            //   }
              value={localItem.customImage}
              onChange={(e) =>
                setLocalItem((prev) => ({
                  ...prev,
                  customImage: e.value,
                }))
              }
            /> */}
          </div>
        </TabPanel>
        <TabPanel header="Misc">
          <div className="mb-2 w-full">
            <div className="flex w-full flex-wrap">
              <span className="w-full text-sm text-zinc-400">Node level</span>
              <span className="w-full text-xs text-zinc-400">Changes if node is above or below others</span>
            </div>
            <InputNumber
              className="w-full"
              value={localItem.zIndex}
              //   onKeyDown={handleEnter}
              //   onChange={(e) =>
              //     setLocalItem((prev) => ({
              //       ...prev,
              //       zIndex: e.value as number,
              //     }))
              //   }
              showButtons
            />
          </div>
          <div className="my-1 flex w-full flex-nowrap">
            <div className="w-1/3">
              <span className="w-full text-sm text-zinc-400">Background color</span>
              <div className="flex flex-row-reverse items-center">
                <InputText
                  value={localItem.backgroundColor}
                  className="ml-2 w-full"
                  //   onKeyDown={handleEnter}
                  //   onChange={(e) =>
                  //     setLocalItem((prev) => ({
                  //       ...prev,
                  //       backgroundColor: e.target.value,
                  //     }))
                  //   }
                />
                <ColorPicker
                  value={localItem.backgroundColor}
                  //   onChange={(e) =>
                  //     setLocalItem((prev) => ({
                  //       ...prev,
                  //       backgroundColor: ("#" + e.value?.toString().replaceAll("#", "")) as string,
                  //     }))
                  //   }
                />
              </div>
            </div>
            <div className="w-2/3">
              <span className="pl-1">
                <span className="w-full text-sm text-zinc-400">Background opacity</span>
              </span>
              <div className="flex flex-row-reverse items-center">
                <InputNumber
                  max={1}
                  min={0}
                  mode="decimal"
                  showButtons
                  step={0.01}
                  value={localItem.backgroundOpacity}
                  className="ml-1 w-full"
                  //   onKeyDown={handleEnter}
                  //   onChange={(e) =>
                  //     setLocalItem((prev) => ({
                  //       ...prev,
                  //       backgroundOpacity: e.value as number,
                  //     }))
                  //   }
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-wrap">
            <span className="w-full text-sm text-zinc-400">Template</span>
            <Dropdown
              disabled={localItem.template}
              tooltip="Select template and save to save changes"
              optionLabel="label"
              //   onChange={(e) => {
              //     if (e.value as localItemType) {
              //       setSelectedTemplate(e.value);
              //       setTemplateStyle(queryClient, e.value, project_id as string, board_id as string, localItem.id);
              //     } else {
              //       setSelectedTemplate(null);
              //       resetTemplateStyle(queryClient, project_id as string, board_id as string, localItem);
              //     }
              //   }}
              value={selectedTemplate}
              //   options={
              //     board?.nodes
              //       ? [
              //           {
              //             label: "Default Node Appearance",
              //             value: localItemDefault,
              //           },
              //           ...board.nodes.filter((node) => node.template),
              //         ]
              //       : []
              //   }
            />
          </div>
        </TabPanel>
      </TabView>
      <div className="justify-content-end flex w-full">
        <Button
          className="p-button-outlined p-button-success"
          icon="pi pi-save"
          iconPos="right"
          label="Save Node"
          onClick={() => {
            if (selectedTemplate) {
              //   const { id, template, document, x, y, label, ...restTemplate } = selectedTemplate;
              //   const { show, ...restDialog } = localItem;
              //   updateNodeMutation.mutate({
              //     ...restDialog,
              //     ...restTemplate,
              //     board_id: board_id as string,
              //   });
              //   setSelectedTemplate(null);
              //   toastSuccess("Template Applied");
              // } else {
              //   const { show, ...rest } = localItem;
              //   updateNodeMutation.mutate({
              //     ...rest,
              //     // Second operator is for when the component is used in the BoardTree to update templates
              //     board_id: (board_id as string) || rest?.board_id,
              //   });
              //   setSelectedTemplate(null);
              // }
            }
          }}
          type="submit"
        />
      </div>
    </div>
  );
}
