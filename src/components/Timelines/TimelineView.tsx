import { Timeline } from "primereact/timeline";
import { useContext, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TimelineEventType } from "../../types/TimelineEventTypes";
import {
    useGetTimelineData
} from "../../utils/customHooks";
import { TimelineContext } from "../Context/TimelineContext";
import TimelineEventProvider from "../Context/TimelineEventContext";
import SimpleTimelineEvent from "./TimelineEvent/SimpleTimelineEvent";
import TimelineEventCard from "./TimelineEvent/TimelineEventCard/TimelineEventCard";
import TimelineEventCreateDialog from "./TimelineEvent/TimelineEventDialogs/TimelineEventCreateDialog";
import TimelineEventUpdateDialog from "./TimelineEvent/TimelineEventDialogs/TimelineEventUpdateDialog";
import TimelineQuickBar from "./TimelineQuickBar";
type Props = {
    public_view: boolean;
};

export default function TimelineView({ public_view }: Props) {
    const { project_id, timeline_id } = useParams();
    const { setTimelineId } = useContext(TimelineContext);
    const timelineData = useGetTimelineData(
        project_id as string,
        timeline_id as string
    );
    const [view, setView] = useState({ details: true, horizontal: true });

    function TimelineEventsSort(a: TimelineEventType, b: TimelineEventType) {
        if (a.start_year > b.start_year) { return 1; }
        else if (a.start_year < b.start_year) { return -1; }
        else {
            if (a.start_month && b.start_month) {
                if (a.start_month > b.start_month) { return 1 }
                if (a.start_month < b.start_month) { return -1 }
                else {
                    if (a.start_day && b.start_day) {
                        if (a.start_day > b.start_day) { return 1 }
                        if (a.start_day < b.start_day) { return -1 }
                        else {
                            return 0
                        }
                    }
                }
            }
        }
        return 0
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

                <TimelineEventCreateDialog

                />
                <TimelineEventUpdateDialog />
                <TimelineQuickBar
                    view={view}

                    setView={setView}
                />
                <>
                    {timelineData && (
                        <div className="w-full h-full flex px-4 align-items-center overflow-x-auto">
                            <div className="w-full flex timelineContainer">

                                {timelineData.timeline_events.sort(TimelineEventsSort).map(eventData => <TimelineEventCard key={eventData.id} eventData={eventData} />)}
                                {/* <Timeline
                                className={`w-full  ${view.details ? "detailedTimeline" : "simpleTimeline"
                            } ${view.horizontal
                                ? "horizontalTimeline"
                                : "verticalTimeline h-full"
                            }`}
                            value={timelineData?.timeline_events.sort(TimelineEventsSort) || []}
                            content={(eventData: TimelineEventType) =>
                                view.details ? (
                                    <TimelineEventCard eventData={eventData} />
                                    ) : (
                                        <SimpleTimelineEvent {...eventData} />
                                        )
                                    }
                                    // opposite={(item) => item.title}
                                    align="alternate"
                                layout={view.horizontal ? "horizontal" : "vertical"}
                            /> */}
                            </div>
                        </div>
                    )}
                </>
            </TimelineEventProvider>
        </div>
    );
}
