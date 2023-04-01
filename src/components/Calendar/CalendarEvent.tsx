import { SetStateAction, useSetAtom } from "jotai";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { EventType, MonthType } from "../../types/ItemTypes/calendarTypes";
import { DrawerAtom, OtherContextMenuAtom } from "../../utils/Atoms/atoms";
import { sortEvents } from "../../utils/calendarUtils";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { DocumentMentionTooltip } from "../Mention/DocumentMention";
import { Tooltip } from "../Tooltip/Tooltip";

type Props = {
  month: MonthType;
  dayEvents: EventType[];
  index: number;
  year: number;
  isReadOnly?: boolean;
  cm: any;
};

function openOtherEvent(
  setDrawer: (update: SetStateAction<DrawerAtomType>) => void,
  event: EventType,
  month: MonthType,
  isReadOnly?: boolean,
) {
  setDrawer({
    ...DefaultDrawer,
    show: true,
    type: "events",
    data: { ...event, month },
    exceptions: { eventDescription: true, isReadOnly },
    drawerSize: "md",
  });
}

function OtherEvents({ events, openEvent }: { events: EventType[]; openEvent: (event: EventType) => void }) {
  const otherEvents = events.slice(5);
  return (
    <div className="m-2 max-h-56 w-48 overflow-hidden rounded border-zinc-900 bg-zinc-900">
      <div className="h-56 max-h-full w-full overflow-y-auto">
        {otherEvents.map((event) => (
          <div
            key={event.id}
            className="select-none truncate border-zinc-800 bg-zinc-900 p-2 transition-colors odd:border-y hover:text-sky-400"
            onClick={() => openEvent(event)}
            onKeyDown={() => {}}
            role="button"
            tabIndex={-1}>
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarEvent({ dayEvents, index, month, year, isReadOnly, cm }: Props) {
  const sortedEvents = [...dayEvents].sort(sortEvents);
  const daysEvents = sortedEvents.filter((event) => event.day === index + 1 && event.year === year);
  const visibleEvents = daysEvents.slice(0, 5);
  const setContextMenuData = useSetAtom(OtherContextMenuAtom);
  const setDrawer = useSetAtom(DrawerAtom);
  return (
    <div className="flex flex-col gap-y-0.5 p-1">
      {dayEvents && visibleEvents.length
        ? visibleEvents.map((event) => (
            <Tooltip
              key={event.id}
              content={
                event?.documentsId ? (
                  <DocumentMentionTooltip id={event?.documentsId} />
                ) : (
                  <div className="max-h-56 max-w-xs overflow-auto break-words rounded bg-black p-2">{event?.description}</div>
                )
              }
              customOffset={{
                mainAxis: 5,
              }}
              disabled={!event?.documentsId && !event?.description}>
              <div
                className="scrollbar-hidden max-h-12 overflow-y-auto rounded px-1 text-sm transition-all duration-100 hover:brightness-125"
                onClick={() =>
                  setDrawer({
                    ...DefaultDrawer,
                    show: true,
                    type: "events",
                    data: { ...event, month },
                    exceptions: { eventDescription: true, isReadOnly },
                    drawerSize: "md",
                  })
                }
                onContextMenu={(e) => {
                  setContextMenuData({ data: { event, monthDays: month.days, month }, cm, show: true });
                  if (cm.current) cm.current.show(e);
                }}
                onKeyDown={() => {}}
                role="button"
                style={{
                  backgroundColor: event?.backgroundColor || "#075985",
                  color: event?.textColor || "#ffffff",
                }}
                tabIndex={-1}>
                {event.title}
              </div>
            </Tooltip>
          ))
        : null}
      {daysEvents.length > 5 ? (
        <Tooltip
          closeOnClick
          content={
            <OtherEvents
              events={daysEvents}
              openEvent={(event: EventType) => openOtherEvent(setDrawer, event, month, isReadOnly)}
            />
          }
          isClickable>
          <div className="flex justify-between truncate rounded bg-zinc-800 px-1 text-sm transition-all duration-100 hover:bg-zinc-500">
            <div className="select-none">Show more...</div>
          </div>
        </Tooltip>
      ) : null}
    </div>
  );
}
