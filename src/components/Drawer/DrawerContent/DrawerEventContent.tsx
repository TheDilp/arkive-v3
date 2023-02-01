import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useDeleteItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { baseURLS, createURLS } from "../../../types/CRUDenums";
import { CalendarType, EventCreateType, EventType } from "../../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";
import { DefaultEvent } from "../../../utils/DefaultValues/CalendarDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

function disableEventSaveButton(localItem: EventType | EventCreateType) {
  if (!localItem.title || !localItem.day || !localItem.monthsId || !localItem.year) return true;
  return false;
}

export default function DrawerEventContent() {
  const { project_id, item_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);

  const deleteMonthMutation = useDeleteItem("calendars", project_id as string);
  const { data: calendar } = useGetItem<CalendarType>(item_id as string, "calendars");

  const [localItem, setLocalItem] = useState<EventType | EventCreateType>(drawer?.data ?? { ...DefaultEvent });
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const createUpdateEvent = async () => {
    if (changedData) {
      if (localItem?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tags, ...rest } = changedData;
        // await FetchFunction({
        //   url: `${baseURLS.baseServer}${createURLS.createEvent}`,
        //   method: "POST",
        //   body: JSON.stringify(localItem),
        // });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await FetchFunction({
          url: `${baseURLS.baseServer}${createURLS.createEvent}`,
          method: "POST",
          body: JSON.stringify({ ...localItem, calendarsId: item_id as string }),
        });
        resetChanges();
        handleCloseDrawer(setDrawer, "right");
      }
    } else {
      toaster("info", "No data was changed.");
    }
  };

  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center font-Lato text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create New Event"}</h2>
      <DrawerSection title="Month title">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createUpdateEvent();
            }
          }}
          placeholder="Event title"
          value={localItem?.title || ""}
        />
      </DrawerSection>
      <DrawerSection title="Event date">
        <div className="flex flex-col gap-y-1">
          <div className="flex gap-x-0.5">
            <InputNumber
              inputClassName="w-full"
              name="day"
              onChange={(e) => handleChange({ name: "day", value: e.value })}
              placeholder="Day"
              useGrouping={false}
              value={localItem?.day}
            />
            <Dropdown
              name="month"
              onChange={(e) => handleChange({ name: "monthsId", value: e.value })}
              optionLabel="title"
              options={calendar?.months}
              optionValue="id"
              placeholder="Month"
              value={localItem?.monthsId}
            />
            <InputNumber
              inputClassName="w-full"
              name="year"
              onChange={(e) => handleChange({ name: "year", value: e.value })}
              placeholder="Year"
              useGrouping={false}
              value={localItem?.year}
            />
          </div>
          <div className="flex gap-x-0.5">
            <InputNumber
              inputClassName="w-full"
              name="hours"
              onChange={(e) => handleChange({ name: "hours", value: e.value })}
              placeholder="Hour(s)"
              useGrouping={false}
              value={localItem?.hours}
            />

            <InputNumber
              inputClassName="w-full"
              name="minutes"
              onChange={(e) => handleChange({ name: "minutes", value: e.value })}
              placeholder="Minute(s)"
              useGrouping={false}
              value={localItem?.minutes}
            />
          </div>
        </div>
      </DrawerSection>

      <hr className="border-zinc-600" />

      <Button
        className="p-button-outlined p-button-success"
        disabled={disableEventSaveButton(localItem)}
        onClick={() => createUpdateEvent()}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {localItem?.id ? (
          <Button
            className="p-button-outlined p-button-danger w-full"
            loading={deleteMonthMutation.isLoading}
            onClick={() => {
              // if (month)
              //   deleteItem(
              //     "Are you sure you want to delete this month?",
              //     () => {
              //       deleteMonthMutation?.mutate(month.id, {
              //         onSuccess: () => {
              //           handleCloseDrawer(setDrawer, "right");
              //         },
              //       });
              //     },
              //     () => toaster("info", "Item not deleted."),
              //   );
            }}
            type="submit">
            {buttonLabelWithIcon("Delete", "mdi:trash")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
