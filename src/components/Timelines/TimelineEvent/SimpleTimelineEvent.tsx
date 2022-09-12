import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineEventType } from "../../../types/TimelineEventTypes";
import TimelineEventIcon from "./TimelineEventCard/TimelineEventIcon";

export default function SimpleTimelineEvent({
    index,
    eventData,
    public_view,
    setIconSelect,
    view,
}: {
    index: number;
    eventData: TimelineEventType;
    public_view: boolean;
    setIconSelect: Dispatch<
        SetStateAction<{
            id?: string;
            show: boolean;
            top: number;
            left: number;
        }>
    >;
    view: { details: boolean; horizontal: boolean };
}) {
    const {
        id,
        title,
        start_day,
        start_month,
        start_year,
        end_day,
        end_month,
        end_year,
        doc_id,
        eventBgColor,
        icon,
    } = eventData;
    const navigate = useNavigate();
    return (
        <div
            id={id}
            className={`flex justify-content-center simpleTimelineEvent ${doc_id ? "cursor-pointer" : ""
                } ${view.horizontal
                    ? index % 2 === 0
                        ? "flex-column"
                        : "flex-column-reverse"
                    : index % 2 === 0
                        ? "flex-row"
                        : "flex-row-reverse"
                }`}
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
            <div className={`w-full relative flex justify-content-center align-items-center`}>
                <span className="absolute z-5 bg-gray-900 border-circle">
                    <TimelineEventIcon
                        id={id}
                        eventBgColor={eventBgColor}
                        icon={icon}
                        setIconSelect={setIconSelect}
                        public_view={public_view}
                    />
                </span>
                <div className="w-full z-1 border-top-1 border-left-1 h-full"></div>
            </div>
            <div className="simpleEventContent simpleEventContentOdd"></div>
        </div>
    );
}
