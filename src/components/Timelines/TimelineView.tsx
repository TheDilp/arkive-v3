import { Icon } from "@iconify/react";
import { Timeline } from "primereact/timeline";
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
import { TimelineEventType } from "../../types/TimelineEventTypes";
import { TimelineItemDisplayDialogProps } from "../../types/TimelineTypes";
import {
    useGetTimelineData,
    useUpdateTimelineEvent,
} from "../../utils/customHooks";
import { TimelineItemDisplayDialogDefault } from "../../utils/defaultValues";
import { TimelineContext } from "../Context/TimelineContext";
import TimelineEventProvider from "../Context/TimelineEventContext";
import MarkerIconSelect from "../Maps/Map/MapMarker/MarkerIconSelect";
import TimelineEvent from "./TimelineEvent/TimelineEvent";
import TimelineEventIcon from "./TimelineEvent/TimelineEventIcon";
import TimelineEventDialog from "./TimelineEvent/TimelineEventDialogs/TimelineEventDialog";
import TimelineQuickBar from "./TimelineQuickBar";
import { useVirtual } from "react-virtual";

type Props = {
    public_view: boolean;
};

export default function TimelineView({ public_view }: Props) {
    const { project_id, timeline_id, event_id } = useParams();
    const parentRef = useRef() as MutableRefObject<HTMLDivElement>;

    const { setTimelineId } = useContext(TimelineContext);
    const timelineData = useGetTimelineData(
        project_id as string,
        timeline_id as string
    );
    const updateTimelineEventMutation = useUpdateTimelineEvent(
        project_id as string
    );
    const [view, setView] = useState({ details: true, horizontal: true });
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
    const [sortedEvents, setSortedEvents] = useState<TimelineEventType[]>([])

    const rowVirtualizer = useVirtual({
        size: timelineData?.timeline_events.length || 0,
        parentRef,
        estimateSize: useCallback(() => view.details ? 320 : 80, [view.details]),
        overscan: 5,
    });
    const columnVirtualizer = useVirtual({
        size: timelineData?.timeline_events.length || 0,
        parentRef,
        estimateSize: useCallback(() => 320, []),
        overscan: 5,
        horizontal: true
    });

    function TimelineEventsSort(a: TimelineEventType, b: TimelineEventType) {
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
    useLayoutEffect(() => {
        if (timeline_id) {
            setTimelineId(timeline_id);
        }
    }, [timeline_id]);

    useEffect(() => {
        if (timelineData?.timeline_events) {
            let temp = timelineData.timeline_events.sort(TimelineEventsSort);
            setSortedEvents(temp)
        }
    }, [timelineData?.timeline_events])


    return (
        <div
            className={`${public_view ? "w-full" : "w-10"
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
                        <div
                            className={`w-full h-full flex align-items-center`}
                        >
                            <div
                                ref={parentRef}
                                style={{
                                    width: `100%`,
                                    height: `90%`,
                                    overflow: 'auto',
                                }}
                            >
                                {/* The large inner element to hold all of the items */}
                                <div
                                    className="flex align-items-center"
                                    style={{
                                        width: "100%",
                                        height: '100%',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Only the visible items in the virtualizer, manually positioned to be in view */}
                                    {view.horizontal ? columnVirtualizer.virtualItems.map((virtualItem) => (
                                        <div
                                            key={virtualItem.key}
                                            className="flex flex-column justify-content-center"
                                            style={{
                                                position: 'absolute',
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
                                                view={view}
                                            />
                                        </div>
                                    )) :
                                        rowVirtualizer.virtualItems.map((virtualItem) => (
                                            <div
                                                key={virtualItem.key}
                                                className="flex justify-content-center align-items-start"
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    height: view.details ? "20rem" : "5rem",
                                                    width: "100%",
                                                    transform: `translateY(${virtualItem.start}px)`,
                                                }}
                                            >
                                                <TimelineEvent
                                                    index={virtualItem.index}
                                                    eventData={sortedEvents[virtualItem.index]}
                                                    public_view={public_view}
                                                    setIconSelect={setIconSelect}
                                                    view={view}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>


                            {/* {timelineData?.timeline_events
                                .sort(TimelineEventsSort)
                                .map((eventData, index) => (
                                    <TimelineEvent
                                        key={eventData.id}
                                        index={index}
                                        eventData={eventData}
                                        public_view={public_view}
                                        setIconSelect={setIconSelect}
                                        view={view}
                                    />
                                ))} */}
                        </div>
                    )}
                </>
            </TimelineEventProvider>
        </div >
    );
}
