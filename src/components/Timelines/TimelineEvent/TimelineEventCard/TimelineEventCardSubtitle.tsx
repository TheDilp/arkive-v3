import { TimelineAgeType } from "../../../../types/TimelineAgeTypes";
import { TimelineEventType } from "../../../../types/TimelineEventTypes";

export default function TimelineEventCardSubtitle({
  start_day,
  start_month,
  start_year,
  end_day,
  end_month,
  end_year,
  timeline_age,
}: Pick<
  TimelineEventType,
  | "start_day"
  | "start_month"
  | "start_year"
  | "end_day"
  | "end_month"
  | "end_year"
> & {
  timeline_age?: TimelineAgeType;
}) {
  return (
    <div className="text-center">
      {start_day ? start_day + "/" : ""}
      {start_month ? start_month + "/" : ""}
      {start_year}{" "}
      {end_year === start_year && !end_day && !end_month ? "" : "-"}{" "}
      {end_day ? end_day + "/" : ""}
      {end_month ? end_month + "/" : ""}
      {end_year === start_year && !end_day && !end_month ? "" : end_year} <br />
      {timeline_age?.title}
    </div>
  );
}
