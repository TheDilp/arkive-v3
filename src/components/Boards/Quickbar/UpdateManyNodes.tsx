import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageProps, NodeUpdateDialogProps } from "../../../custom-types";
import {
  boardNodeFontSizes,
  boardNodeShapes,
  textHAlignOptions,
  textVAlignOptions,
} from "../../../utils/boardUtils";
import {
  useGetDocuments,
  useGetImages,
  useUpdateNode,
} from "../../../utils/customHooks";
import { NodeUpdateDialogDefault } from "../../../utils/defaultDisplayValues";
import { toastWarn } from "../../../utils/utils";
import { BoardRefsContext } from "../../Context/BoardRefsContext";
import ImgDropdownItem from "../../Util/ImgDropdownItem";
type Props = {};

export default function UpdateManyNodes({}: Props) {
  const [manyNodesData, setManyNodesData] = useState<
    Omit<NodeUpdateDialogProps, "id">
  >(NodeUpdateDialogDefault);
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
      .nodes(":selected")
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
              value={manyNodesData.label}
              onChange={(e) =>
                setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              placeholder="Node Label"
              className="w-5"
              autoComplete="false"
            />
            <Dropdown
              className="w-3"
              options={boardNodeFontSizes}
              placeholder="Label Font Size"
              value={manyNodesData.fontSize}
              onChange={(e) =>
                setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
                  ...prev,
                  fontSize: e.value,
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
                    label: manyNodesData.label,
                    fontSize: manyNodesData.fontSize,
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
                  value={manyNodesData.textHAlign}
                  onChange={(e) =>
                    setManyNodesData(
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
                  value={manyNodesData.textVAlign}
                  onChange={(e) =>
                    setManyNodesData(
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
                        textVAlign: manyNodesData.textVAlign,
                        textHAlign: manyNodesData.textHAlign,
                        fontSize: manyNodesData.fontSize,
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
            value={manyNodesData.type}
            onChange={(e) =>
              setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
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
                  type: manyNodesData.type,
                  fontSize: manyNodesData.fontSize,
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
            value={manyNodesData.width}
            onChange={(e) =>
              setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
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
            value={manyNodesData.height}
            onChange={(e) =>
              setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
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
                  width: manyNodesData.width,
                  height: manyNodesData.height,
                  fontSize: manyNodesData.fontSize,
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
          value={manyNodesData.doc_id}
          filter
          emptyFilterMessage="No documents found"
          onChange={(e) => {
            setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
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
                doc_id: manyNodesData.doc_id,
                fontSize: manyNodesData.fontSize,
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
          value={manyNodesData.customImage}
          onChange={(e) =>
            setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
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
                doc_id: manyNodesData.doc_id,
                fontSize: manyNodesData.fontSize,
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
          value={manyNodesData.zIndex}
          onChange={(e) =>
            setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
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
                zIndex: manyNodesData.zIndex,
                fontSize: manyNodesData.fontSize,
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
              value={manyNodesData.backgroundColor}
              className="w-full ml-2"
              onChange={(e) =>
                setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
                  ...prev,
                  backgroundColor: e.target.value,
                }))
              }
            />
            <ColorPicker
              value={manyNodesData.backgroundColor}
              onChange={(e) =>
                setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
                  ...prev,
                  backgroundColor: e.value as string,
                }))
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
            value={manyNodesData.backgroundOpacity}
            className="ml-1"
            inputClassName="w-full"
            onChange={(e) =>
              setManyNodesData((prev: Omit<NodeUpdateDialogProps, "id">) => ({
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
                  "#" + manyNodesData.backgroundColor.replaceAll("#", ""),
                backgroundOpacity: manyNodesData.backgroundOpacity,
                fontSize: manyNodesData.fontSize,
              },
              cyRef
            );
          }}
        />
      </div>
    </>
  );
}
