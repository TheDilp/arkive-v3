import { TimelineEventType } from "../../../../types/TimelineEventTypes";

export default function TimelineEventCardSubtitle({
  start_day,
  start_month,
  start_year,
  end_day,
  end_month,
  end_year,
  timeline_ages,
}: Pick<
  TimelineEventType,
  | "start_day"
  | "start_month"
  | "start_year"
  | "end_day"
  | "end_month"
  | "end_year"
  | "timeline_ages"
>) {
  return (
    <div className="text-center">
      {start_day ? start_day + "/" : ""}
      {start_month ? start_month + "/" : ""}
      {start_year}{" "}
      {end_year === start_year && !end_day && !end_month ? "" : "-"}{" "}
      {end_day ? end_day + "/" : ""}
      {end_month ? end_month + "/" : ""}
      {end_year === start_year && !end_day && !end_month ? "" : end_year} <br />
      {timeline_ages?.title}
    </div>
  );
}
