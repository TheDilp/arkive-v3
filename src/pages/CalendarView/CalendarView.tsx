import { Icon } from "@iconify/react";
import { useSetAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import CalendarEvent from "../../components/Calendar/CalendarEvent";
import DayNumber from "../../components/Calendar/DayNumber";
import DayTitle from "../../components/Calendar/DayTitle";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useGetItem } from "../../hooks/useGetItem";
import { CalendarType, EraType, MonthType } from "../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { getFillerDayNumber, getNextDate, getStartingDayForMonth } from "../../utils/calendarUtils";
import { useEventMenuItems } from "../../utils/contextMenus";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { getItem, setItem } from "../../utils/storage";
import { setTabTitle } from "../../utils/uiUtils";

function MonthDropdownTemplate(data: MonthType) {
  const { title } = data;
  return <div className="font-Lato text-lg">{title}</div>;
}

export default function CalendarView({ isReadOnly }: { isReadOnly?: boolean }) {
  const { item_id, subitem_id } = useParams();
  const { data: calendar, isLoading } = useGetItem<CalendarType>(item_id as string, "calendars", {}, isReadOnly);
  // Event context menu
  const cm = useRef() as any;
  const eventContextMenuItems = useEventMenuItems(item_id as string, "calendars");

  const setDrawer = useSetAtom(DrawerAtom);
  const [date, setDate] = useState<{ month: number; year: number; era: EraType | null }>({ month: 0, year: 1, era: null });
  const monthDays = calendar?.months?.[date.month]?.days;

  const debounceYearChange = useDebouncedCallback((year: number) => {
    setDate((prev) => ({ ...prev, year }));
    setItem(item_id as string, { ...date, year });
  }, 500);
  const era = useMemo(
    () => calendar?.eras?.find((findEra) => date.year >= findEra.start_year && date.year <= findEra.end_year),
    [calendar, date.year],
  );

  useEffect(() => {
    if (calendar) {
      setTabTitle(calendar.title);
      if (subitem_id) {
        const monthIdx = calendar.months.findIndex((mth) => mth.events.some((ev) => ev.id === subitem_id));
        if (monthIdx !== -1) {
          const event = calendar.months[monthIdx].events.find((ev) => ev.id === subitem_id);

          setDate({ year: event?.year as number, month: monthIdx, era: era || null });
        }
      } else {
        const savedDate = getItem(item_id as string) as { year: number; month: number; era: EraType | null };
        if (savedDate)
          setDate({
            ...savedDate,
            era: era || null,
          });
        else setDate({ year: 1, month: 0, era: era || null });
      }
    }
  }, [item_id, subitem_id, calendar, era]);

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="flex h-full w-full max-w-full flex-col">
      <ContextMenu cm={cm} items={eventContextMenuItems} />

      <h2 className="sticky top-0 flex h-14 items-center justify-center bg-zinc-800 pt-2 text-center text-2xl">
        <div className="ml-auto flex w-fit items-center">
          <Icon
            className="cursor-pointer text-zinc-600 transition-colors hover:text-zinc-200"
            fontSize={32}
            icon={IconEnum.chevron_left}
            onClick={() => {
              if (calendar) {
                const previousDate = getNextDate(date, calendar, "previous");
                if (previousDate) setDate((prev) => ({ ...prev, ...previousDate }));
                setItem(item_id as string, previousDate);
              }
            }}
          />
          <span className="w-fit select-none truncate font-Lato">{calendar ? calendar.title : null}</span>

          <Icon
            className="cursor-pointer text-zinc-600 transition-colors hover:text-zinc-200"
            fontSize={32}
            icon={IconEnum.chevron_right}
            onClick={() => {
              if (calendar) {
                const nextDate = getNextDate(date, calendar, "next");
                if (nextDate) setDate((prev) => ({ ...prev, ...nextDate }));
                setItem(item_id as string, nextDate);
              }
            }}
          />
        </div>
        <span className="flex select-none items-center truncate">
          <Dropdown
            className="monthDropdown h-min"
            itemTemplate={MonthDropdownTemplate}
            onChange={(e) => {
              if (calendar) {
                const monthIdx = calendar?.months ? calendar.months.findIndex((month) => month.id === e.value.id) : 0;
                const newMonthDays = calendar?.months?.[monthIdx]?.days;
                if (newMonthDays)
                  setDate((prev) => ({
                    ...prev,
                    month: monthIdx,
                  }));
                setItem(item_id as string, { ...date, month: monthIdx });
              }
            }}
            optionLabel="title"
            options={calendar?.months}
            value={calendar?.months?.[date?.month]}
          />
        </span>
        <div className="px-2">
          <InputNumber
            className="yearInput"
            inputClassName="w-full max-w-full"
            onChange={(e) => {
              if (e.value) debounceYearChange(e.value);
            }}
            prefix="Year: "
            useGrouping={false}
            value={date.year}
          />
        </div>
        <span className="w-fit select-none truncate text-base italic">
          {date?.era ? `(${date.year - date.era.start_year + 1} - ${date.era.title})` : null}
        </span>
        {!isReadOnly ? (
          <span className="ml-auto flex">
            <Button
              className="p-button-text"
              onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "eras" })}
              tooltip="Add eras"
              tooltipOptions={{ position: "left" }}>
              <Icon className="cursor-pointer transition-colors hover:text-sky-400" fontSize={28} icon="ph:scroll-thin" />
            </Button>
            <Button
              className="p-button-text"
              onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "months" })}
              tooltip="Create months"
              tooltipOptions={{ position: "left" }}>
              <Icon
                className="cursor-pointer transition-colors hover:text-sky-400"
                fontSize={28}
                icon={IconEnum.add_calendar}
              />
            </Button>
          </span>
        ) : (
          <div className="ml-auto" />
        )}
      </h2>
      <div className="h-full overflow-hidden">
        {calendar ? (
          <div className="h-full overflow-hidden pb-16">
            <div className="flex h-full w-full flex-col content-start overflow-auto border border-zinc-700">
              <div
                className="grid h-full w-full content-start overflow-auto"
                style={{
                  gridTemplateColumns: `repeat(${calendar?.days?.length || 0}, minmax(9rem, 1fr))`,
                }}>
                {calendar?.days?.map((day, index) => (
                  <div
                    key={day}
                    className="group col-span-1 h-min border-b border-zinc-700 text-white"
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={-1}>
                    <DayTitle key={day} index={index} weekdays={calendar?.days ?? 0} />
                  </div>
                ))}
                {[
                  ...Array(
                    calendar?.days?.length
                      ? getStartingDayForMonth(calendar?.months, date?.year, date?.month, calendar?.days?.length) %
                          calendar.days.length
                      : 0,
                  ).keys(),
                ]
                  .reverse()
                  .map((day) => (
                    <div
                      key={day}
                      className="group col-span-1 h-56 border-b border-r border-zinc-700 hover:text-white"
                      onKeyDown={() => {}}
                      role="button"
                      tabIndex={-1}>
                      <DayNumber
                        key={day}
                        dayNumber={getFillerDayNumber(calendar.months, date.month, day)}
                        isFiller
                        isReadOnly={isReadOnly}
                        month={calendar.months[date.month]}
                        year={date.year}
                      />
                    </div>
                  ))}
                {[...Array(monthDays).keys()].map((day, index) => (
                  <div
                    key={day}
                    className="group col-span-1 flex h-56 flex-col border-b border-r border-zinc-700 hover:text-white"
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={-1}>
                    <DayNumber
                      key={day}
                      dayNumber={day}
                      isReadOnly={isReadOnly}
                      month={calendar.months[date.month]}
                      year={date.year}
                    />
                    <CalendarEvent
                      cm={cm}
                      dayEvents={calendar?.months[date.month]?.events?.filter((ev) => ev?.day === day + 1) || []}
                      index={index}
                      isReadOnly={isReadOnly}
                      month={calendar.months[date.month]}
                      year={date.year}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
