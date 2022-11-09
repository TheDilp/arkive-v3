import { Icon } from "@iconify/react";
import { VariantsENUM } from "../../enums/ComponentEnums";

type Props = {
  icon?: string;
  title: string;
  variant?: VariantsENUM;
};

export default function Button({ icon, title, variant }: Props) {
  const variantPicker = () => {
    if (variant === VariantsENUM.primary) return "border-blue-400";
  };
  return (
    <button
      className={`w-full h-full flex items-center px-4 py-1 rounded shadow active:shadow-none gap-x-1 ${variant}`}
    >
      {title}
      {icon && <Icon icon={icon} />}
    </button>
  );
}

function Primary({ icon, title }: Props) {
  return (
    <button className="w-full h-full flex items-center px-4 py-1 border rounded shadow gap-x-1 text-sky-400 border-sky-600 hover:border-sky-400 active:bg-sky-200">
      {title}
      {icon && <Icon icon={icon} />}
    </button>
  );
}

function Secondary({ icon, title }: Props) {
  return (
    <button className="w-full h-full flex items-center px-4 py-1 text-gray-400 border border-gray-500 rounded shadow gap-x-1 hover:border-gray-400 active:bg-gray-200">
      {title}
      {icon && <Icon icon={icon} />}
    </button>
  );
}
