import { Timeline } from "primereact/timeline"
import { useContext, useLayoutEffect } from "react";
import { useParams } from "react-router-dom"
import { TimelineEventType } from "../../types/TimelineTypes";
import { useGetTimelineData } from "../../utils/customHooks";
import { TimelineContext } from "../Context/TimelineContext";
import TimelineEventCard from "./TimelineEventCard";
type Props = {
    public_view: boolean
}

export default function TimelineView({ public_view }: Props) {
    const { project_id, timeline_id } = useParams();
    const { setTimelineId } = useContext(TimelineContext);
    const timelineData = useGetTimelineData(project_id as string, timeline_id as string);
    useLayoutEffect(() => {

        if (timeline_id) {
            setTimelineId(timeline_id)
        }
    }, [])
    return (
        <div className={`${public_view ? "w-full" : "w-10"
            } h-full flex align-items-end justify-content-center`}>
            <div className="w-full h-full flex  align-items-center">

                {timelineData && <Timeline className="h-10rem" value={timelineData?.timeline_events || []} content={(item: TimelineEventType) => <TimelineEventCard {...item} />} align="alternate" layout="horizontal" />}
            </div>
        </div>
    )
}