import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
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

export default function DrawerCalendarContent() {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createCalendarMutation = useCreateItem<CalendarType>("calendars");
  const updateCalendarMutation = useUpdateItem<CalendarType>(drawer?.data?.id, project_id as string);
  const deleteCalendarMutation = useDeleteItem("calendars", project_id as string);
  const allCalendars = queryClient.getQueryData<CalendarType[]>(["allItems", project_id, "calendars"]);
  const calendar = allCalendars?.find((dict) => dict.id === drawer?.data?.id);

  const [localItem, setLocalItem] = useState<CalendarType | CalendarCreateType>(
    drawer?.data ?? { ...DefaultCalendar, project_id },
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center font-Lato text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create New Calendar"}</h2>
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

      <Button
        className="p-button-outlined p-button-success"
        disabled={createCalendarMutation.isLoading || updateCalendarMutation.isLoading}
        loading={createCalendarMutation.isLoading || updateCalendarMutation.isLoading}
        onClick={async () =>
          createUpdateItem<CalendarType>(
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
