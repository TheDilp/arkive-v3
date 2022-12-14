import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { KeyboardEventHandler, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllImages, useGetAllItems, useUpdateNodeEdge } from "../../../CRUD/ItemsCRUD";
import { useGetItem } from "../../../hooks/getItemHook";
import { BoardType, NodeType } from "../../../types/boardTypes";
import { DocumentType } from "../../../types/documentTypes";
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

function FontItemTemplate(item: { label: string; value: string }) {
  return <div style={{ fontFamily: item.value }}>{item.label}</div>;
}

export default function DrawerNodeContent({}: Props) {
  const { project_id, item_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const updateNodeMutation = useUpdateNodeEdge(project_id as string, item_id as string, "nodes");
  const { data: documents } = useGetAllItems(project_id as string, "documents");
  const { data: images } = useGetAllImages(project_id as string);
  const board = useGetItem(project_id as string, item_id as string, "boards") as BoardType;
  //   const [selectedTemplate, setSelectedTemplate] = useState<NodeType | null>(null);
  //   const updateNodeMutation = useUpdateNode(project_id as string);
  const [localItem, setLocalItem] = useState<NodeType | undefined>(drawer?.data as NodeType);
  const handleEnter: KeyboardEventHandler = (e: any) => {
    if (e.key === "Enter" && localItem) updateNodeMutation.mutate(localItem);
  };

  useEffect(() => {
    if (drawer?.data) setLocalItem(drawer?.data);
  }, [drawer?.data]);
  if (!localItem) {
    setDrawer(DefaultDrawer);
    return null;
  }
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex w-full flex-col">
        <div className="my-1 flex w-full flex-wrap">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-1 gap-y-2">
            {/* Label text */}

            <div className="flex w-full flex-wrap">
              <span className="w-full text-sm text-zinc-400">Node label</span>

              <InputText
                autoComplete="false"
                className="w-full"
                onChange={(e) => {
                  setLocalItem({ ...localItem, label: e.target.value });
                }}
                onKeyDown={handleEnter}
                placeholder="Node Label"
                value={localItem.label}
              />
            </div>

            {/* Label font & size */}

            <div className="flex w-full flex-nowrap gap-x-1">
              <div className="flex w-1/2 flex-col">
                <span className="w-full text-sm text-zinc-400">Label Font</span>
                <Dropdown
                  className="w-full"
                  itemTemplate={FontItemTemplate}
                  onChange={(e) => {
                    setLocalItem({ ...localItem, fontFamily: e.value });
                  }}
                  options={BoardFontFamilies}
                  value={localItem.fontFamily}
                  valueTemplate={FontItemTemplate}
                />
              </div>

              <div className="flex w-1/2 flex-col">
                <span className="w-full text-sm text-zinc-400">Label size</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => setLocalItem({ ...localItem, fontSize: e.value })}
                  options={BoardFontSizes}
                  placeholder="Label Font Size"
                  value={localItem.fontSize}
                />
              </div>
            </div>

            {/* Label color */}
            <div className="flex w-full flex-wrap items-center justify-between">
              <span className="w-full text-sm text-zinc-400">Label color</span>
              <ColorPicker
                onChange={(e) => setLocalItem({ ...localItem, fontColor: `#${e.value}` as string })}
                value={localItem.fontColor}
              />
              <InputText
                onChange={(e) => setLocalItem({ ...localItem, fontColor: `#${e.value}` as string })}
                value={localItem.fontColor}
              />
            </div>

            {/* Aligns */}
            <div className="flex w-full flex-nowrap gap-x-1">
              <div className="w-full">
                <span className="w-full text-sm text-zinc-400">Horizontal align</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => setLocalItem({ ...localItem, textHAlign: e.value })}
                  options={textHAlignOptions}
                  value={localItem.textHAlign}
                />
              </div>
              <div className="w-full">
                <span className="w-full text-sm text-zinc-400">Vertical align</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => setLocalItem({ ...localItem, textHAlign: e.value })}
                  options={textVAlignOptions}
                  value={localItem.textVAlign}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="my-2" />
        <div className="flex w-full flex-col">
          <div className=" w-full">
            <span className="w-full text-sm text-zinc-400">Node shape</span>
            <Dropdown
              className="w-full"
              filter
              onChange={(e) => setLocalItem({ ...localItem, type: e.value })}
              options={boardNodeShapes}
              placeholder="Node Shape"
              value={localItem.type}
            />
          </div>
          <div className="flex flex-nowrap gap-x-1 gap-y-2">
            <div className="w-full">
              <span className="w-full text-sm text-zinc-400">Width</span>
              <InputNumber
                inputClassName="w-full"
                max={5000}
                min={10}
                onChange={(e) => setLocalItem({ ...localItem, width: e.value as number })}
                onKeyDown={handleEnter}
                showButtons
                step={10}
                value={localItem.width}
              />
            </div>
            <div className="w-full">
              <span className="w-full text-sm text-zinc-400">Height</span>
              <InputNumber
                inputClassName="w-full"
                max={5000}
                min={10}
                onChange={(e) => setLocalItem({ ...localItem, height: e.value as number })}
                onKeyDown={handleEnter}
                showButtons
                step={10}
                value={localItem.height}
              />
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between">
            <span className="w-full text-sm text-zinc-400">Node color</span>
            <ColorPicker
              onChange={(e) => setLocalItem({ ...localItem, backgroundColor: `#${e.value}` as string })}
              value={localItem.backgroundColor}
            />
            <InputText
              onChange={(e) => setLocalItem({ ...localItem, backgroundColor: `#${e.target.value}` as string })}
              value={localItem.backgroundColor}
            />
          </div>
          <div className="w-full">
            <span className="pl-1">
              <span className="w-full text-sm text-zinc-400">Background opacity</span>
            </span>
            <div className="flex flex-row-reverse items-center">
              <InputNumber
                className="ml-1 w-full"
                max={1}
                min={0}
                mode="decimal"
                onChange={(e) => setLocalItem({ ...localItem, backgroundOpacity: e.value as number })}
                onKeyDown={handleEnter}
                showButtons
                step={0.01}
                value={localItem.backgroundOpacity}
              />
            </div>
          </div>
          <div className="w-full">
            <span className="w-full text-sm text-zinc-400">Linked document</span>
            <Dropdown
              className="w-full"
              emptyFilterMessage="No documents found"
              filter
              onChange={(e) => setLocalItem({ ...localItem, doc_id: e.value })}
              optionLabel="title"
              options={
                documents
                  ? [
                      { title: "No document", id: null },
                      ...documents.filter((doc) => {
                        if ("template" in doc) return !doc.template && !doc.folder;
                        return false;
                      }),
                    ]
                  : []
              }
              optionValue="id"
              placeholder="Link Document"
              value={localItem.doc_id}
            />
          </div>
          {/* <div className="flex w-full flex-wrap">
                <span className="w-full text-sm text-zinc-400">Template</span>
                <Dropdown
                  className="w-full"
                  disabled={localItem.template}
                  options={
                    board?.nodes
                      ? [
                          {
                            label: "Default Node Appearance",
                            value: DefaultNode,
                          },
                          ...board.nodes.filter((node) => node.template),
                        ]
                      : []
                  }
                  tooltip="Select template and save (this overrides any custom data)"
                  optionLabel="label"
                  onChange={(e) => {
                    if (e.value as NodeType) {
                      setSelectedTemplate(e.value);
                      setTemplateStyle(queryClient, e.value, project_id as string, board_id as string, localItem.id);
                    } else {
                      setSelectedTemplate(null);
                      resetTemplateStyle(queryClient, project_id as string, board_id as string, localItem);
                    }
                  }}
                  tooltipOptions={{
                    position: "left",
                  }}
                  value={selectedTemplate}
                />
              </div> */}
          <div className="w-full">
            <span className="w-full text-sm text-zinc-400">Custom image</span>
            <Dropdown
              className="w-full"
              filter
              filterBy="title"
              itemTemplate={(item: ImageProps) => <ImageDropdownItem image={item} />}
              onChange={(e) =>
                setLocalItem((prev) => ({
                  ...prev,
                  customImage: e.value,
                }))
              }
              optionLabel="title"
              tooltipOptions={{
                position: "left",
              }}
              //   virtualScrollerOptions={virtualScrollerSettings}
              options={images ? [{ title: "No image", id: null }, images] : []}
              placeholder="Custom Image"
              tooltip="Custom images override images from linked documents."
              value={localItem.customImage}
            />
          </div>
          <div className="mb-2 w-full">
            <span className="w-full text-sm text-zinc-400">Node level</span>
            <InputNumber
              className="w-full"
              onChange={(e) =>
                setLocalItem({
                  ...localItem,
                  zIndex: e.value as number,
                })
              }
              onKeyDown={handleEnter}
              showButtons
              tooltip="Changes if node is above or below others"
              tooltipOptions={{ position: "left" }}
              value={localItem.zIndex}
            />
          </div>
        </div>
      </div>
      <div className="justify-content-end flex w-full">
        <Button
          className="p-button-outlined p-button-success"
          icon="pi pi-save"
          iconPos="right"
          label="Save Node"
          onClick={() => {
            updateNodeMutation.mutate(localItem);
            // if (selectedTemplate) {
            //   //   const { id, template, document, x, y, label, ...restTemplate } = selectedTemplate;
            //   //   const { show, ...restDialog } = localItem;
            //   //   updateNodeMutation.mutate({
            //   //     ...restDialog,
            //   //     ...restTemplate,
            //   //     board_id: board_id as string,
            //   //   });
            //   //   setSelectedTemplate(null);
            //   //   toastSuccess("Template Applied");
            //   // } else {

            //   setSelectedTemplate(null);
            // }
          }}
          type="submit"
        />
      </div>
    </div>
  );
}
