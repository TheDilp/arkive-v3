import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CalendarEvent from "../../components/Calendar/Event";
import { useGetItem } from "../../hooks/useGetItem";
import { CalendarType, MonthType } from "../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

function MonthDropdownTemplate(data: MonthType) {
  const { title } = data;
  return <div className="font-Lato text-lg">{title}</div>;
}
function getNextDate(date: { month: number; year: number; weeks: number }, calendar: CalendarType, type: "next" | "previous") {
  const { month, year } = date;
  const numberOfMonths = calendar?.months?.length;
  // const monthDays = calendar?.months?.[month]?.days;
  if (numberOfMonths) {
    if (type === "next") {
      if (month === numberOfMonths - 1) {
        const monthDays = calendar?.months?.[0]?.days;
        return { month: 0, year: year + 1, weeks: Math.floor(monthDays / calendar.days.length) };
      }
      const monthDays = calendar?.months?.[month + 1]?.days;
      return { month: month + 1, year, weeks: Math.floor(monthDays / calendar.days.length) };
    }
    if (type === "previous") {
      if (month === 0) {
        const monthDays = calendar?.months?.[numberOfMonths - 1]?.days;
        return {
          month: numberOfMonths - 1,
          year: year - 1 === 0 ? -1 : year - 1,
          weeks: Math.floor(monthDays / calendar.days.length),
        };
      }
      const monthDays = calendar?.months?.[month - 1]?.days;
      return { month: month - 1, year, weeks: Math.floor(monthDays / calendar.days.length) };
    }
    return date;
  }
  return date;
}
function getStartingDayForMonth(
  months: MonthType[] | undefined,
  year: number,
  monthIndex: number,
  weekdays: number | undefined,
) {
  if (year === undefined || !months || !weekdays) return 0;
  if (year === 1 && monthIndex === 0) return 0;
  const dayInYear = months.reduce((accumulator, currentValue) => accumulator + currentValue.days, 0);
  const dayBeforeMonth = months
    .filter((_, index) => index < monthIndex)
    .reduce((accumulator, currentValue) => accumulator + currentValue.days, 0);
  let daysBeforeYear;
  if (year < 0) {
    daysBeforeYear = 0;
  } else {
    daysBeforeYear = (year - 1) * dayInYear;
  }

  return (daysBeforeYear % weekdays) + dayBeforeMonth;
}
function getFillerDayNumber(calendarMonths: MonthType[], currentMonthIndex: number, day: number) {
  if (currentMonthIndex === 0) {
    return calendarMonths[calendarMonths.length - 1].days - day - 1;
  }
  return calendarMonths[currentMonthIndex - 1].days - day - 1;
}

function DayTitle({ index, weekdays }: { index: number; weekdays: string[] }) {
  if (index < 10)
    return (
      <span className="select-none font-Lato text-lg text-zinc-400 transition-colors hover:text-white">{weekdays[index]}</span>
    );
  return (
    <span className="select-none font-Lato text-lg text-zinc-400 transition-colors hover:text-white">
      {weekdays[index % weekdays.length || 0]}
    </span>
  );
}

function DayNumber({
  dayNumber,
  month,
  year,
  isFiller,
}: {
  dayNumber: number;
  month: MonthType;
  year: number;
  isFiller?: boolean;
}) {
  const [, setDrawer] = useAtom(DrawerAtom);
  return (
    <span className={`${isFiller ? "text-zinc-800" : ""} flex select-none items-center p-1`}>
      {dayNumber + 1}
      {!isFiller ? (
        <span className="ml-auto opacity-0 transition-all duration-100 hover:text-sky-400 group-hover:opacity-100">
          <Icon
            icon="mdi:plus"
            onClick={() => {
              if (!isFiller)
                setDrawer({
                  ...DefaultDrawer,
                  data: { day: dayNumber + 1, monthsId: month?.id, year },

                  type: "events",
                  show: true,
                });
            }}
          />
        </span>
      ) : null}
    </span>
  );
}

export default function CalendarView() {
  const { item_id } = useParams();
  const { data: calendar, isLoading } = useGetItem<CalendarType>(item_id as string, "calendars");
  const [, setDrawer] = useAtom(DrawerAtom);
  const [date, setDate] = useState({ month: 0, year: 1, weeks: 0 });
  const monthDays = calendar?.months?.[date.month]?.days;
  useEffect(() => {
    if (monthDays) {
      setDate((prev) => ({ ...prev, weeks: Math.floor(monthDays / calendar.days.length) }));
    }
  }, [calendar]);

  if (isLoading) return <ProgressSpinner />;
  return (
    <div className="flex h-full w-full max-w-full flex-col">
      <h2 className="sticky top-0 flex h-14 items-center justify-center bg-zinc-800 pt-2 text-center text-2xl">
        <div className="ml-auto flex w-fit items-center">
          <Icon
            className="cursor-pointer text-zinc-600 transition-colors hover:text-zinc-200"
            fontSize={32}
            icon="mdi:chevron-left"
            onClick={() => {
              if (calendar) {
                const previousDate = getNextDate(date, calendar, "previous");
                if (previousDate) setDate(previousDate);
              }
            }}
          />
          <span className="w-fit select-none font-Lato">{calendar ? calendar.title : null}</span>

          <Icon
            className="cursor-pointer text-zinc-600 transition-colors hover:text-zinc-200"
            fontSize={32}
            icon="mdi:chevron-right"
            onClick={() => {
              if (calendar) {
                const nextDate = getNextDate(date, calendar, "next");
                if (nextDate) setDate(nextDate);
              }
            }}
          />
        </div>
        <span className="flex max-w-[10rem] select-none items-center text-lg ">
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
                    weeks: Math.floor(newMonthDays / calendar.days.length),
                  }));
              }
            }}
            optionLabel="title"
            options={calendar?.months}
            value={calendar?.months?.[date?.month]}
          />
          <InputNumber
            inputClassName="yearInput"
            onBlur={(e) => {
              const year = parseFloat(e.currentTarget.value);
              setDate((prev) => ({ ...prev, year }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const year = parseFloat(e.currentTarget.value);
                setDate((prev) => ({ ...prev, year }));
              }
            }}
            prefix="Year: "
            value={date.year}
          />
        </span>
        <span className="ml-auto flex">
          <Button
            className="p-button-text"
            onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "eras" })}
            tooltip="Add eras"
            tooltipOptions={{ position: "left" }}>
            <Icon className="cursor-pointer transition-colors hover:text-sky-400" fontSize={28} icon="ic:twotone-history-edu" />
          </Button>
          <Button
            className="p-button-text"
            onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "months" })}
            tooltip="Create months"
            tooltipOptions={{ position: "left" }}>
            <Icon className="cursor-pointer transition-colors hover:text-sky-400" fontSize={28} icon="ph:calendar-plus-thin" />
          </Button>
        </span>
      </h2>
      <div className="h-full overflow-hidden">
        {calendar ? (
          <div className="h-full overflow-hidden">
            <div className="flex h-full w-full flex-col content-start overflow-auto border border-zinc-700">
              <div
                className="grid h-full w-full content-start overflow-auto"
                style={{
                  gridTemplateColumns: `repeat(${calendar.days.length}, minmax(9rem, auto))`,
                }}>
                {calendar.days.map((day, index) => (
                  <div key={day} className="group col-span-1 h-min text-white" onKeyDown={() => {}} role="button" tabIndex={-1}>
                    <DayTitle key={day} index={index} weekdays={calendar.days} />
                  </div>
                ))}
                {[
                  ...Array(
                    getStartingDayForMonth(calendar?.months, date.year, date.month, calendar?.days.length) %
                      calendar.days.length,
                  ).keys(),
                ]
                  .reverse()
                  .map((day) => (
                    <div
                      key={day}
                      className="group col-span-1 h-56 border border-zinc-700 hover:text-white"
                      onKeyDown={() => {}}
                      role="button"
                      tabIndex={-1}>
                      <DayNumber
                        key={day}
                        dayNumber={getFillerDayNumber(calendar.months, date.month, day)}
                        isFiller
                        month={calendar.months?.[date.month]}
                        year={date.year}
                      />
                    </div>
                  ))}
                {[...Array(monthDays).keys()].map((day, index) => (
                  <div
                    key={day}
                    className="group col-span-1 h-56 border border-zinc-700 hover:text-white"
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={-1}>
                    <DayNumber key={day} dayNumber={day} month={calendar.months?.[date.month]} year={date.year} />
                    <CalendarEvent index={index} monthEvents={calendar.months?.[date.month]?.events || []} year={date.year} />
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
