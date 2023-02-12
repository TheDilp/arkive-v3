import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { capitalCase } from "remirror";

import { EdgeType } from "../../types/ItemTypes/boardTypes";
import { boardEdgeArrowShapes } from "../../utils/boardUtils";
import { getHexColor } from "../../utils/transform";
import ColorInput from "../ColorInput/ColorInput";

export default function EdgeArrowSection({
  arrowShape,
  arrowFill,
  arrowColor,
  arrowName,
  handleChange,
  title,
  updateManyEdges,
  isUpdating,
}: {
  arrowShape: string;
  arrowFill: "hollow" | "filled";
  arrowColor: string;
  arrowName: string;
  handleChange: ({ name, value }: { name: string; value: any }) => void;
  title: string;
  isUpdating: boolean;
  updateManyEdges?: (value: Partial<EdgeType>) => void;
}) {
  return (
    <div className="flex flex-col gap-y-2 p-2">
      <span className="w-full text-center font-Lato text-xl text-white">{title}</span>
      <div className="flex items-center gap-x-2">
        <span className="text-sm text-zinc-400">Shape</span>
        <Dropdown
          className="flex-1"
          filter
          onChange={(e) => handleChange({ name: `${arrowName}ArrowShape`, value: e.value })}
          options={boardEdgeArrowShapes}
          placeholder="Arrow Shape"
          resetFilterOnHide
          value={arrowShape}
        />
      </div>
      <div className="flex w-full items-center gap-x-2">
        <span className="w-full text-sm text-zinc-400">Arrow Color</span>
        <ColorInput
          color={arrowColor}
          name={`${arrowName}ArrowColor`}
          onChange={({ name: inputName, value }) => handleChange({ name: inputName, value: getHexColor(value) })}
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="w-fit text-sm text-zinc-400">Is filled?</span>
        <InputSwitch
          checked={arrowFill}
          falseValue="hollow"
          onChange={(e) => handleChange({ name: `${arrowName}ArrowFill`, value: e.value })}
          tooltip="Makes the arrow filled or hollow"
          tooltipOptions={{
            showDelay: 500,
            position: "left",
          }}
          trueValue="filled"
        />
      </div>
      {updateManyEdges ? (
        <div className="w-full">
          <Button
            className="p-button-success p-button-outlined w-full"
            disabled={isUpdating}
            icon="pi pi-save"
            iconPos="right"
            label={`Save ${capitalCase(arrowName)} Arrow`}
            loading={isUpdating}
            onClick={() =>
              updateManyEdges({
                [`${arrowName}ArrowShape`]: arrowShape,
                [`${arrowName}ArrowColor`]: arrowColor,
                [`${arrowName}ArrowFill`]: arrowFill,
              })
            }
          />
        </div>
      ) : null}
      <hr className="mt-2 border-zinc-700" />
    </div>
  );
}
