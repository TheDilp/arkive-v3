import { Icon } from "@iconify/react";
import { useAtom } from "jotai";

import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function DayNumber({
  dayNumber,
  month,
  year,
  isFiller,
  isReadOnly,
}: {
  dayNumber: number;
  month: number;
  year: number;
  isFiller?: boolean;
  isReadOnly?: boolean;
}) {
  const [, setDrawer] = useAtom(DrawerAtom);
  return (
    <span className={`${isFiller ? "text-zinc-800" : ""} flex select-none items-center p-1`}>
      {dayNumber + 1}
      {!isFiller && !isReadOnly ? (
        <span className="ml-auto opacity-0 transition-all duration-100 hover:text-sky-400 group-hover:opacity-100">
          <Icon
            icon="mdi:plus"
            onClick={() => {
              if (!isFiller)
                setDrawer({
                  ...DefaultDrawer,
                  data: { day: dayNumber + 1, month, year },

                  type: "events",
                  show: true,
                });
            }}
          />
        </span>
      ) : null}
    </span>
  );
}
