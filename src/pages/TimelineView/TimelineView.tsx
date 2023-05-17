import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { SelectButton } from "primereact/selectbutton";
import { Timeline } from "primereact/timeline";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import TimelineCard from "../../components/Card/TimelineCard";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import DrawerSection from "../../components/Drawer/DrawerSection";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useGetItem } from "../../hooks/useGetItem";
import { TimelineType, TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import { useEventMenuItems } from "../../utils/contextMenus";
import { TimelineGroupingOptions, TimelineModeOptions, TimelineViewOptions } from "../../utils/timelineUtils";
import { scrollElementIntoView } from "../../utils/uiUtils";
import TimelineGroupedView from "./TimelineGroupedView";

type Props = { isReadOnly?: boolean };

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

export default function TimelineView({ isReadOnly }: Props) {
  const { item_id } = useParams();
  const [viewSettings, setViewSettings] = useState<TimelineViewSettings>({
    groupBy: true,
    view: { label: "Vertical", value: "Vertical" },
    mode: { label: "Detailed", value: "Detailed" },
  });
  const [year, setYear] = useState(1);
  const { data: timeline, isLoading } = useGetItem<TimelineType>(item_id as string, "timelines", {}, isReadOnly);

  // Event context menu
  const cm = useRef() as any;
  const eventContextMenuItems = useEventMenuItems(item_id as string, "timelines");

  const [groupItems, setGroupItems] = useState(10);
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <ContextMenu cm={cm} items={eventContextMenuItems} />

      <div className="flex w-full gap-x-2">
        <DrawerSection title="Group by year">
          <SelectButton
            className="mb-2"
            disabled={viewSettings.view.value !== "Grouped"}
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
              disabled={viewSettings.view.value !== "Grouped"}
              label="Jump"
              onClick={() => scrollToYear({ year, groupItems, setGroupItems, groupBy: viewSettings.groupBy })}
            />
            <InputNumber
              className="w-24"
              disabled={viewSettings.view.value !== "Grouped"}
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
        <div className="ml-auto flex gap-x-2">
          {viewSettings.view.value !== "Grouped" ? (
            <DrawerSection title="Mode">
              <SelectButton
                className="mb-2"
                onChange={(e) => {
                  if (e.value) setViewSettings((prev) => ({ ...prev, mode: { label: e.value, value: e.value } }));
                }}
                optionDisabled="isDisabled"
                optionLabel="label"
                options={TimelineModeOptions}
                value={viewSettings.mode.label}
              />
            </DrawerSection>
          ) : null}
          <DrawerSection title="Viewing mode">
            <SelectButton
              className="mb-2"
              onChange={(e) => {
                if (e.value) setViewSettings((prev) => ({ ...prev, view: { label: e.value, value: e.value } }));
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
        {viewSettings.view.value === "Grouped" ? (
          <TimelineGroupedView
            calendars={timeline?.calendars || []}
            cm={cm}
            groupItems={groupItems}
            isReadOnly={isReadOnly}
            viewSettings={viewSettings}
          />
        ) : null}
        <div className="flex h-full w-full justify-center overflow-auto">
          {viewSettings.view.value === "Vertical" || viewSettings.view.value === "Horizontal" ? (
            <div
              className={`${
                viewSettings.view.value === "Horizontal" ? "overlfow-x-auto flex w-full max-w-6xl justify-center" : "max-w-6xl"
              }`}>
              <Timeline
                align="alternate"
                className={viewSettings.view.value === "Horizontal" ? "horizontalTimeline" : "vertical"}
                content={(event) => TimelineCard(event, viewSettings)}
                layout={viewSettings.view.value === "Vertical" ? "vertical" : "horizontal"}
                value={timeline?.calendars?.flatMap((cal) => cal.events) || []}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
