import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { KeyboardEventHandler, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllImages, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
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
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../../utils/toast";
import ColorInput from "../../ColorInput/ColorInput";
import { FontItemTemplate } from "../../Dropdown/FontItemTemplate";
import { ImageDropdownItem } from "../../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../Dropdown/ImageDropdownValue";
import Tags from "../../Tags/Tags";

export default function DrawerNodeContent() {
  const { project_id, item_id } = useParams();
  const queryClient = useQueryClient();

  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const documents: DocumentType[] | undefined = queryClient.getQueryData(["allItems", project_id as string, "documents"]);
  const { mutate: updateNodeMutation } = useUpdateSubItem(item_id as string, "nodes", "boards");
  const { data: images } = useGetAllImages(project_id as string);
  const [localItem, setLocalItem] = useState<NodeType | undefined>(drawer?.data as NodeType);
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const updateNode = () => {
    if (localItem) {
      if (changedData) {
        updateNodeMutation(
          { id: localItem.id, ...changedData },
          {
            onSuccess: () => {
              resetChanges();
              toaster("success", `Node ${localItem.label || ""} was successfully updated.`);
              if ("doc_id" in changedData)
                queryClient.setQueryData(["boards", item_id], (oldData: BoardType | undefined) => {
                  if (oldData)
                    return {
                      ...oldData,
                      nodes: oldData?.nodes.map((node) => {
                        if (node.id === localItem.id) {
                          const newDoc = queryClient
                            .getQueryData<DocumentType[]>(["allItems", project_id, "documents"])
                            ?.find((doc) => doc.id === changedData.doc_id);
                          return { ...node, document: newDoc };
                        }
                        return node;
                      }),
                    };
                  return oldData;
                });
            },
          },
        );
      } else {
        toaster("info", "No data was changed.");
      }
    }
  };

  const handleEnter: KeyboardEventHandler = (e: any) => {
    if (e.key === "Enter") updateNode();
  };

  useEffect(() => {
    if (drawer?.data) setLocalItem(drawer?.data as NodeType);
  }, [drawer?.data]);
  if (!localItem) {
    setDrawer(DefaultDrawer);
    return null;
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex w-full flex-col gap-y-2">
        <div className="flex w-full flex-col gap-y-2">
          <div className=" w-full">
            <span className="w-full text-sm text-zinc-400">Node shape</span>
            <Dropdown
              className="w-full"
              filter
              onChange={(e) => handleChange({ name: "type", value: e.value })}
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
                onChange={(e) => handleChange({ name: "width", value: e.value as number })}
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
                onChange={(e) => handleChange({ name: "height", value: e.value as number })}
                onKeyDown={handleEnter}
                showButtons
                step={10}
                value={localItem.height}
              />
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between">
            <span className="w-full text-sm text-zinc-400">Node color</span>
            <ColorInput color={localItem.backgroundColor} name="backgroundColor" onChange={handleChange} />
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
                onChange={(e) => handleChange({ name: "backgroundOpacity", value: e.value as number })}
                onKeyDown={handleEnter}
                showButtons
                step={0.01}
                value={localItem.backgroundOpacity}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-1 gap-y-2">
            {/* Label text */}
            <div className="flex w-full flex-wrap">
              <span className="w-full text-sm text-zinc-400">Node label</span>

              <InputText
                autoComplete="false"
                className="w-full"
                onChange={(e) => handleChange({ name: "label", value: e.target.value })}
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
                  onChange={(e) => handleChange({ name: "fontFamily", value: e.value })}
                  options={BoardFontFamilies}
                  value={localItem.fontFamily}
                  valueTemplate={FontItemTemplate}
                />
              </div>

              <div className="flex w-1/2 flex-col">
                <span className="w-full text-sm text-zinc-400">Label size</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => handleChange({ name: "fontSize", value: e.value })}
                  options={BoardFontSizes}
                  placeholder="Label Font Size"
                  value={localItem.fontSize}
                />
              </div>
            </div>
            {/* Label color */}
            <div className="flex w-full flex-wrap items-center justify-between">
              <span className="w-full text-sm text-zinc-400">Label color</span>
              <ColorInput color={localItem.fontColor} name="fontColor" onChange={handleChange} />
            </div>
            {/* Aligns */}
            <div className="flex w-full flex-nowrap gap-x-1">
              <div className="w-full">
                <span className="w-full text-sm text-zinc-400">Horizontal align</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => handleChange({ name: "textHAlign", value: e.value })}
                  options={textHAlignOptions}
                  value={localItem.textHAlign}
                />
              </div>
              <div className="w-full">
                <span className="w-full text-sm text-zinc-400">Vertical align</span>
                <Dropdown
                  className="w-full"
                  onChange={(e) => handleChange({ name: "textVAlign", value: e.value })}
                  options={textVAlignOptions}
                  value={localItem.textVAlign}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="my-2" />
        <div className="flex w-full flex-col gap-y-2">
          <div className="w-full">
            <span className="w-full text-sm text-zinc-400">Linked document</span>
            <Dropdown
              className="w-full"
              emptyFilterMessage="No documents found"
              filter
              onChange={(e) => handleChange({ name: "doc_id", value: e.value })}
              optionLabel="title"
              options={
                documents
                  ? [
                      { title: "No document", id: null },
                      ...(documents || []).filter((doc) => {
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
          <div className="flex w-full flex-col">
            <span className="w-full text-sm text-zinc-400">Custom image</span>
            <div className="text-xs text-gray-400">Note: Custom images override images of linked documents.</div>
            <Dropdown
              itemTemplate={ImageDropdownItem}
              onChange={(e) => handleChange({ name: "image", value: e.value === "None" ? null : e.value })}
              options={["None", ...(images || [])] || []}
              placeholder="Select image"
              value={localItem}
              valueTemplate={ImageDropdownValue({ image: localItem?.image })}
            />
          </div>
          <div className="mb-2 w-full">
            <span className="w-full text-sm text-zinc-400">Node level</span>
            <InputNumber
              className="w-full"
              onChange={(e) => handleChange({ name: "zIndex", value: e.value })}
              onKeyDown={handleEnter}
              showButtons
              tooltip="Changes if node is above or below others"
              tooltipOptions={{ position: "left" }}
              value={localItem.zIndex}
            />
          </div>
          <div className="mb-2 w-full">
            <Tags handleChange={handleChange} localItem={localItem} />
          </div>
        </div>
      </div>
      <Button
        className="p-button-outlined p-button-success"
        icon="pi pi-save"
        iconPos="right"
        label="Save Node"
        onClick={() => {
          updateNode();
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
  );
}
