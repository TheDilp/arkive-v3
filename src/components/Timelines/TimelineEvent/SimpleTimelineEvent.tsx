import { useNavigate } from "react-router-dom";
import { TimelineEventType } from "../../../types/TimelineEventTypes";

export default function SimpleTimelineEvent({
    id,
    title,
    start_day,
    start_month,
    start_year,
    end_day,
    end_month,
    end_year,
    doc_id,
    public_view,
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
    | "end_year"
> & { public_view: boolean }) {
    const navigate = useNavigate();
    return (
        <div
            id={id}
            className={`simple-event ${doc_id ? "cursor-pointer" : ""}`}
            onClick={() => {
                if (doc_id && !public_view) navigate(`../../../wiki/doc/${doc_id}`);
            }}
        >
            <h4 className="m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {title}
            </h4>
            <h5 className="m-0">
                {start_day ? start_day + "/" : ""}
                {start_month ? start_month + "/" : ""}
                {start_year} - {end_day ? end_day + "/" : ""}
                {end_month ? end_month + "/" : ""}
                {end_year}
            </h5>
        </div>
    );
}
