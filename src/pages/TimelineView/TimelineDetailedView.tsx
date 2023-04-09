import { Icon } from "@iconify/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MutableRefObject, useRef } from "react";

import StaticRender from "../../components/Editor/StaticRender";
import { CalendarType } from "../../types/ItemTypes/calendarTypes";

type Props = {
  calendars: CalendarType[];
};

export default function TimelineDetailedView({ calendars }: Props) {
  const events = calendars.flatMap((cal) => cal.events);

  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const rowVirtualizer = useVirtualizer({
    count: events.length,
    horizontal: true,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350,
  });

  return (
    <div className=" relative h-full w-full overflow-hidden">
      <div ref={parentRef} className=" h-full w-full overflow-x-auto">
        <div
          style={{
            width: `${rowVirtualizer.getTotalSize()}px`,
            height: "100%",
            position: "relative",
          }}>
          {rowVirtualizer.getVirtualItems().map((virtualItem, idx) => (
            <div
              key={virtualItem.index}
              className="absolute top-0 left-0 flex h-full justify-center"
              style={{
                width: `${virtualItem.size}px`,
                transform: `translateX(${virtualItem.start}px)`,
              }}>
              <div
                className="p-card absolute top-[22.5%] h-72 w-72 max-w-[288px] "
                style={{
                  width: `${virtualItem.size}px`,
                }}>
                <h3 className="p-card-title text-center ">{events[idx].title}</h3>
                <div className="p-card-body h-[calc(100%-1.85rem)] overflow-hidden">
                  <div className=" h-full w-full overflow-auto">
                    {events && events?.[idx]?.document?.content ? (
                      // @ts-ignore
                      <StaticRender content={events[idx].document.content} />
                    ) : (
                      <p>{events[idx].description || ""}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-[calc(50%-1rem)] z-20 flex w-full justify-center">
                <div
                  className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2"
                  style={{
                    backgroundColor: events[idx].backgroundColor,
                  }}>
                  <Icon color={events[idx].textColor} fontSize={24} icon={events[idx]?.document?.icon || "ph:flag"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="absolute top-1/2 -z-10 w-full border-zinc-700" />
    </div>
  );
}
