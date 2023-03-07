import { SelectButton } from "primereact/selectbutton";
import { useState } from "react";
import { useParams } from "react-router-dom";

import DrawerSectionTitle from "../../components/Drawer/DrawerSectionTitle";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import TimelineGroup from "../../components/Timeline/TimelineGroup";
import { useGetItem } from "../../hooks/useGetItem";
import { TimelineType, TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import { sortEvents } from "../../utils/calendarUtils";
import { TimelineGroupingOptions } from "../../utils/timelineUtils";

export default function TimelineView() {
  const { item_id } = useParams();
  const [viewSettings, setViewSettings] = useState<TimelineViewSettings>({ groupByHour: true });
  const { data: timeline, isLoading } = useGetItem<TimelineType>(item_id as string, "timelines");

  if (isLoading) return <LoadingScreen />;
  const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const allEvents = timeline?.calendars?.map((cal) => cal.events)?.flat();
  return (
    <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden p-4">
      <div>
        <DrawerSectionTitle title="Group by hour" />
        <SelectButton
          className="mb-2"
          onChange={(e) => {
            setViewSettings((prev) => ({ ...prev, groupByHour: e.value === "On" }));
          }}
          options={TimelineGroupingOptions}
          value={viewSettings.groupByHour ? "On" : "Off"}
        />
      </div>
      {items.map((item) => (
        <TimelineGroup
          key={item}
          events={
            allEvents
              ?.filter((event) => {
                if (item !== 0) return event.year > item * 10 && event.year <= item * 20;
                return event.year > 0 && event.year <= 10;
              })
              .sort(sortEvents) || []
          }
          viewSettings={viewSettings}
          year={item * 10 + 1}
        />
      ))}
    </div>
  );
}
