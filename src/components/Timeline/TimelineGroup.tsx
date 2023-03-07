import { useAtom } from "jotai";

import { EventType } from "../../types/ItemTypes/calendarTypes";
import { TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { DocumentMentionTooltip } from "../Mention/DocumentMention";
import { Tooltip } from "../Tooltip/Tooltip";

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
    <div
      className="flex h-fit max-h-full min-h-[24rem] w-full border-r border-zinc-700 first:border-t last:border-b even:border-y"
      data-start-year={year}>
      <div className="flex h-full w-20 items-start justify-center border-x border-zinc-700 font-Lato text-xl">{year}</div>
      <div className={`flex h-full flex-1 overflow-auto ${groupByHour ? "flex-col content-start" : "items-start gap-1 p-1"}`}>
        {groupByHour
          ? items.map((item) => (
              <div key={item} className="flex h-full flex-1 justify-start border-b border-zinc-800">
                <div className="w-[3.5rem] border-r border-zinc-800 px-2 py-1 text-center" data-year={year + item}>
                  {item + year}
                </div>
                <div className="flex flex-1 flex-wrap items-center px-2">
                  {events.length
                    ? events
                        .filter((event) => event.year === year + item)
                        .map((event) => (
                          <Tooltip
                            key={event.id}
                            content={
                              event?.documentsId ? (
                                <DocumentMentionTooltip id={event?.documentsId} />
                              ) : (
                                <div className="max-h-56 max-w-xs overflow-auto break-words rounded bg-black p-2">
                                  {event?.description}
                                </div>
                              )
                            }
                            customOffset={{
                              mainAxis: 5,
                            }}
                            disabled={!event?.documentsId && !event?.description}>
                            <div
                              className="max-h-fit max-w-fit rounded px-2 transition-all duration-100 hover:brightness-125"
                              onClick={() =>
                                setDrawer({
                                  ...DefaultDrawer,
                                  show: true,
                                  type: "events",
                                  data: event,
                                  drawerSize: "sm",
                                })
                              }
                              onKeyDown={() => {}}
                              role="button"
                              style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
                              tabIndex={-1}>
                              {event.title}
                            </div>
                          </Tooltip>
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
                className="max-h-fit max-w-fit rounded px-2 transition-all duration-100 hover:brightness-125"
                onClick={() =>
                  setDrawer({
                    ...DefaultDrawer,
                    show: true,
                    type: "events",
                    data: event,
                    drawerSize: "sm",
                  })
                }
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
  );
}
