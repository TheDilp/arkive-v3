import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";
import React from "react";

type Props = {
  color: string;
  name: string;
  onChange: ({ name, value }: { name: string; value: string }) => void;
};

export default function ColorInput({ name, color, onChange }: Props) {
  return (
    <>
      <ColorPicker onChange={(e) => onChange({ name, value: `#${e.value}` })} value={color} />
      <InputText onChange={(e) => onChange({ name, value: `#${e.target.value}` })} value={color} />
    </>
  );
}
