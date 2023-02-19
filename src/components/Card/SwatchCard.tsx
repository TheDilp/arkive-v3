import { Icon } from "@iconify/react";
import { useAtom } from "jotai";

import { SwatchType } from "../../types/ItemTypes/projectTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function SwatchCard({ id, title, color }: SwatchType) {
  const [, setDrawer] = useAtom(DrawerAtom);
  return (
    <div className="flex h-44 min-w-[10rem] flex-col overflow-hidden rounded border border-zinc-800 shadow-md">
      <div
        className="flex h-4/5 justify-end pt-1"
        style={{
          backgroundColor: color,
        }}>
        <Icon
          className="cursor-pointer hover:text-sky-400"
          icon="mdi:edit"
          onClick={() =>
            setDrawer({ ...DefaultDrawer, data: { id, title, color }, type: "swatches", show: true, position: "right" })
          }
        />
      </div>
      <div className="flex h-1/5 items-center justify-between bg-zinc-800 px-2 text-sm text-zinc-400">
        {title ? <div className="truncate">{title}</div> : null}
        <span>{color}</span>
      </div>
    </div>
  );
}
