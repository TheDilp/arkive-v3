import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { CalendarCreateType, CalendarType } from "../../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { DefaultCalendar } from "../../../utils/DefaultValues/CalendarDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

function disableCalendarSaveButton(localItem: CalendarType | CalendarCreateType) {
  if (!localItem.title || ("days" in localItem && !localItem?.days?.length) || localItem.weeks === 0) return true;
  return false;
}

export default function DrawerCalendarContent() {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createCalendarMutation = useCreateItem<CalendarType>("calendars");
  const updateCalendarMutation = useUpdateItem<CalendarType>("calendars", project_id as string);
  const deleteCalendarMutation = useDeleteItem("calendars", project_id as string);
  const allCalendars = queryClient.getQueryData<CalendarType[]>(["allItems", project_id, "calendars"]);
  const calendar = allCalendars?.find((dict) => dict.id === drawer?.data?.id);

  const [localItem, setLocalItem] = useState<CalendarType | CalendarCreateType>(
    drawer?.data ?? { ...DefaultCalendar, project_id },
  );
  const [months, setMonths] = useState<{ id: string; title: string }[]>(
    localItem?.months?.map((month) => ({ id: crypto.randomUUID(), title: month })) || [],
  );
  const [days, setDays] = useState<{ id: string; title: string }[]>(
    localItem?.days?.map((day) => ({ id: crypto.randomUUID(), title: day })) || [],
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  useEffect(() => {
    if (months.length) {
      handleChange({ name: "months", value: months.map((month) => month.title) });
    }
  }, [months]);
  useEffect(() => {
    if (days.length) {
      handleChange({ name: "days", value: days.map((day) => day.title) });
    }
  }, [days]);

  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center font-Lato text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create New Calendar"}</h2>
      <DrawerSection title="Calendar title">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await createUpdateItem<CalendarType>(
                calendar,
                localItem,
                changedData,
                "boards",
                project_id as string,
                queryClient,
                DefaultCalendar,
                allCalendars,
                resetChanges,
                createCalendarMutation.mutateAsync,
                updateCalendarMutation.mutateAsync,
                setDrawer,
              );
            }
          }}
          placeholder="Calendar title"
          value={localItem?.title || ""}
        />
      </DrawerSection>

      <DrawerSection title="Number of weeks">
        <InputNumber
          className="w-full"
          name="weeks"
          onChange={(e) => handleChange({ name: "weeks", value: e.value })}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await createUpdateItem<CalendarType>(
                calendar,
                localItem,
                changedData,
                "boards",
                project_id as string,
                queryClient,
                DefaultCalendar,
                allCalendars,
                resetChanges,
                createCalendarMutation.mutateAsync,
                updateCalendarMutation.mutateAsync,
                setDrawer,
              );
            }
          }}
          placeholder="Number of weeks"
          value={localItem?.weeks as number}
        />
      </DrawerSection>

      <div className="flex items-start gap-x-2">
        <Button
          className="p-button-outlined p-button-info w-full"
          disabled={createCalendarMutation.isLoading || updateCalendarMutation.isLoading}
          onClick={() => {
            setMonths((prev) => [...prev, { id: crypto.randomUUID(), title: "New Month" }]);
          }}
          type="submit">
          {buttonLabelWithIcon("Add month", "ph:calendar-thin")}
        </Button>
        <Button
          className="p-button-outlined p-button-info w-full"
          disabled={createCalendarMutation.isLoading || updateCalendarMutation.isLoading}
          onClick={() => {
            setDays((prev) => [...prev, { id: crypto.randomUUID(), title: "New Day" }]);
          }}
          type="submit">
          {buttonLabelWithIcon("Add day", "ph:calendar-thin")}
        </Button>
      </div>
      <hr className="border-zinc-600" />
      <DrawerSection title="Months">
        <div className="flex flex-col gap-y-1">
          {months
            ? months?.map((month, index) => (
                <InputText
                  key={month.id}
                  onChange={(e) =>
                    setMonths((prev) => {
                      const tempPrev = [...prev];
                      tempPrev[index].title = e.target.value;
                      return tempPrev;
                    })
                  }
                  value={month.title}
                />
              ))
            : null}
        </div>
      </DrawerSection>
      <hr className="border-zinc-600" />
      <DrawerSection title="Days">
        <div className="flex flex-col gap-y-1">
          {days
            ? days?.map((day, index) => (
                <InputText
                  key={day.id}
                  onChange={(e) =>
                    setDays((prev) => {
                      const tempPrev = [...prev];
                      tempPrev[index].title = e.target.value;
                      return tempPrev;
                    })
                  }
                  value={day.title}
                />
              ))
            : null}
        </div>
      </DrawerSection>
      <Button
        className="p-button-outlined p-button-success"
        disabled={createCalendarMutation.isLoading || updateCalendarMutation.isLoading || disableCalendarSaveButton(localItem)}
        loading={createCalendarMutation.isLoading || updateCalendarMutation.isLoading}
        onClick={async () =>
          createUpdateItem<CalendarType>(
            calendar,
            localItem,
            changedData,
            "calendars",
            project_id as string,
            queryClient,
            DefaultCalendar,
            allCalendars,
            resetChanges,
            createCalendarMutation.mutateAsync,
            updateCalendarMutation.mutateAsync,
            setDrawer,
          )
        }
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {calendar ? (
          <Button
            className="p-button-outlined p-button-danger w-full"
            loading={deleteCalendarMutation.isLoading}
            onClick={() => {
              if (calendar)
                deleteItem(
                  "Are you sure you want to delete this calendar?",
                  () => {
                    deleteCalendarMutation?.mutate(calendar.id, {
                      onSuccess: () => {
                        handleCloseDrawer(setDrawer, "right");
                      },
                    });
                  },
                  () => toaster("info", "Item not deleted."),
                );
            }}
            type="submit">
            {buttonLabelWithIcon("Delete", "mdi:trash")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
