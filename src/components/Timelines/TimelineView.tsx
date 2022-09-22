import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useVirtual } from "react-virtual";
import { TimelineEventType } from "../../types/TimelineEventTypes";
import {
  useGetTimelineData,
  useUpdateTimelineEvent,
} from "../../utils/customHooks";
import { TimelineContext } from "../Context/TimelineContext";
import TimelineEventProvider from "../Context/TimelineEventContext";
import MarkerIconSelect from "../Maps/Map/MapMarker/MarkerIconSelect";
import TimelineEvent from "./TimelineEvent/TimelineEvent";
import TimelineEventDialog from "./TimelineEvent/TimelineEventDialogs/TimelineEventDialog";
import TimelineQuickBar from "./TimelineQuickBar";

type Props = {
  public_view: boolean;
};

export default function TimelineView({ public_view }: Props) {
  const { project_id, timeline_id, event_id } = useParams();
  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;

  const { setTimelineId } = useContext(TimelineContext);
  const currentTimeline = useGetTimelineData(
    project_id as string,
    timeline_id as string
  );
  const updateTimelineEventMutation = useUpdateTimelineEvent(
    project_id as string
  );

  const [view, setView] = useState({
    details: currentTimeline?.defaultDetails || "detailed",
    horizontal: currentTimeline?.defaultOrientation || "horizontal",
  });
  const [iconSelect, setIconSelect] = useState<{
    id?: string;
    show: boolean;
    top: number;
    left: number;
  }>({
    id: "",
    show: false,
    top: 0,
    left: 0,
  });
  const [sortedEvents, setSortedEvents] = useState<TimelineEventType[]>([]);

  const rowVirtualizer = useVirtual({
    size: sortedEvents.length || 0,
    parentRef,
    estimateSize: useCallback(
      () => (view.details === "detailed" ? 320 : 80),
      [view.details]
    ),
    overscan: 5,
  });
  const columnVirtualizer = useVirtual({
    size: sortedEvents.length || 0,
    parentRef,
    estimateSize: useCallback(() => 320, []),
    overscan: 5,
    horizontal: true,
  });

  // Sort by date
  function TimelineEventDateSort(
    a: TimelineEventType,
    b: TimelineEventType
  ): number {
    if (a.start_year > b.start_year) {
      return 1;
    } else if (a.start_year < b.start_year) {
      return -1;
    } else {
      if (a.start_month && b.start_month) {
        if (a.start_month > b.start_month) {
          return 1;
        }
        if (a.start_month < b.start_month) {
          return -1;
        } else {
          if (a.start_day && b.start_day) {
            if (a.start_day > b.start_day) {
              return 1;
            }
            if (a.start_day < b.start_day) {
              return -1;
            } else {
              if (a.title > b.title) {
                return 1;
              }
              if (a.title < b.title) {
                return -1;
              }
              return 0;
            }
          } else {
            if (a.title > b.title) {
              return 1;
            }
            if (a.title < b.title) {
              return -1;
            }
          }
        }
      } else {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
      }
    }
    return 0;
  }
  // First sort by age and then by date if needed
  function TimelineEventsSort(
    a: TimelineEventType,
    b: TimelineEventType
  ): number {
    const ageA = currentTimeline?.timeline_ages.find(
      (age) => age.id === a.timeline_age_id
    );
    const ageB = currentTimeline?.timeline_ages.find(
      (age) => age.id === b.timeline_age_id
    );
    if (ageA && ageB) {
      if (ageA.sort > ageB.sort) {
        return 1;
      } else if (ageA.sort < ageB.sort) {
        return -1;
      } else {
        return TimelineEventDateSort(a, b);
      }
    } else if (ageA && !ageB) {
      return -1;
    } else if (!ageA && ageB) {
      return 1;
    } else {
      return TimelineEventDateSort(a, b);
    }
  }
  useLayoutEffect(() => {
    if (timeline_id) {
      setTimelineId(timeline_id);
    }
  }, [timeline_id]);

  useLayoutEffect(() => {
    if (currentTimeline?.timeline_events) {
      let temp = currentTimeline.timeline_events.sort(TimelineEventsSort);
      setSortedEvents(temp);
    }
    return () => {
      setSortedEvents([]);
    };
  }, [currentTimeline?.timeline_events, currentTimeline?.timeline_ages]);

  useLayoutEffect(() => {
    if (currentTimeline) {
      setView({
        horizontal: currentTimeline.defaultOrientation,
        details: currentTimeline.defaultDetails,
      });
    }
  }, [currentTimeline]);

  useEffect(() => {
    if (event_id && sortedEvents) {
      if (view.horizontal === "horizontal") {
        let index = sortedEvents.findIndex((event) => event.id === event_id);
        if (index !== -1)
          columnVirtualizer.scrollToIndex(index, {
            align: "center",
          });
      } else {
        let index = sortedEvents.findIndex((event) => event.id === event_id);
        if (index !== -1)
          rowVirtualizer.scrollToIndex(index, {
            align: "center",
          });
      }
    }
  }, [event_id, sortedEvents]);

  return (
    <div
      className={`${
        public_view ? "w-full" : "w-10"
      } h-full flex align-items-end justify-content-center`}
    >
      <TimelineEventProvider>
        <>
          {!public_view && (
            <>
              <TimelineEventDialog />
              <TimelineQuickBar view={view} setView={setView} />
              <MarkerIconSelect
                {...iconSelect}
                setValue={(icon: string) => {
                  if (iconSelect.id) {
                    updateTimelineEventMutation.mutate({
                      id: iconSelect.id,
                      timeline_id: timeline_id as string,
                      icon,
                    });
                  }
                }}
                setIconSelect={setIconSelect}
              />
            </>
          )}
          {sortedEvents && sortedEvents.length > 0 && (
            <div className={`w-full h-full flex align-items-center`}>
              <div
                ref={parentRef}
                style={{
                  width: `100%`,
                  height: `90%`,
                  overflow: "auto",
                }}
              >
                {view.horizontal === "horizontal" ? (
                  // Horizontal view
                  <div
                    className="flex align-items-center"
                    style={{
                      width: `${columnVirtualizer.totalSize}px`,
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    {columnVirtualizer.virtualItems.map((virtualItem) => (
                      <div
                        key={virtualItem.key}
                        className="flex flex-column justify-content-center"
                        style={{
                          position: "absolute",
                          top: 0,
                          width: "20rem",
                          height: `100%`,
                          transform: `translateX(${virtualItem.start}px)`,
                        }}
                      >
                        <TimelineEvent
                          index={virtualItem.index}
                          eventData={sortedEvents[virtualItem.index]}
                          public_view={public_view}
                          setIconSelect={setIconSelect}
                          timeline_age={
                            currentTimeline?.timeline_ages.find(
                              (age) =>
                                age.id ===
                                sortedEvents[virtualItem.index].timeline_age_id
                            ) || undefined
                          }
                          view={view}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Vertical view
                  <div
                    style={{
                      height: `${rowVirtualizer.totalSize}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer.virtualItems.map((virtualItem) => (
                      <div
                        key={virtualItem.key}
                        className="flex justify-content-center align-items-start"
                        style={{
                          position: "absolute",
                          top: 0,
                          height:
                            view.details === "detailed" ? "20rem" : "5rem",
                          width: "100%",
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        <TimelineEvent
                          index={virtualItem.index}
                          eventData={sortedEvents[virtualItem.index]}
                          public_view={public_view}
                          setIconSelect={setIconSelect}
                          timeline_age={
                            currentTimeline?.timeline_ages.find(
                              (age) =>
                                age.id ===
                                sortedEvents[virtualItem.index].timeline_age_id
                            ) || undefined
                          }
                          view={view}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      </TimelineEventProvider>
    </div>
  );
}
