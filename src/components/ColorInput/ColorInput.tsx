import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";

type Props = {
  color: string;
  name: string;
  onChange: ({ name, value }: { name: string; value: string }) => void;
};

export default function ColorInput({ name, color, onChange }: Props) {
  return (
    <div className="flex items-center justify-between w-full">
      <ColorPicker onChange={(e) => onChange({ name, value: `#${e.value?.toString().replaceAll("#", "")}` })} value={color} />
      <InputText onChange={(e) => onChange({ name, value: `#${e.target.value.replaceAll("#", "")}` })} value={color} />
    </div>
  );
}
