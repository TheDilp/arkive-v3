import { Icon } from "@iconify/react";
import { VariantsENUM } from "../../types/ComponentEnums";

type Props = {
  icon?: string;
  title: string;
  variant?: VariantsENUM;
};

export default function Button({ icon, title, variant }: Props) {
  return (
    <button
      className={`w-full h-full rounded border px-2 py-1 flex items-center gap-x-1 border-${
        variant || "sky-600"
      }  text-${variant || "white"}`}
    >
      {title}
      {icon && <Icon icon={icon} />}
    </button>
  );
}
