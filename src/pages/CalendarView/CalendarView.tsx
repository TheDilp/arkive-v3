import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
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
    <div className="flex h-full w-full max-w-full flex-col overflow-auto">
      <h2 className="sticky top-0 flex h-14 items-center justify-center bg-zinc-800 pt-2 text-center text-2xl">
        <span className="ml-auto select-none font-Lato">{data ? data.title : null}</span>
        <Icon
          className="ml-auto cursor-pointer transition-colors hover:text-sky-400"
          icon="mdi:calendar"
          onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "months" })}
        />
      </h2>
      {data
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
        : null}
    </div>
  );
}
