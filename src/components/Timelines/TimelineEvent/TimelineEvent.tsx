import { Card } from "primereact/card";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineEventType } from "../../../types/TimelineEventTypes";
import TimelineEventCardSubtitle from "./TimelineEventCard/TimelineEventCardSubtitle";
import TimelineEventIcon from "./TimelineEventIcon";

export default function TimelineEvent({
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
        description,
        start_day,
        start_month,
        start_year,
        end_day,
        end_month,
        end_year,
        doc_id,
        eventBgColor,
        styleType,
        icon,
    } = eventData;
    const navigate = useNavigate();

    // Display event card
    if (view.details) return <div className={`flex justify-content-center ${doc_id ? "cursor-pointer" : ""
        } ${view.horizontal
            ? index % 2 === 0
                ? "flex-column"
                : "flex-column-reverse"
            : index % 2 === 0
                ? "flex-row"
                : "flex-row-reverse"
        }`}>
        <div className={`h-20rem simpleEventContentEven flex flex-column ${index % 2 === 0 ? "justify-content-start" : "justify-content-end"}`}>
            <Card
                className={`w-20rem h-18rem timelineEventCard ${doc_id && "cursor-pointer linkTimelineEventCard"
                    }`}
                style={{
                    backgroundColor: styleType === "background" ? eventBgColor : "",
                    border: styleType === "outline" ? `solid 3px ${eventBgColor}` : ""
                }}
                title={() => (
                    <div className="timelineCardTitle text-center">
                        {title}{" "}
                        {!public_view && <i
                            className="pi pi-pencil"
                            onClick={() => {
                                // setEventData(eventData);
                                // setShowDialog(true);
                            }}
                        ></i>}
                    </div>
                )}
                subTitle={() => (
                    <TimelineEventCardSubtitle
                        start_day={start_day}
                        start_month={start_month}
                        start_year={start_year}
                        end_day={end_day}
                        end_month={end_month}
                        end_year={end_year}
                    />
                )}
                onClick={() => {
                    // if (doc_id)
                    //     navigate(`../../../wiki/doc/${doc_id}`)
                }}
            >
                <div className="w-full h-full flex justify-content-center">
                    <p className="w-full text-center">{description}</p>
                </div>
            </Card>
        </div>
        {/* Event timeline line */}
        <div className={`w-full relative flex justify-content-center align-items-center ${!view.horizontal && "w-min"}`}>
            <span className="absolute z-2 bg-gray-900 border-circle">
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
        <div className="w-20rem h-20rem simpleEventContentOdd"></div>
    </div>

    // Display simple event
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
            <div className="simpleEventContent simpleEventContentEven flex flex-column justify-content-center w-20rem">
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
            <div className={`w-full relative flex justify-content-center align-items-center ${!view.horizontal && "w-min"}`}>
                <span className="absolute z-2 bg-gray-900 border-circle">
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
            <div className="simpleEventContent simpleEventContentOdd w-20rem"></div>
        </div>
    );
}
