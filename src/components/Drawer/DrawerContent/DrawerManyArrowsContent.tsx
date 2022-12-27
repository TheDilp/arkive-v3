import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useUpdateManySubItems } from "../../../CRUD/ItemsCRUD";
import { EdgeType } from "../../../types/boardTypes";
import { BoardReferenceAtom } from "../../../utils/Atoms/atoms";
import { boardEdgeArrowShapes } from "../../../utils/boardUtils";
import { DefaultEdge } from "../../../utils/DefaultValues/BoardDefaults";
import { toaster } from "../../../utils/toast";
import { getHexColor } from "../../../utils/transform";
import ColorInput from "../../ColorInput/ColorInput";

export default function DrawerManyArrowsContent() {
  const { item_id } = useParams();
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [localItem, setLocalItem] = useState(DefaultEdge);

  const handleChange = ({ name, value }: { name: string; value: any }) => {
    setLocalItem((prev) => ({ ...prev, [name]: value }));
  };
  const { mutate: manyEdgesMutation } = useUpdateManySubItems(item_id as string, "edges");

  const updateManyEdges = (value: Partial<EdgeType>) => {
    const edges = boardRef?.edges(":selected");
    if (edges?.length)
      manyEdgesMutation(
        { ids: edges.map((edge) => edge.id()) || [], data: value },
        {
          onSuccess: () => toaster("success", "Edges updated successfully."),
        },
      );
  };
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-x-1 gap-y-4 pb-2 font-Lato">
        <span className="w-full text-center text-xl text-white">Target Arrow</span>
        <div className="w-full">
          <span className="w-full text-sm text-zinc-400">Shape & Fill</span>
          <div className="flex items-center justify-between">
            <Dropdown
              className="w-2/3"
              filter
              onChange={(e) => handleChange({ name: "targetArrowShape", value: e.value })}
              options={boardEdgeArrowShapes}
              placeholder="Node Shape"
              value={localItem.targetArrowShape}
            />
            <InputSwitch
              checked={localItem.targetArrowFill}
              falseValue="hollow"
              onChange={(e) => handleChange({ name: "targetArrowFill", value: e.value })}
              tooltip="Makes the arrow filled or hollow"
              tooltipOptions={{
                showDelay: 500,
                position: "left",
              }}
              trueValue="filled"
            />
          </div>
          <div className="flex w-full flex-wrap items-center justify-between">
            <span className="w-full text-sm text-zinc-400">Arrow Color</span>
            <ColorInput
              color={localItem.targetArrowColor}
              name="targetArrowColor"
              onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
            />
            <Button
              className="p-button-square p-button-success p-button-outlined arrowSaveButton"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!boardRef) return;
                updateManyEdges({
                  targetArrowFill: localItem.targetArrowFill,
                  targetArrowColor: localItem.targetArrowColor,
                  targetArrowShape: localItem.targetArrowShape,
                });
              }}
              type="submit"
            />
          </div>
          <hr className="mt-1 border-zinc-700" />
        </div>
        <span className="w-full text-center text-xl text-white">Source Arrow</span>
        <div className="w-full">
          <span className="w-full text-sm text-zinc-400">Shape & Fill</span>
          <div className="flex items-center justify-between">
            <Dropdown
              className="w-2/3"
              filter
              onChange={(e) => handleChange({ name: "sourceArrowShape", value: e.value })}
              options={boardEdgeArrowShapes}
              value={localItem.sourceArrowShape}
            />
            <InputSwitch
              checked={localItem.sourceArrowFill}
              falseValue="hollow"
              onChange={(e) => handleChange({ name: "sourceArrowFill", value: e.value })}
              tooltip="Makes the arrow filled or hollow"
              tooltipOptions={{
                showDelay: 500,
                position: "left",
              }}
              trueValue="filled"
            />
          </div>
          <div className="flex w-full flex-wrap items-center justify-between">
            <span className="w-full text-sm text-zinc-400">Arrow Color</span>
            <ColorInput
              color={localItem.sourceArrowColor}
              name="sourceArrowColor"
              onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
            />
            <Button
              className="p-button-square p-button-success p-button-outlined arrowSaveButton"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!boardRef) return;
                updateManyEdges({
                  sourceArrowFill: localItem.sourceArrowFill,
                  sourceArrowColor: localItem.sourceArrowColor,
                  sourceArrowShape: localItem.sourceArrowShape,
                });
              }}
              type="submit"
            />
          </div>
          <hr className="mt-1" />
        </div>

        <span className="w-full text-center text-xl text-white">Mid Target Arrow</span>
        <div className="w-full">
          <span className="w-full text-sm text-zinc-400">Shape & Fill</span>
          <div className="flex items-center justify-between">
            <Dropdown
              className="w-2/3"
              filter
              onChange={(e) => handleChange({ name: "midTargetArrowShape", value: e.value })}
              options={boardEdgeArrowShapes}
              placeholder="Node Shape"
              value={localItem.midTargetArrowShape}
            />
            <InputSwitch
              checked={localItem.midTargetArrowFill}
              falseValue="hollow"
              onChange={(e) => handleChange({ name: "midTargetArrowFill", value: e.value })}
              tooltip="Makes the arrow filled or hollow"
              tooltipOptions={{
                showDelay: 500,
                position: "left",
              }}
              trueValue="filled"
            />
          </div>
          <div className="flex w-full flex-wrap items-center justify-between">
            <span className="w-full text-sm text-zinc-400">Arrow Color</span>
            <ColorInput
              color={localItem.midTargetArrowColor}
              name="midTargetArrowColor"
              onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
            />
            <Button
              className="p-button-square p-button-success p-button-outlined arrowSaveButton"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!boardRef) return;
                updateManyEdges({
                  midTargetArrowFill: localItem.midTargetArrowFill,
                  midTargetArrowColor: localItem.midTargetArrowColor,
                  midTargetArrowShape: localItem.midTargetArrowShape,
                });
              }}
              type="submit"
            />
          </div>
          <hr className="mt-1" />
        </div>
        <span className="w-full text-center text-xl text-white">Mid Source Arrow</span>

        <div className="w-full">
          <span className="w-full text-sm text-zinc-400"> Shape & Fill</span>
          <div className="flex items-center justify-between">
            <Dropdown
              className="w-2/3"
              filter
              onChange={(e) => handleChange({ name: "midSourceArrowShape", value: e.value })}
              options={boardEdgeArrowShapes}
              placeholder="Node Shape"
              value={localItem.midSourceArrowShape}
            />
            <InputSwitch
              checked={localItem.midSourceArrowFill}
              falseValue="hollow"
              onChange={(e) => handleChange({ name: "midSourceArrowFill", value: e.value })}
              tooltip="Makes the arrow filled or hollow"
              tooltipOptions={{
                showDelay: 500,
                position: "left",
              }}
              trueValue="filled"
            />
          </div>
          <div className="flex w-full flex-wrap items-center justify-between">
            <span className="w-full text-sm text-zinc-400">Arrow Color</span>
            <ColorInput
              color={localItem.midSourceArrowColor}
              name="midSourceArrowColor"
              onChange={({ name, value }) => handleChange({ name, value: getHexColor(value) })}
            />
            <Button
              className="p-button-square p-button-success p-button-outlined arrowSaveButton"
              icon="pi pi-save"
              iconPos="right"
              onClick={() => {
                if (!boardRef) return;
                updateManyEdges({
                  midSourceArrowFill: localItem.midSourceArrowFill,
                  midSourceArrowColor: localItem.midSourceArrowColor,
                  midSourceArrowShape: localItem.midSourceArrowShape,
                });
              }}
              type="submit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
