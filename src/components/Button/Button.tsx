import { Icon } from "@iconify/react";
import { VariantsENUM } from "../../enums/ComponentEnums";

type Props = {
  icon?: string;
  title: string;
  variant?: VariantsENUM;
};

export default function Button({ icon, title, variant }: Props) {
  if (variant === VariantsENUM.primary)
    return <Primary icon={icon} title={title} />;
  if (variant === VariantsENUM.secondary)
    return <Secondary icon={icon} title={title} />;
}

function Primary({ icon, title }: Props) {
  return (
    <button
      className={`w-full h-full rounded border px-2 py-1 flex items-center gap-x-1 border-sky-600 hover:border-sky-400`}
    >
      {title}
      {icon && <Icon icon={icon} />}
    </button>
  );
}

function Secondary({ icon, title }: Props) {
  return (
    <button
      className={`w-full h-full rounded border px-2 py-1 flex items-center gap-x-1 border-gray-500 hover:border-gray-400`}
    >
      {title}
      {icon && <Icon icon={icon} />}
    </button>
  );
}
