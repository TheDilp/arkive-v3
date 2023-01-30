import { useParams } from "react-router-dom";

import { useGetItem } from "../../hooks/useGetItem";
import { CalendarType } from "../../types/ItemTypes/calendarTypes";

export default function CalendarView() {
  const { item_id } = useParams();
  const { data } = useGetItem<CalendarType>(item_id as string, "calendars");

  return (
    <div className="flex h-full w-full max-w-full flex-col overflow-auto">
      <h2 className="sticky top-0 flex h-14 items-center justify-center bg-zinc-800 py-2 text-center text-xl">
        <span className="select-none font-Lato">{data ? data.title : null}</span>
      </h2>
      {data
        ? [...Array(20).keys()].map((week) => (
            <div key={`week${week}`} className="h-full min-h-[8rem] border-zinc-700 py-2 even:border-y">
              MONDAY
            </div>
          ))
        : null}
    </div>
  );
}
