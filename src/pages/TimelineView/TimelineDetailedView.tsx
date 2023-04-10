import { Icon } from "@iconify/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MutableRefObject, useRef } from "react";

import StaticRender from "../../components/Editor/StaticRender";
import { CalendarType } from "../../types/ItemTypes/calendarTypes";
import { TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";

type Props = {
  calendars: CalendarType[];
  viewSettings: TimelineViewSettings;
};

export default function TimelineDetailedView({ calendars, viewSettings }: Props) {
  const events = calendars.flatMap((cal) => cal.events);
  const isHorizontal = viewSettings.view.value === "Horizontal";
  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const ColumnVirtualizer = useVirtualizer({
    count: events.length,
    horizontal: isHorizontal,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 10,
  });

  return (
    <div className=" relative h-full w-full overflow-hidden">
      <div ref={parentRef} className=" h-full w-full overflow-x-auto">
        <div
          style={{
            width: isHorizontal ? `${ColumnVirtualizer.getTotalSize()}px` : "100%",
            height: isHorizontal ? "100%" : `${ColumnVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}>
          {ColumnVirtualizer.getVirtualItems().map((virtualItem, idx) => (
            <div
              key={virtualItem.index}
              className="absolute top-0 left-0 flex justify-start"
              style={{
                height: isHorizontal ? "100%" : `${virtualItem.size}px`,
                width: isHorizontal ? `${virtualItem.size}px` : "100%",
                transform: isHorizontal ? `translateX(${virtualItem.start}px)` : `translateY(${virtualItem.start}px)`,
              }}>
              <div
                className="p-card absolute top-[22.5%] h-72 w-72 max-w-[288px]"
                style={{
                  left: isHorizontal ? "0" : "22.5%",
                  width: isHorizontal ? `${virtualItem.size}px` : "",
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
              <div
                className="absolute z-20 flex w-full justify-center"
                style={{
                  left: isHorizontal ? "" : "0.1rem",
                  top: isHorizontal ? "calc(50% - 0.85rem)" : "62.5%",
                }}>
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

      <hr
        className="absolute top-1/2 -z-10 w-full border-zinc-700"
        style={{
          transform: isHorizontal ? "" : "rotate(90deg)",
        }}
      />
    </div>
  );
}
