import { useAtom } from "jotai";

import { EventType } from "../../types/ItemTypes/calendarTypes";
import { TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

type Props = {
  year: number;
  events: EventType[];
  viewSettings: TimelineViewSettings;
};

export default function TimelineGroup({ year, events, viewSettings }: Props) {
  const [, setDrawer] = useAtom(DrawerAtom);
  const { groupByHour } = viewSettings;
  const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="flex h-fit min-h-[24rem] w-full border-r border-zinc-700 last:border-b even:border-y">
      <div className="flex h-full w-16 items-start justify-center border-x border-zinc-700 font-Lato text-xl">{year}</div>
      <div className={`flex h-full flex-1 overflow-auto ${groupByHour ? "flex-col content-start" : "items-start gap-1"}`}>
        {groupByHour
          ? items.map((item) => (
              <div key={item} className="flex h-full flex-1 justify-start border-b border-zinc-800">
                <div className="w-[2rem] border-r border-zinc-800 px-2 py-1">{item + year}</div>
                <div className="flex flex-1 flex-wrap items-center px-2">
                  {events.length
                    ? events
                        .filter((event) => event.year === item + 1)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="max-h-fit max-w-fit rounded px-2"
                            onClick={() =>
                              setDrawer({
                                ...DefaultDrawer,
                                show: true,
                                type: "events",
                                data: { ...event, month: 0 },
                                drawerSize: "md",
                              })
                            }
                            // onContextMenu={(e) => {
                            //   setContextMenuData({ data: { event, monthDays: month.days }, cm, show: true });
                            //   if (cm.current) cm.current.show(e);
                            // }}
                            onKeyDown={() => {}}
                            role="button"
                            style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
                            tabIndex={-1}>
                            {event.title}
                          </div>
                        ))
                    : null}
                </div>
              </div>
            ))
          : null}
        {events.length && !groupByHour
          ? events.map((event) => (
              <div
                key={event.id}
                className="max-h-fit max-w-fit rounded px-2"
                style={{ backgroundColor: event.backgroundColor, color: event.textColor }}>
                {event.title}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
