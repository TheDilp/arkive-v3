import { Icon } from "@iconify/react";
import { Timeline } from "primereact/timeline";
import {
    MutableRefObject,
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
import SimpleTimelineEvent from "./TimelineEvent/SimpleTimelineEvent";
import TimelineEventCard from "./TimelineEvent/TimelineEventCard/TimelineEventCard";
import TimelineEventIcon from "./TimelineEvent/TimelineEventCard/TimelineEventIcon";
import TimelineEventDialog from "./TimelineEvent/TimelineEventDialogs/TimelineEventDialog";
import TimelineQuickBar from "./TimelineQuickBar";
type Props = {
    public_view: boolean;
};

export default function TimelineView({ public_view }: Props) {
    const { project_id, timeline_id, event_id } = useParams();
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
    }, []);

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
                    {timelineData && (
                        <div
                            className={`w-full h-full flex px-4 py-8 align-items-center overflow-x-auto ${view.horizontal ? "flex-row" : "flex-column"
                                }`}
                        >
                            {timelineData?.timeline_events
                                .sort(TimelineEventsSort)
                                .map((eventData, index) => (
                                    <SimpleTimelineEvent
                                        key={eventData.id}
                                        index={index}
                                        eventData={eventData}
                                        public_view={public_view}
                                        setIconSelect={setIconSelect}
                                        view={view}
                                    />
                                ))}
                            {/* <Timeline
                                className={`w-full  ${view.details ? "detailedTimeline" : "simpleTimeline"
                                    } ${view.horizontal
                                        ? "horizontalTimeline h-10rem"
                                        : "verticalTimeline h-full"
                                    }`}
                                value={
                                    timelineData?.timeline_events.sort(TimelineEventsSort) || []
                                }
                                content={(eventData: TimelineEventType) =>
                                    view.details ? (
                                        <TimelineEventCard eventData={eventData}
                                            public_view={public_view}
                                        />
                                    ) : (
                                        <SimpleTimelineEvent {...eventData}
                                            public_view={public_view}

                                        />
                                    )
                                }
                                align="alternate"
                                marker={(item: TimelineEventType) => (
                                    <TimelineEventIcon
                                        item={item}
                                        setIconSelect={setIconSelect}
                                        public_view={public_view}
                                    />
                                )}
                                layout={view.horizontal ? "horizontal" : "vertical"}
                            /> */}
                        </div>
                    )}
                </>
            </TimelineEventProvider>
        </div>
    );
}
