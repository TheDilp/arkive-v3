import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DrawerSection from "../../components/Drawer/DrawerSection";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import TimelineGroup from "../../components/Timeline/TimelineGroup";
import { useGetItem } from "../../hooks/useGetItem";
import { TimelineType, TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import { sortEvents } from "../../utils/calendarUtils";
import { TimelineGroupingOptions, TimelineViewOptions } from "../../utils/timelineUtils";
import { scrollElementIntoView } from "../../utils/uiUtils";

function scrollBasedOnGroup(groupBy: boolean, year: number) {
  if (groupBy) {
    scrollElementIntoView(`[data-year="${year}"]`);
  } else {
    const stringYear = parseFloat(`${year.toString().slice(0, -1)}1`);
    scrollElementIntoView(`[data-start-year="${stringYear}"]`);
  }
}

function scrollToYear({
  year,
  groupItems,
  setGroupItems,
  groupBy,
}: {
  year: number;
  groupItems: number;
  setGroupItems: (newItems: number) => void;
  groupBy: boolean;
}) {
  if (year <= groupItems * 10) {
    scrollBasedOnGroup(groupBy, year);
  } else {
    let newGroupItems = groupItems + 10;
    while (newGroupItems * 10 <= year) {
      newGroupItems += 10;
    }
    setGroupItems(newGroupItems);
    setTimeout(() => {
      scrollBasedOnGroup(groupBy, year);
    }, 100);
  }
}

export default function TimelineView() {
  const { item_id } = useParams();
  const [viewSettings, setViewSettings] = useState<TimelineViewSettings>({
    groupBy: true,
    view: { label: "Grouped", value: "Grouped" },
  });
  const [year, setYear] = useState(1);
  const { data: timeline, isLoading } = useGetItem<TimelineType>(item_id as string, "timelines");

  useEffect(() => {
    console.log(timeline);
  }, [timeline?.calendars]);

  const [groupItems, setGroupItems] = useState(10);
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <div className="flex w-full gap-x-2">
        <DrawerSection title="Group by year">
          <SelectButton
            className="mb-2"
            onChange={(e) => {
              setViewSettings((prev) => ({ ...prev, groupBy: e.value === "On" }));
            }}
            options={TimelineGroupingOptions}
            value={viewSettings.groupBy ? "On" : "Off"}
          />
        </DrawerSection>
        <DrawerSection title="Jump to year">
          <div className="flex gap-x-1">
            <Button
              className="p-button-outlined mb-2"
              label="Jump"
              onClick={() => scrollToYear({ year, groupItems, setGroupItems, groupBy: viewSettings.groupBy })}
            />
            <InputNumber
              className="w-24"
              inputClassName="w-full"
              onChange={(e) => {
                if (e.value) setYear(e.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  scrollToYear({ year, groupItems, setGroupItems, groupBy: viewSettings.groupBy });
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
              timeline?.calendars
                ?.map((cal) => cal?.events?.map((ev) => ({ ...ev, displayYear: ev.year + cal.offset })))
                ?.flat()
                ?.filter((event) => {
                  if (item !== 0) return event.displayYear > item * 10 && event.displayYear <= item * 10 + 10;
                  return event.displayYear > 0 && event.displayYear <= 10;
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
