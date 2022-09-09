import { Timeline } from "primereact/timeline"
import { useContext, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { TimelineEventType } from "../../types/TimelineEventTypes";
import { useGetTimelineData, useUpdateTimelineEvent } from "../../utils/customHooks";
import { TimelineContext } from "../Context/TimelineContext";
import TimelineEventCard from "./TimelineEventCard";
import TimelineEventDialog from "./TimelineEventDialog";
import TimelineQuickBar from "./TimelineQuickBar";
type Props = {
    public_view: boolean
}

export default function TimelineView({ public_view }: Props) {
    const { project_id, timeline_id } = useParams();
    const { setTimelineId } = useContext(TimelineContext);
    const timelineData = useGetTimelineData(project_id as string, timeline_id as string);
    const [showTimelineEventDialog, setShowTimelineEventDialog] = useState(false);
    const [view, setView] = useState({ details: true, horizontal: true })
    const updateTimelineEventMutation = useUpdateTimelineEvent(project_id as string);

    useLayoutEffect(() => {
        if (timeline_id) {
            setTimelineId(timeline_id)
        }
    }, [])

    return (
        <div className={`${public_view ? "w-full" : "w-10"
            } h-full flex align-items-end justify-content-center`}>

            <TimelineEventDialog showDialog={showTimelineEventDialog} setShowDialog={setShowTimelineEventDialog} />
            <TimelineQuickBar view={view} setShowTimelineEventDialog={setShowTimelineEventDialog} setView={setView} />
            {timelineData &&
                <div className="w-full h-full flex px-4 align-items-center overflow-x-auto">
                    <Timeline className={`w-full h-10rem ${view.details ? "" : "simpleTimeline"}`} value={timelineData?.timeline_events || []} content={(item: TimelineEventType) => view.details ? <TimelineEventCard {...item} /> : <div className="simple-event">{item.title}</div>} align="alternate" layout={view.horizontal ? "horizontal" : "vertical"} />
                </div>
            }
        </div>
    )
}