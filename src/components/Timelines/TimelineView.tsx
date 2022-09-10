import { Timeline } from "primereact/timeline";
import { useContext, useLayoutEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { TimelineEventType } from "../../types/TimelineEventTypes";
import {
    useGetTimelineData,
    useUpdateTimelineEvent,
} from "../../utils/customHooks";
import { TimelineEventCreateDefault } from "../../utils/defaultValues";
import { TimelineEventDialogReducer } from "../../utils/Reducers/TimelineEventReducers";
import { TimelineContext } from "../Context/TimelineContext";
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
    const [eventState, dispatch] = useReducer(TimelineEventDialogReducer, {
        showCreateEvent: false, showUpdateEvent: false, eventData: TimelineEventCreateDefault
    })

    const [view, setView] = useState({ details: true, horizontal: true });


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
            <TimelineEventCreateDialog
                showDialog={eventState.showCreateEvent}
                setShowDialog={(show: boolean) => dispatch({ type: "SET_SHOW_CREATE", payload: show })}
            />
            <TimelineEventUpdateDialog showDialog={eventState.showUpdateEvent}
                setShowDialog={(show: boolean) => dispatch({ type: "SET_SHOW_UPDATE", payload: show })} />
            <TimelineQuickBar
                view={view}
                setShowTimelineEventDialog={(show: boolean) => dispatch({ type: "SET_SHOW_CREATE", payload: show })}
                setView={setView}
            />
            {timelineData && (
                <div className="w-full h-full flex px-4 align-items-center overflow-x-auto">
                    <Timeline
                        className={`w-full  ${view.details ? "detailedTimeline" : "simpleTimeline"
                            } ${view.horizontal
                                ? "horizontalTimeline h-10rem"
                                : "verticalTimeline h-full"
                            }`}
                        value={timelineData?.timeline_events || []}
                        content={(item: TimelineEventType) =>
                            view.details ? (
                                <TimelineEventCard {...item} />
                            ) : (
                                <SimpleTimelineEvent {...item} />
                            )
                        }
                        // opposite={(item) => item.title}
                        align="alternate"
                        layout={view.horizontal ? "horizontal" : "vertical"}
                    />
                </div>
            )}
        </div>
    );
}
