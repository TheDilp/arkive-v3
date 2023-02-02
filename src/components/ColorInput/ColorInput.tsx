/* eslint-disable jsx-a11y/control-has-associated-label */
import { InputText } from "primereact/inputtext";
import { HexColorPicker } from "react-colorful";

import { Tooltip } from "../Tooltip/Tooltip";

type Props = {
  color: string;
  name: string;
  onChange: ({ name, value }: { name: string; value: string }) => void;
};

export default function ColorInput({ name, color, onChange }: Props) {
  return (
    <div className="relative flex w-full items-center justify-between">
      <Tooltip
        content={
          <div className="w-full max-w-full">
            <HexColorPicker
              color={color}
              onChange={(newColor) => {
                onChange({ name, value: newColor });
              }}
            />
            <div className="flex w-full flex-wrap justify-between gap-x-2 bg-zinc-900 p-1">
              {["#1e40af", "#075985", "#115e59", "#166534", "#9f1239", "#3730a3"].map((preset: string) => (
                <button
                  key={preset}
                  className="h-6 w-6 cursor-pointer rounded-sm"
                  onClick={() => onChange({ name, value: preset })}
                  style={{
                    backgroundColor: preset,
                  }}
                  type="button"
                />
              ))}
            </div>
          </div>
        }
        isClickable>
        <div className="h-8 w-8 cursor-pointer rounded" style={{ backgroundColor: color }} />
      </Tooltip>

      <InputText onChange={(e) => onChange({ name, value: `#${e.target.value.replaceAll("#", "")}` })} value={color} />
    </div>
  );
}
