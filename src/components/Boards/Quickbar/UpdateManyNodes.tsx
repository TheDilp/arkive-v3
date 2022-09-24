import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { ImageProps } from "../../../custom-types";
import { BoardNodeType, NodeUpdateDialogType } from "../../../types/BoardTypes";
import {
  BoardFontSizes,
  boardNodeShapes,
  BoardFontFamilies,
  textHAlignOptions,
  textVAlignOptions,
  setTemplateStyle,
  resetTemplateStyle,
} from "../../../utils/boardUtils";
import {
  useGetBoardData,
  useGetDocuments,
  useGetImages,
  useUpdateNode,
} from "../../../utils/customHooks";
import { NodeUpdateDialogDefault } from "../../../utils/defaultValues";
import { toastWarn, virtualScrollerSettings } from "../../../utils/utils";
import { BoardRefsContext } from "../../Context/BoardRefsContext";
import DialogLabel from "../../Util/DialogLabel";
import ImgDropdownItem from "../../Util/ImgDropdownItem";

type ManyNodesProps = Omit<NodeUpdateDialogType, "id"> & {
  selectedTemplate: BoardNodeType | null;
};

export default function UpdateManyNodes() {
  const [manyNodesData, setManyNodesData] = useState<ManyNodesProps>({
    ...NodeUpdateDialogDefault,
    selectedTemplate: null,
  });
  const { cyRef } = useContext(BoardRefsContext);
  const { project_id, board_id } = useParams();
  const updateNodeMutation = useUpdateNode(project_id as string);
  const documents = useGetDocuments(project_id as string);
  const images = useGetImages(project_id as string);
  const board = useGetBoardData(
    project_id as string,
    board_id as string,
    false
  );
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
          <label className="w-full text-sm text-gray-400">Node Label</label>
          <div className="w-full flex flex-wrap justify-content-between">
            <InputText
              value={manyNodesData.label}
              onChange={(e) =>
                setManyNodesData((prev: ManyNodesProps) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              placeholder="Node Label"
              className="w-max"
              autoComplete="false"
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
                  },
                  cyRef
                );
              }}
            />
          </div>
          <label className="w-full text-sm text-gray-400">Font Size</label>
          <div className="w-full flex flex-wrap justify-content-between">
            <Dropdown
              className="w-3"
              options={BoardFontSizes}
              placeholder="Label Font Size"
              value={manyNodesData.fontSize}
              onChange={(e) =>
                setManyNodesData((prev: ManyNodesProps) => ({
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
                    fontSize: manyNodesData.fontSize,
                  },
                  cyRef
                );
              }}
            />

            {/* Font size */}

            <div className="flex flex-nowrap justify-content-between align-items-end align-content-center w-full mt-1">
              <div className="w-max">
                <label htmlFor="" className="text-sm text-gray-400">
                  Font Family
                </label>
                <Dropdown
                  className="w-full"
                  options={BoardFontFamilies}
                  value={manyNodesData.fontFamily}
                  onChange={(e) =>
                    setManyNodesData((prev: ManyNodesProps) => ({
                      ...prev,
                      fontFamily: e.value,
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
                      fontFamily: manyNodesData.fontFamily,
                    },
                    cyRef
                  );
                }}
              />
            </div>

            {/* Label color */}
            <div className="flex flex-nowrap justify-content-start align-items-end align-content-center w-full mt-1">
              <div className="flex flex-wrap align-items-center justify-content-start w-10">
                <label htmlFor="" className="w-full text-sm text-gray-400">
                  Label Color
                </label>
                <div>
                  <InputText
                    value={manyNodesData.fontColor}
                    className="w-10"
                    onChange={(e) =>
                      setManyNodesData((prev: ManyNodesProps) => ({
                        ...prev,
                        fontColor: e.target.value,
                      }))
                    }
                  />
                  <ColorPicker
                    className="ml-1"
                    value={manyNodesData.fontColor}
                    onChange={(e) =>
                      setManyNodesData((prev: ManyNodesProps) => ({
                        ...prev,
                        fontColor: e.value as string,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="w-2 flex justify-content-end">
                <Button
                  type="submit"
                  className="p-button-square p-button-success p-button-outlined w-full"
                  icon="pi pi-save"
                  iconPos="right"
                  onClick={() => {
                    if (!cyRef) return;
                    updateManyNodesFunction(
                      {
                        fontColor:
                          "#" + manyNodesData.fontColor.replaceAll("#", ""),
                      },
                      cyRef
                    );
                  }}
                />
              </div>
            </div>

            {/* Horizontal Align */}
            <div className="flex flex-nowrap justify-content-between align-items-end align-content-center w-full mt-1">
              <div className="w-max">
                <label htmlFor="" className="text-sm text-gray-400">
                  Horizontal Align
                </label>
                <Dropdown
                  className="w-full"
                  options={textHAlignOptions}
                  value={manyNodesData.textHAlign}
                  onChange={(e) =>
                    setManyNodesData((prev: ManyNodesProps) => ({
                      ...prev,
                      textHAlign: e.value,
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
                        textHAlign: manyNodesData.textHAlign,
                      },
                      cyRef
                    );
                  }}
                />
              </div>
            </div>
            {/* Vertical Align */}
            <div className="flex flex-nowrap justify-content-between align-items-end align-content-center w-full mt-1">
              <div className="w-max">
                <label htmlFor="" className="text-sm text-gray-400">
                  Vertical Align
                </label>
                <Dropdown
                  className="w-full"
                  options={textVAlignOptions}
                  value={manyNodesData.textVAlign}
                  onChange={(e) =>
                    setManyNodesData((prev: ManyNodesProps) => ({
                      ...prev,
                      textVAlign: e.value,
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
                        textVAlign: manyNodesData.textVAlign,
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
          <label className="w-full text-sm text-gray-400">Node Shape</label>
          <Dropdown
            options={boardNodeShapes}
            className="w-9"
            placeholder="Node Shape"
            filter
            value={manyNodesData.type}
            onChange={(e) =>
              setManyNodesData((prev: ManyNodesProps) => ({
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
                },
                cyRef
              );
            }}
          />
        </div>
        <div className="w-full flex flex-wrap justify-content-between">
          <label className="text-sm w-full text-gray-400">Width</label>
          <InputNumber
            inputClassName="w-6rem"
            showButtons
            min={10}
            max={5000}
            step={10}
            value={manyNodesData.width}
            onChange={(e) =>
              setManyNodesData((prev: ManyNodesProps) => ({
                ...prev,
                width: e.value as number,
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
                  width: manyNodesData.width,
                },
                cyRef
              );
            }}
          />
        </div>
        <div className="w-full flex flex-wrap justify-content-between">
          <label className="text-sm w-full text-gray-400">Height</label>
          <InputNumber
            inputClassName="w-6rem"
            showButtons
            min={10}
            max={5000}
            step={10}
            value={manyNodesData.height}
            onChange={(e) =>
              setManyNodesData((prev: ManyNodesProps) => ({
                ...prev,
                height: e.value as number,
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
                  height: manyNodesData.height,
                },
                cyRef
              );
            }}
          />
        </div>
      </div>
      <div className="w-full my-1 flex flex-wrap justify-content-between">
        <label className="w-full text-sm text-gray-400">Linked Document</label>
        <Dropdown
          className="w-9"
          placeholder="Link Document"
          value={manyNodesData.doc_id}
          filter
          emptyFilterMessage="No documents found"
          onChange={(e) => {
            setManyNodesData((prev: ManyNodesProps) => ({
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
              },
              cyRef
            );
          }}
        />
      </div>
      <div className="w-full my-1 flex flex-wrap justify-content-between">
        <label className="w-full text-sm text-gray-400">Custom Image</label>
        <div className="text-xs text-gray-400">
          Note: Custom images override images from linked documents.
        </div>
        <Dropdown
          filter
          filterBy="title"
          className="w-9"
          placeholder="Custom Image"
          optionLabel="title"
          virtualScrollerOptions={virtualScrollerSettings}
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
            setManyNodesData((prev: ManyNodesProps) => ({
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
              },
              cyRef
            );
          }}
        />
      </div>
      <div className="w-full my-2 flex flex-wrap justify-content-between">
        <div className="w-full flex flex-wrap">
          <label className="w-full text-sm text-gray-400">Node Level</label>
          <span className="w-full text-xs text-gray-400">
            Changes if node is above or below others
          </span>
        </div>
        <InputNumber
          className="w-9"
          value={manyNodesData.zIndex}
          onChange={(e) =>
            setManyNodesData((prev: ManyNodesProps) => ({
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
              },
              cyRef
            );
          }}
        />
      </div>
      <div className="w-full flex flex-wrap justify-content-between align-items-end my-1">
        <div className="w-full">
          <label className="w-full text-sm text-gray-400">
            Background Color
          </label>
          <div className="flex justify-content-between align-items-center">
            <ColorPicker
              className="w-1"
              value={manyNodesData.backgroundColor}
              onChange={(e) =>
                setManyNodesData((prev: ManyNodesProps) => ({
                  ...prev,
                  backgroundColor: e.value as string,
                }))
              }
            />
            <InputText
              value={manyNodesData.backgroundColor}
              className="w-8 ml-2"
              onChange={(e) =>
                setManyNodesData((prev: ManyNodesProps) => ({
                  ...prev,
                  backgroundColor: e.target.value,
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
                    backgroundColor:
                      "#" + manyNodesData.backgroundColor.replaceAll("#", ""),
                  },
                  cyRef
                );
              }}
            />
          </div>
        </div>
        <div className="w-full">
          <label className="w-full text-sm text-gray-400">
            Background Opacity
          </label>
          <div className="w-full flex flex-wrap justify-content-between">
            <InputNumber
              showButtons
              mode="decimal"
              min={0}
              step={0.01}
              max={1}
              value={manyNodesData.backgroundOpacity}
              inputClassName="w-full"
              onChange={(e) =>
                setManyNodesData((prev: ManyNodesProps) => ({
                  ...prev,
                  backgroundOpacity: e.value as number,
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
                    backgroundColor:
                      "#" + manyNodesData.backgroundColor.replaceAll("#", ""),
                    backgroundOpacity: manyNodesData.backgroundOpacity,
                  },
                  cyRef
                );
              }}
            />
          </div>
        </div>
        <div className="w-full flex flex-wrap">
          <DialogLabel text="Template" />
          <Dropdown
            tooltip="Select template and save to save changes"
            placeholder="Select Template"
            optionLabel="label"
            value={manyNodesData.selectedTemplate}
            options={
              board?.nodes
                ? [
                    { label: "None", value: null },
                    ...board.nodes.filter((node) => node.template),
                  ]
                : []
            }
            onChange={(e) =>
              setManyNodesData((prev) => ({
                ...prev,
                selectedTemplate: e.value,
              }))
            }
          />
          <Button
            icon="pi pi-save"
            onClick={(e) => {
              if (manyNodesData.selectedTemplate && cyRef) {
                const {
                  id,
                  board_id,
                  template,
                  document,
                  label,
                  x,
                  y,
                  ...restTemplate
                } = manyNodesData.selectedTemplate as BoardNodeType;
                updateManyNodesFunction(restTemplate, cyRef);
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
