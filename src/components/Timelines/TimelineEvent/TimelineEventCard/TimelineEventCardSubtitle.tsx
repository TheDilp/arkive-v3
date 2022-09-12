import { TimelineEventType } from "../../../../types/TimelineEventTypes";

export default function TimelineEventCardSubtitle({
    start_day,
    start_month,
    start_year,
    end_day,
    end_month,
    end_year,
    age,
}: Pick<
    TimelineEventType,
    | "start_day"
    | "start_month"
    | "start_year"
    | "end_day"
    | "end_month"
    | "end_year"
    | "age"
>) {
    return (
        <div className="text-center">
            {start_day ? start_day + "/" : ""}
            {start_month ? start_month + "/" : ""}
            {start_year} - {end_day ? end_day + "/" : ""}
            {end_month ? end_month + "/" : ""}
            {end_year}
        </div>
    );
}
