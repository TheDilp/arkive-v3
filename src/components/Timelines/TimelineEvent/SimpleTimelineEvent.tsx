import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineEventType } from "../../../types/TimelineEventTypes";
import TimelineEventIcon from "./TimelineEventCard/TimelineEventIcon";

export default function SimpleTimelineEvent({
    id,
    title,
    start_day,
    start_month,
    start_year,
    end_day,
    end_month,
    end_year,
    eventBgColor, icon,
    doc_id,
    public_view,
    setIconSelect,
    view,
}: Pick<
    TimelineEventType,
    | "id"
    | "title"
    | "doc_id"
    | "start_day"
    | "start_month"
    | "start_year"
    | "end_day"
    | "end_month"
    | "end_year" | "eventBgColor" | "icon"
> & {
    public_view: boolean,
    setIconSelect: Dispatch<
        SetStateAction<{
            id?: string;
            show: boolean;
            top: number;
            left: number;
        }>
    >;
    view: { details: boolean, horizontal: boolean }
}) {
    const navigate = useNavigate();
    return (
        <div
            id={id}
            className={`flex  justify-content-center simpleTimelineEvent ${doc_id ? "cursor-pointer" : ""}`}
            onClick={() => {
                if (doc_id && !public_view) navigate(`../../../wiki/doc/${doc_id}`);
            }}
        >
            <div className="simpleEventContent simpleEventContentEven flex flex-column justify-content-center">
                <h4 className="m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis text-center Merriweather">
                    {title}
                </h4>
                <p className="m-0 text-center Lato text-gray-500 font-bold simpleEventDate">
                    {start_day ? start_day + "/" : ""}
                    {start_month ? start_month + "/" : ""}
                    {start_year} - {end_day ? end_day + "/" : ""}
                    {end_month ? end_month + "/" : ""}
                    {end_year}
                </p>
            </div>
            {/* Event timeline line */}
            <div className="w-full relative flex align-items-center">
                <span className="absolute z-5 bg-gray-900 border-circle">
                    <TimelineEventIcon
                        id={id}
                        eventBgColor={eventBgColor}
                        icon={icon}
                        setIconSelect={setIconSelect}
                        public_view={public_view}
                    />
                </span>
                <hr className="w-full z-1" />
            </div>
            <div className="simpleEventContent simpleEventContentOdd">
            </div>
        </div>
    );
}
