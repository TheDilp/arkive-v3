import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useUpdateManySubItems } from "../../../CRUD/ItemsCRUD";
import { EdgeType } from "../../../types/boardTypes";
import { BoardReferenceAtom } from "../../../utils/Atoms/atoms";
import { BoardFontFamilies, BoardFontSizes } from "../../../utils/boardUtils";
import { DefaultEdge } from "../../../utils/DefaultValues/BoardDefaults";
import { FontItemTemplate } from "../../Dropdown/FontItemTemplate";

export default function DrawerManyEdgesContent() {
  const { item_id } = useParams();
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [localItem, setLocalItem] = useState(DefaultEdge);
  const { mutate: manyEdgesMutation } = useUpdateManySubItems(item_id as string, "edges");

  const updateManyNodes = (value: Partial<EdgeType>) => {
    manyEdgesMutation({ ids: boardRef?.edges(":selected").map((edge) => edge.id()) || [], data: value });
  };
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex w-full flex-wrap justify-between">
        <span className="w-full text-sm text-gray-400">Edge Label</span>
        <InputText
          autoComplete="false"
          className="w-4/5"
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              label: e.target.value,
            }))
          }
          placeholder="Edge Label"
          value={localItem?.label}
        />
        <Button
          className="p-button-square p-button-success p-button-outlined w-1/6"
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
            itemTemplate={FontItemTemplate}
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                fontFamily: e.value,
              }))
            }
            options={BoardFontFamilies}
            value={localItem.fontFamily}
            valueTemplate={FontItemTemplate}
          />
          <Button
            className="p-button-square p-button-success p-button-outlined w-1/6"
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
            className="p-button-square p-button-success p-button-outlined w-1/6"
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
    </div>
  );
}
