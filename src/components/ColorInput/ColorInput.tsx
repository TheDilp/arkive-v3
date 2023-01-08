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
          <HexColorPicker
            color={color}
            onChange={(newColor) => {
              onChange({ name, value: newColor });
            }}
          />
        }
        isClickable>
        <div className="h-8 w-8 cursor-pointer rounded" style={{ backgroundColor: color }} />
      </Tooltip>

      <InputText onChange={(e) => onChange({ name, value: `#${e.target.value.replaceAll("#", "")}` })} value={color} />
    </div>
  );
}
