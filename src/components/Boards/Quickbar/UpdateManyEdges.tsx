import React, { Dispatch, SetStateAction, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  useGetDocuments,
  useGetImages,
  useUpdateNode,
} from "../../../utils/customHooks";
import { toastWarn } from "../../../utils/utils";
import { Icon } from "@iconify/react";
import { saveAs } from "file-saver";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { ImageProps, NodeUpdateDialogProps } from "../../../custom-types";
import { BoardRefsContext } from "../../Context/BoardRefsContext";
import {
  boardNodeFontSizes,
  boardNodeShapes,
  textHAlignOptions,
  textVAlignOptions,
} from "../../../utils/boardUtils";
import ImgDropdownItem from "../../Util/ImgDropdownItem";
type Props = {
  manyNodesDialog: Omit<NodeUpdateDialogProps, "id">;
  setManyNodesDialog: Dispatch<
    SetStateAction<Omit<NodeUpdateDialogProps, "id">>
  >;
};

export default function UpdateManyEdges({
  manyNodesDialog,
  setManyNodesDialog,
}: Props) {
  const { cyRef } = useContext(BoardRefsContext);
  const { project_id, board_id } = useParams();
  const updateNodeMutation = useUpdateNode(project_id as string);
  const documents = useGetDocuments(project_id as string);
  const images = useGetImages(project_id as string);
  const updateManyNodesFunction = (
    values: { [key: string]: any },
    cyRef: any
  ) => {
    let ids: string[] = cyRef.current
      .elements(":selected")
      .edges()
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
    <>
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
              setManyNodesDialog((prev: Omit<NodeUpdateDialogProps, "id">) => ({
                ...prev,
                type: e.value,
              }))
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
              setManyNodesDialog((prev: Omit<NodeUpdateDialogProps, "id">) => ({
                ...prev,
                width: e.value as number,
              }))
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
              setManyNodesDialog((prev: Omit<NodeUpdateDialogProps, "id">) => ({
                ...prev,
                height: e.value as number,
              }))
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
            setManyNodesDialog((prev: Omit<NodeUpdateDialogProps, "id">) => ({
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
            setManyNodesDialog((prev: Omit<NodeUpdateDialogProps, "id">) => ({
              ...prev,
              customImage: e.value,
            }))
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
            setManyNodesDialog((prev: Omit<NodeUpdateDialogProps, "id">) => ({
              ...prev,
              zIndex: e.value as number,
            }))
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
              setManyNodesDialog((prev: Omit<NodeUpdateDialogProps, "id">) => ({
                ...prev,
                backgroundOpacity: e.value as number,
              }))
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
    </>
  );
}
