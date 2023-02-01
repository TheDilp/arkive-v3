import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

import { useGetItem } from "../../hooks/useGetItem";
import { CalendarType } from "../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function CalendarView() {
  const { item_id } = useParams();
  const { data } = useGetItem<CalendarType>(item_id as string, "calendars");
  const [, setDrawer] = useAtom(DrawerAtom);
  return (
    <div className="flex h-full w-full max-w-full flex-col">
      <h2 className="sticky top-0 flex h-14 items-center justify-center bg-zinc-800 pt-2 text-center text-2xl">
        <div className="ml-auto flex items-center">
          <Icon
            className="cursor-pointer text-zinc-600 transition-colors hover:text-zinc-200"
            fontSize={32}
            icon="mdi:chevron-left"
          />
          <span className="select-none font-Lato">{data ? data.title : null}</span>
          <Icon
            className="cursor-pointer text-zinc-600 transition-colors hover:text-zinc-200"
            fontSize={32}
            icon="mdi:chevron-right"
          />
        </div>
        <span className="ml-auto flex">
          <Button className="p-button-text" tooltip="Edit eras" tooltipOptions={{ position: "left" }}>
            <Icon
              className="cursor-pointer transition-colors hover:text-sky-400"
              fontSize={28}
              icon="ic:twotone-history-edu"
              onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "months" })}
            />
          </Button>
          <Button className="p-button-text" tooltip="Edit months" tooltipOptions={{ position: "left" }}>
            <Icon
              className="cursor-pointer transition-colors hover:text-sky-400"
              fontSize={28}
              icon="ph:calendar-plus-thin"
              onClick={() => setDrawer({ ...DefaultDrawer, data, show: true, type: "months" })}
            />
          </Button>
        </span>
      </h2>
      <div className="h-full overflow-auto">
        {/* {data
          ? [...Array(data.weeks).keys()].map((week) => (
              <div key={`week${week}`} className="flex h-full min-h-[10em] w-full border-zinc-700 even:border-y">
                {data.days.map((day, index) => (
                  <div
                    key={`${day}-${index.toString()}`}
                    className="h-full min-w-[10rem] max-w-full border-zinc-700 even:border-x">
                    {day}
                  </div>
                ))}
              </div>
            ))
          : null} */}
      </div>
    </div>
  );
}
