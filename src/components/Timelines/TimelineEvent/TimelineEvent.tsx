import { Card } from "primereact/card";
import { Dispatch, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineAgeType } from "../../../types/TimelineAgeTypes";
import { TimelineEventType } from "../../../types/TimelineEventTypes";
import { TimelineEventContext } from "../../Context/TimelineEventContext";
import TimelineEventCardSubtitle from "./TimelineEventCard/TimelineEventCardSubtitle";
import TimelineEventIcon from "./TimelineEventIcon";

export default function TimelineEvent({
  index,
  eventData,
  public_view,
  setIconSelect,
  timeline_age,
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
  timeline_age?: TimelineAgeType;
  view: {
    details: "detailed" | "simple";
    horizontal: "horizontal" | "vertical";
  };
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
    map_id,
    eventBgColor,
    styleType,
    icon,
  } = eventData;
  const navigate = useNavigate();
  const { setShowDialog, setEventData } = useContext(TimelineEventContext);
  // Display event card
  if (view.details === "detailed")
    return (
      <div
        className={`flex justify-content-center ${
          doc_id ? "cursor-pointer" : ""
        } ${
          view.horizontal === "horizontal"
            ? index % 2 === 0
              ? "flex-column"
              : "flex-column-reverse"
            : index % 2 === 0
            ? "flex-row"
            : "flex-row-reverse"
        }`}
        style={{
          backgroundColor: timeline_age?.color,
        }}
      >
        <div
          className={`w-20rem h-20rem simpleEventContentEven flex align-items-center ${
            view.horizontal === "horizontal" ? "flex-column" : "flex-row"
          } ${
            index % 2 === 0 ? "justify-content-start" : "justify-content-end"
          }`}
        >
          <Card
            className={`w-18rem h-18rem timelineEventCard ${
              doc_id && "cursor-pointer linkTimelineEventCard"
            }`}
            style={{
              backgroundColor: styleType === "background" ? eventBgColor : "",
              border:
                styleType === "outline" ? `solid 3px ${eventBgColor}` : "",
            }}
            title={() => (
              <div className="timelineCardTitle text-center">
                {title}{" "}
                {doc_id && (
                  <i
                    className="pi pi-file"
                    onClick={() => navigate(`../../../wiki/doc/${doc_id}`)}
                  ></i>
                )}{" "}
                {map_id && (
                  <i
                    className="pi pi-map"
                    onClick={() => navigate(`../../../maps/${map_id}`)}
                  ></i>
                )}{" "}
                {!public_view && (
                  <i
                    className="pi pi-pencil"
                    onClick={() => {
                      setEventData(eventData);
                      setShowDialog(true);
                    }}
                  ></i>
                )}
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
                timeline_age={timeline_age}
              />
            )}
          >
            <div className="w-full h-full flex justify-content-center">
              <p className="w-full text-center m-0">{description}</p>
            </div>
          </Card>
        </div>
        {/* Event timeline line */}
        <div
          className={`w-full relative flex justify-content-center align-items-center ${
            view.horizontal === "vertical" && "w-min"
          }`}
        >
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
    );

  // Display simple event
  return (
    <div
      className={`flex justify-content-center simpleTimelineEvent ${
        doc_id ? "cursor-pointer" : ""
      } ${
        view.horizontal === "horizontal"
          ? index % 2 === 0
            ? "flex-column"
            : "flex-column-reverse"
          : index % 2 === 0
          ? "flex-row"
          : "flex-row-reverse"
      }`}
      style={{
        backgroundColor: timeline_age?.color,
      }}
      onClick={() => {
        if (doc_id && !public_view) navigate(`../../../wiki/doc/${doc_id}`);
      }}
    >
      <div
        className={`simpleEventContent simpleEventContentEven flex flex-column justify-content-${
          view.horizontal === "horizontal"
            ? index % 2 === 0
              ? "start"
              : "end"
            : "center"
        } w-20rem`}
      >
        <div className="m-0 font-bold white-space-nowrap overflow-hidden text-overflow-ellipsis text-center Merriweather">
          {title} <br />
          <span className="text-sm">{timeline_age?.title}</span>
        </div>
        <p className="m-0 text-sm text-white text-center Lato font-bold simpleEventDate">
          {start_day ? start_day + "/" : ""}
          {start_month ? start_month + "/" : ""}
          {start_year} - {end_day ? end_day + "/" : ""}
          {end_month ? end_month + "/" : ""}
          {end_year}
        </p>
      </div>
      {/* Event timeline line */}
      <div
        className={`relative flex justify-content-center align-items-center ${
          view.horizontal === "vertical" && "w-min"
        }`}
      >
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