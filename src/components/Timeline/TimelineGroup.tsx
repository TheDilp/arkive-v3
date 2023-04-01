import { useSetAtom } from "jotai";

import { TimelineDisplayEventType, TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import TimelineEvent from "./TimelineEvent";

type Props = {
  year: number;
  events: TimelineDisplayEventType[];
  viewSettings: TimelineViewSettings;
};

export default function TimelineGroup({ year, events, viewSettings }: Props) {
  const setDrawer = useSetAtom(DrawerAtom);
  const { groupBy } = viewSettings;
  const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  console.log(events);
  return (
    <div
      className="flex h-fit max-h-full min-h-[24rem] w-full border-r border-zinc-700 first:border-t last:border-b even:border-y"
      data-start-year={year}>
      <div className="flex h-full w-20 items-start justify-center border-x border-zinc-700 font-Lato text-xl">{year}</div>
      <div className={`flex h-full flex-1 overflow-auto ${groupBy ? "flex-col content-start" : "items-start gap-1 p-1"}`}>
        {groupBy
          ? items.map((item) => (
              <div key={item} className="flex h-full flex-1 justify-start border-b border-zinc-800">
                <div className="w-[3.5rem] border-r border-zinc-800 px-2 py-1 text-center" data-year={year + item}>
                  {item + year}
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-1 px-2">
                  {events.length
                    ? events
                        .filter((event) => event.displayYear === year + item)
                        .map((event) => <TimelineEvent key={event.id} event={event} setDrawer={setDrawer} />)
                    : null}
                </div>
              </div>
            ))
          : null}
        {events.length && !groupBy
          ? events.map((event) => <TimelineEvent key={event.id} event={event} setDrawer={setDrawer} />)
          : null}
      </div>
    </div>
  );
}
