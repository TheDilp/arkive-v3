import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllImages, useUpdateManySubItems } from "../../../CRUD/ItemsCRUD";
import { BoardType, NodeType } from "../../../types/ItemTypes/boardTypes";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { BoardReferenceAtom } from "../../../utils/Atoms/atoms";
import {
  BoardFontFamilies,
  BoardFontSizes,
  boardNodeShapes,
  textHAlignOptions,
  textVAlignOptions,
} from "../../../utils/boardUtils";
import { DefaultNode } from "../../../utils/DefaultValues/BoardDefaults";
import { toaster } from "../../../utils/toast";
import { virtualScrollerSettings } from "../../../utils/uiUtils";
import ColorInput from "../../ColorInput/ColorInput";
import { FontItemTemplate } from "../../Dropdown/FontItemTemplate";
import { ImageDropdownItem } from "../../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../Dropdown/ImageDropdownValue";

export default function DrawerManyNodesContent() {
  const { project_id, item_id } = useParams();
  const [localItem, setLocalItem] = useState<NodeType>(DefaultNode);
  const [boardRef] = useAtom(BoardReferenceAtom);
  const { mutate: manyNodesMutation } = useUpdateManySubItems(item_id as string, "nodes");
  const queryClient = useQueryClient();
  const updateManyNodes = (value: Partial<NodeType>) => {
    const nodes = boardRef?.nodes(":selected");
    const ids = nodes?.map((node) => node.id()) || [];
    if (ids && ids.length) {
      manyNodesMutation(
        { ids, data: value },
        {
          onSuccess: () => {
            toaster("success", "Nodes updated successfully.");
            if ("doc_id" in value) {
              queryClient.setQueryData(["boards", item_id], (oldData: BoardType | undefined) => {
                if (oldData)
                  return {
                    ...oldData,
                    nodes: oldData?.nodes.map((node) => {
                      if (ids.includes(node.id)) {
                        const newDoc = queryClient
                          .getQueryData<DocumentType[]>(["allItems", project_id, "documents"])
                          ?.find((doc) => doc.id === value.doc_id);
                        return { ...node, document: newDoc };
                      }
                      return node;
                    }),
                  };
                return oldData;
              });
            }
          },
        },
      );
    }
  };

  const documents: DocumentType[] | undefined = queryClient.getQueryData(["allItems", project_id, "documents"]);
  const { data: images } = useGetAllImages(project_id as string);

  return (
    <div className="flex w-full flex-col gap-y-2 overflow-y-auto pt-2">
      <span className="w-full text-center font-Lato text-xl font-bold text-white">Node Style</span>

      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Node Shape</span>
        <div className="flex w-full justify-between">
          <Dropdown
            className="w-4/5"
            filter
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                type: e.value,
              }))
            }
            options={boardNodeShapes}
            placeholder="Node Shape"
            value={localItem.type}
          />
          <Button
            className="p-button-square p-button-success p-button-outlined "
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              if (!boardRef) return;
              updateManyNodes({
                type: localItem.type,
              });
            }}
            type="submit"
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Width</span>
        <InputNumber
          max={5000}
          min={1}
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              width: e.value as number,
            }))
          }
          onKeyDown={(e) => {
            if (!boardRef) return;
            if (e.key === "Enter")
              updateManyNodes({
                width: localItem.width,
              });
          }}
          showButtons
          value={localItem.width}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined "
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              width: localItem.width,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Height</span>
        <InputNumber
          inputClassName="w-6rem"
          max={5000}
          min={1}
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              height: e.value as number,
            }))
          }
          onKeyDown={(e) => {
            if (!boardRef) return;
            if (e.key === "Enter")
              updateManyNodes({
                height: localItem.height,
              });
          }}
          showButtons
          value={localItem.height}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined "
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              height: localItem.height,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Node Color</span>

        <div className="flex w-4/5 flex-nowrap">
          <ColorInput
            color={localItem.backgroundColor}
            name="backgroundColor"
            onChange={({ name, value }) => setLocalItem((prev) => ({ ...prev, [name]: value }))}
            onEnter={() =>
              updateManyNodes({
                backgroundColor: localItem.backgroundColor,
              })
            }
          />
        </div>
        <Button
          className="p-button-square p-button-success p-button-outlined "
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              backgroundColor: localItem.backgroundColor,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Background Opacity</span>
        <div className="flex w-full flex-wrap justify-between">
          <InputNumber
            inputClassName="w-full"
            max={1}
            min={0}
            mode="decimal"
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                backgroundOpacity: e.value as number,
              }))
            }
            onKeyDown={(e) => {
              if (!boardRef) return;
              if (e.key === "Enter")
                updateManyNodes({
                  backgroundOpacity: localItem.backgroundOpacity,
                });
            }}
            showButtons
            step={0.01}
            value={localItem.backgroundOpacity}
          />
          <Button
            className="p-button-square p-button-success p-button-outlined "
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              if (!boardRef) return;
              updateManyNodes({
                backgroundOpacity: localItem.backgroundOpacity,
              });
            }}
            type="submit"
          />
        </div>
      </div>
      <hr className="border-zinc-700" />
      <span className="w-full text-center font-Lato text-xl font-bold text-white">Label Style</span>

      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Node Label</span>
        <InputText
          autoComplete="false"
          className="w-4/5"
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              label: e.target.value,
            }))
          }
          onKeyDown={(e) => {
            if (!boardRef) return;
            if (e.key === "Enter")
              updateManyNodes({
                label: localItem.label,
              });
          }}
          placeholder="Node Label"
          value={localItem.label}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined "
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              label: localItem.label,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="text-sm text-gray-400">Font Family</span>
        <div className="flex w-full justify-between">
          <Dropdown
            className="w-4/5"
            filter
            itemTemplate={FontItemTemplate}
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                fontFamily: e.value,
              }))
            }
            options={BoardFontFamilies}
            resetFilterOnHide
            value={localItem.fontFamily}
            valueTemplate={FontItemTemplate}
            virtualScrollerOptions={virtualScrollerSettings}
          />
          <Button
            className="p-button-square p-button-success p-button-outlined "
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              if (!boardRef) return;
              updateManyNodes({
                fontSize: localItem.fontSize,
              });
            }}
            type="submit"
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Label Font Size</span>
        <div className="flex w-full justify-between">
          <Dropdown
            className="w-4/5"
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                fontSize: e.value,
              }))
            }
            options={BoardFontSizes}
            placeholder="Label Font Size"
            value={localItem.fontSize}
          />

          <Button
            className="p-button-square p-button-success p-button-outlined "
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              if (!boardRef) return;
              updateManyNodes({
                fontSize: localItem.fontSize,
              });
            }}
            type="submit"
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Label Font Color</span>
        <div className="flex w-full justify-between">
          <div className="w-4/5">
            <ColorInput
              color={localItem.fontColor}
              name="fontColor"
              onChange={({ name, value }) => setLocalItem((prev) => ({ ...prev, [name]: value }))}
            />
          </div>
          <Button
            className="p-button-square p-button-success p-button-outlined "
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              if (!boardRef) return;
              updateManyNodes({
                fontColor: localItem.fontColor,
              });
            }}
            type="submit"
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="text-sm text-gray-400">Vertical Align</span>
        <div className="w-4/5">
          <Dropdown
            className="w-full"
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                textVAlign: e.value,
              }))
            }
            options={textVAlignOptions}
            value={localItem.textVAlign}
          />
        </div>

        <Button
          className="p-button-square p-button-success p-button-outlined w-full"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              textVAlign: localItem.textVAlign,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="text-sm text-gray-400">Horizontal Align</span>
        <div className="w-4/5">
          <Dropdown
            className="w-full"
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                textHAlign: e.value,
              }))
            }
            options={textHAlignOptions}
            value={localItem.textHAlign}
          />
        </div>

        <Button
          className="p-button-square p-button-success p-button-outlined w-full"
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              textHAlign: localItem.textHAlign,
            });
          }}
          type="submit"
        />
      </div>
      <hr className="border-zinc-700" />
      <span className="w-full text-center font-Lato text-xl font-bold text-white">Miscellaneous</span>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Linked Document</span>
        <Dropdown
          className="w-4/5"
          emptyFilterMessage="No documents found"
          filter
          onChange={(e) => {
            setLocalItem((prev) => ({
              ...prev,
              doc_id: e.value,
            }));
          }}
          optionLabel="title"
          options={
            documents ? [{ title: "No document", id: null }, ...documents.filter((doc) => !doc.template && !doc.folder)] : []
          }
          optionValue="id"
          placeholder="Link Document"
          value={localItem.doc_id}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined "
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              doc_id: localItem.doc_id,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Custom Image</span>
        <div className="text-xs text-gray-400">Note: Custom images override images of linked documents.</div>
        <Dropdown
          className="w-4/5"
          filter
          itemTemplate={ImageDropdownItem}
          onChange={(e) => setLocalItem((prev) => ({ ...prev, image: e.value === "None" ? null : e.value }))}
          options={["None", ...(images || [])]}
          placeholder="Select image"
          value={localItem}
          valueTemplate={ImageDropdownValue({ image: localItem?.image })}
          virtualScrollerOptions={virtualScrollerSettings}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined "
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              image: localItem.image === "None" || !localItem.image ? null : localItem.image,
            });
          }}
          type="submit"
        />
      </div>
      <div className="flex w-full flex-wrap justify-between">
        <div className="flex w-full flex-wrap">
          <span className="w-full text-sm text-gray-400">Node Level</span>
          <span className="w-full text-xs text-gray-400">Changes if node is above or below others</span>
        </div>
        <InputNumber
          className="w-2/3"
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              zIndex: e.value as number,
            }))
          }
          onKeyDown={(e) => {
            if (!boardRef) return;
            if (e.key === "Enter")
              updateManyNodes({
                zIndex: localItem.zIndex,
              });
          }}
          showButtons
          value={localItem.zIndex}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined "
          icon="pi pi-save"
          iconPos="right"
          onClick={() => {
            if (!boardRef) return;
            updateManyNodes({
              zIndex: localItem.zIndex,
            });
          }}
          type="submit"
        />
      </div>
    </div>
  );
}
