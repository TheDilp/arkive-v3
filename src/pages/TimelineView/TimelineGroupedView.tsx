import TimelineGroup from "../../components/Timeline/TimelineGroup";
import { CalendarType } from "../../types/ItemTypes/calendarTypes";
import { TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import { sortEvents } from "../../utils/calendarUtils";

type Props = {
  groupItems: number;
  calendars: CalendarType[];
  isReadOnly?: boolean;
  viewSettings: TimelineViewSettings;
  cm: any;
};

export default function TimelineGroupedView({ groupItems, cm, calendars, isReadOnly, viewSettings }: Props) {
  return (
    <>
      {[...Array(groupItems).keys()].map((item) => (
        <TimelineGroup
          key={item}
          cm={cm}
          events={
            calendars
              ?.map((cal) => cal?.events?.map((ev) => ({ ...ev, displayYear: ev.year + cal.offset })))
              ?.flat()
              ?.filter((event) => {
                if (item !== 0) return event?.displayYear > item * 10 && event?.displayYear <= item * 10 + 10;
                return event?.displayYear > 0 && event?.displayYear <= 10;
              })
              .sort(sortEvents) || []
          }
          isReadOnly={isReadOnly}
          viewSettings={viewSettings}
          year={item * 10 + 1}
        />
      ))}
    </>
  );
}
