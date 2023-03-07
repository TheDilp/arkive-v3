import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { useState } from "react";
import { useParams } from "react-router-dom";

import DrawerSection from "../../components/Drawer/DrawerSection";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import TimelineGroup from "../../components/Timeline/TimelineGroup";
import { useGetItem } from "../../hooks/useGetItem";
import { TimelineType, TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import { sortEvents } from "../../utils/calendarUtils";
import { TimelineGroupingOptions, TimelineViewOptions } from "../../utils/timelineUtils";
import { scrollElementIntoView } from "../../utils/uiUtils";

function scrollToYear({
  year,
  groupItems,
  setGroupItems,
}: {
  year: number;
  groupItems: number;
  setGroupItems: (newItems: number) => void;
}) {
  if (year <= groupItems * 10) {
    scrollElementIntoView(`[data-year="${year}"]`);
    return;
  }
  let newGroupItems = groupItems + 10;
  while (newGroupItems * 10 <= year) {
    newGroupItems += 10;
  }
  setGroupItems(newGroupItems);
  setTimeout(() => {
    scrollElementIntoView(`[data-year="${year}"]`);
  }, 100);
}

export default function TimelineView() {
  const { item_id } = useParams();
  const [viewSettings, setViewSettings] = useState<TimelineViewSettings>({
    groupByHour: true,
    view: { label: "Grouped", value: "Grouped" },
  });
  const [year, setYear] = useState(1);
  const { data: timeline, isLoading } = useGetItem<TimelineType>(item_id as string, "timelines");

  const [groupItems, setGroupItems] = useState(10);
  if (isLoading) return <LoadingScreen />;
  const allEvents = timeline?.calendars?.map((cal) => cal.events)?.flat();
  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <div className="flex w-full gap-x-2">
        <DrawerSection title="Group by year">
          <SelectButton
            className="mb-2"
            onChange={(e) => {
              setViewSettings((prev) => ({ ...prev, groupByHour: e.value === "On" }));
            }}
            options={TimelineGroupingOptions}
            value={viewSettings.groupByHour ? "On" : "Off"}
          />
        </DrawerSection>
        <DrawerSection title="Jump to year">
          <div className="flex gap-x-1">
            <Button
              className="p-button-outlined mb-2"
              label="Jump"
              onClick={() => scrollToYear({ year, groupItems, setGroupItems })}
            />
            <InputNumber
              className="w-24"
              inputClassName="w-full"
              onChange={(e) => {
                if (e.value) setYear(e.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  scrollToYear({ year, groupItems, setGroupItems });
                }
              }}
              value={year}
            />
          </div>
        </DrawerSection>
        <div className="ml-auto">
          <DrawerSection title="Viewing mode">
            <SelectButton
              className="mb-2"
              onChange={(e) => {
                if (e.value) setViewSettings((prev) => ({ ...prev, view: e.value }));
              }}
              optionDisabled="isDisabled"
              optionLabel="label"
              options={TimelineViewOptions}
              value={viewSettings.view.label}
            />
          </DrawerSection>
        </div>
      </div>
      <div
        className="flex h-full flex-col overflow-y-auto"
        onScroll={(e) => {
          const { currentTarget } = e;
          if (currentTarget) {
            const scrollFetchMarker = currentTarget.scrollHeight - currentTarget.scrollTop - currentTarget.clientHeight <= 50;
            if (scrollFetchMarker) {
              setGroupItems((prev) => prev + 10);
            }
          }
        }}>
        {[...Array(groupItems).keys()].map((item) => (
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
    </div>
  );
}
