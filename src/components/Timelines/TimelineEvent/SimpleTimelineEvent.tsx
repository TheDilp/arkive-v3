import { TimelineEventType } from "../../../types/TimelineEventTypes";

export default function SimpleTimelineEvent({
    title,
    start_day,
    start_month,
    start_year,
    end_day,
    end_month,
    end_year,
}: Pick<
    TimelineEventType,
    | "title"
    | "start_day"
    | "start_month"
    | "start_year"
    | "end_day"
    | "end_month"
    | "end_year"
>) {
    const FormattedDate = () => (
        <>
            {start_day ? start_day + "/" : ""}
            {start_month ? start_month + "/" : ""}
            {start_year}
            {(start_day !== end_day ||
                start_month !== end_month ||
                start_year !== end_year) && (
                    <span>
                        - {end_day ? end_day + "/" : ""}
                        {end_month ? end_month + "/" : ""}
                        {end_year}
                    </span>
                )}
        </>
    );

    return (
        <div className="simple-event">
            <h4 className="m-0">{title}</h4>
            <h5 className="m-0"><FormattedDate /></h5>
        </div>
    );
}
