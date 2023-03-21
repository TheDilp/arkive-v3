import { Icon } from "@iconify/react";
import { Action } from "kbar";

type Props = {
  item: Action;
  // eslint-disable-next-line react/boolean-prop-naming
  active: boolean;
};

export default function CMDKResultItem({ item, active }: Props) {
  const { name, keywords, shortcut } = item;
  return (
    <div className={`flex items-center justify-between px-4 py-2 ${active ? "bg-zinc-600" : "bg-zinc-700"}`}>
      <span className="flex items-center gap-x-2 font-Merriweather text-lg">
        {item?.icon ? <Icon icon={item.icon as string} /> : null}
        {name}
      </span>
      <span className="w-fit text-center font-Lato text-sm">{keywords}</span>
      <kbd>{shortcut}</kbd>
    </div>
  );
}
