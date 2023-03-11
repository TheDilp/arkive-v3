import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteItem, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { CalendarType, MonthCreateType, MonthType } from "../../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultMonth } from "../../../utils/DefaultValues/CalendarDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

function disableMonthSaveButton(localItem: MonthType | MonthCreateType) {
  if (!localItem.title || !localItem.days) return true;
  return false;
}

export default function DrawerMonthContent() {
  const queryClient = useQueryClient();
  const { project_id, item_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createMonthMutation = useCreateSubItem<MonthType>(drawer?.data?.parentId as string, "months", "calendars");
  const updateMonthMutation = useUpdateSubItem<MonthType>(drawer?.data?.parentId as string, "months", "calendars");
  const deleteMonthMutation = useDeleteItem("calendars", project_id as string);
  const allCalendars = queryClient.getQueryData<CalendarType[]>(["allItems", project_id, "calendars"]);
  const month = allCalendars?.find((cal) => cal.id === drawer?.data?.parentId)?.months?.find((m) => m?.id === drawer?.data?.id);

  const [localItem, setLocalItem] = useState<MonthType | MonthCreateType>(drawer?.data ?? { ...DefaultMonth });
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const createUpdateMonth = () => {
    if (changedData) {
      if (localItem?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tags, ...rest } = changedData;
        updateMonthMutation.mutate(
          { id: localItem.id, ...rest },
          {
            onSuccess: () => {
              toaster("success", `Month ${localItem?.title || ""} was successfully updated.`);
              handleCloseDrawer(setDrawer, "right");
              queryClient.refetchQueries(["calendars", item_id]);
              resetChanges();
            },
          },
        );
      } else {
        createMonthMutation.mutate(
          { id: crypto.randomUUID(), ...changedData, parentId: item_id as string },
          {
            onSuccess: () => {
              toaster("success", `Month ${localItem?.title || ""} was successfully created.`);
              handleCloseDrawer(setDrawer, "right");
              queryClient.refetchQueries(["calendars", item_id]);

              resetChanges();
            },
          },
        );
      }
    } else {
      toaster("info", "No data was changed.");
    }
  };

  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center font-Lato text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create New Month"}</h2>
      <DrawerSection title="Month title">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createUpdateMonth();
            }
          }}
          placeholder="Month title"
          value={localItem?.title || ""}
        />
      </DrawerSection>
      <DrawerSection title="Month days">
        <InputNumber
          className="w-full"
          name="days"
          onChange={(e) => handleChange({ name: "days", value: e.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disableMonthSaveButton(localItem)) {
              createUpdateMonth();
            }
          }}
          placeholder="Month title"
          value={localItem?.days || 0}
        />
      </DrawerSection>

      <hr className="border-zinc-600" />
      <Button
        className="p-button-outlined p-button-success"
        disabled={createMonthMutation.isLoading || updateMonthMutation.isLoading || disableMonthSaveButton(localItem)}
        loading={createMonthMutation.isLoading || updateMonthMutation.isLoading}
        onClick={() => createUpdateMonth()}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {month ? (
          <Button
            className="p-button-outlined p-button-danger w-full"
            loading={deleteMonthMutation.isLoading}
            onClick={() => {
              if (month)
                deleteItem(
                  "Are you sure you want to delete this month?",
                  () => {
                    deleteMonthMutation?.mutate(month.id, {
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
