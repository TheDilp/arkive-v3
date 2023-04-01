import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import cloneDeep from "lodash.clonedeep";
import omit from "lodash.omit";
import set from "lodash.set";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useDeleteItem, useGetAllItems, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { baseURLS, createURLS, deleteURLs } from "../../../types/CRUDenums";
import { CalendarType, EventCreateType, EventType } from "../../../types/ItemTypes/calendarTypes";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { TimelineType } from "../../../types/ItemTypes/timelineTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";
import { DefaultEvent } from "../../../utils/DefaultValues/CalendarDefaults";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { virtualScrollerSettings } from "../../../utils/uiUtils";
import ColorInput from "../../ColorInput/ColorInput";
import Tags from "../../Tags/Tags";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

function disableEventSaveButton(localItem: EventType | EventCreateType) {
  if (!localItem.title || !localItem.day || (!localItem.month && typeof localItem.month !== "number") || !localItem.year)
    return true;
  return false;
}
async function deleteEvent(
  event: EventType | Partial<Omit<EventType, "era">>,
  item_id: string,
  queryClient: QueryClient,
  itemType: "timelines" | "calendars",
) {
  await FetchFunction({
    url: `${baseURLS.baseServer}${deleteURLs.deleteEvent}`,
    method: "DELETE",
    body: JSON.stringify({ id: event.id }),
  });
  queryClient.setQueryData<CalendarType | TimelineType>([itemType, item_id], (oldData) => {
    if (oldData) {
      if (itemType === "calendars") {
        const monthIdx =
          "monthsId" in event && "months" in oldData
            ? oldData?.months?.findIndex((month) => month.id === event.monthsId)
            : null;

        if (typeof monthIdx === "number" && monthIdx !== -1 && "months" in oldData) {
          const newData = cloneDeep(oldData);
          const newEvents = [...newData.months[monthIdx].events].filter((ev) => ev.id !== event.id);
          set(newData, `months[${monthIdx}].events`, newEvents);
          console.log("TEST");
          return newData;
        }
      }
      if (itemType === "timelines") {
        const calendarIdx =
          "calendarsId" in event && "calendars" in oldData
            ? oldData?.calendars?.findIndex((cal) => cal.id === event.calendarsId)
            : null;

        if (typeof calendarIdx === "number" && calendarIdx !== -1 && "calendars" in oldData) {
          const newData = cloneDeep(oldData);
          const newEvents = [...oldData.calendars[calendarIdx].events].filter((ev) => ev.id !== event.id);
          set(newData, `calendars[${calendarIdx}].events`, newEvents);
          return { ...newData };
        }
      }
    }

    return oldData;
  });
}

export default function DrawerEventContent() {
  const { project_id, item_id } = useParams();
  const { pathname } = useLocation();
  const itemType = pathname.includes("timelines") ? "timelines" : "calendars";
  const queryClient = useQueryClient();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const [loading, setLoading] = useState(false);
  const { data: calendar, isFetching } = useGetItem<CalendarType>(
    drawer.data?.calendarsId || (item_id as string),
    "calendars",
    {
      staleTime: 5 * 60 * 1000,
    },
  );
  const { data: documents, isLoading } = useGetAllItems<DocumentType>(project_id as string, "documents", {
    staleTime: 5 * 60 * 1000,
    enabled: !!calendar && !isFetching,
  });
  const deleteEventMutation = useDeleteItem("events", project_id as string);

  const [localItem, setLocalItem] = useState<EventType | EventCreateType>(
    drawer?.data?.event?.id ? drawer.data.event : { ...DefaultEvent, ...drawer.data },
  );
  const [monthDays, setMonthDays] = useState(0);
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const { mutateAsync } = useUpdateSubItem(item_id as string, "events", itemType);
  const createUpdateEvent = async () => {
    setLoading(true);
    if (changedData) {
      if (localItem?.id) {
        let payload = omit(changedData, ["tags"]);

        if (itemType === "timelines") set(payload, "calendarsId", localItem?.calendarsId);
        if (itemType === "calendars" || changedData?.monthsId)
          set(payload, "monthsId", changedData?.month?.id || localItem?.monthsId);
        payload = omit(payload, ["month"]);
        await mutateAsync({ ...payload, id: localItem.id });

        resetChanges();
        setLoading(false);
        toaster("success", "Event successfully updated.");

        handleCloseDrawer(setDrawer, "right");
      } else {
        const payload = omit(localItem, ["month"]);

        const newEvent = await FetchFunction({
          url: `${baseURLS.baseServer}${createURLS.createEvent}`,
          method: "POST",
          body: JSON.stringify({ ...payload, monthsId: localItem?.month?.id, calendarsId: item_id as string }),
        });
        queryClient.setQueryData<CalendarType | TimelineType>([itemType, item_id], (oldData) => {
          if (oldData) {
            if (itemType === "calendars") {
              const monthIdx =
                "monthsId" in newEvent && "months" in oldData
                  ? oldData?.months?.findIndex((month) => month.id === newEvent.monthsId)
                  : null;

              if (typeof monthIdx === "number" && monthIdx !== -1 && "months" in oldData) {
                const newData = { ...oldData };
                const newEvents = [...newData.months[monthIdx].events];
                newEvents.push(newEvent);

                set(newData, `months[${monthIdx}].events`, newEvents);
                return newData;
              }
            }
            if (itemType === "timelines") {
              const calendarIdx =
                "calendarsId" in newEvent && "calendars" in oldData
                  ? oldData?.calendars?.findIndex((cal) => cal.id === newEvent.calendarsId)
                  : null;

              if (typeof calendarIdx === "number" && calendarIdx !== -1 && "calendars" in oldData) {
                const newData = { ...oldData };

                const newEvents = [...oldData.calendars[calendarIdx].events];
                newEvents.push(newEvent);
                set(newData, `calendars[${calendarIdx}].events`, newEvents);
                return newData;
              }
            }
          }

          return oldData;
        });
        resetChanges();
        setLoading(false);
        toaster("success", "Event successfully created.");
        handleCloseDrawer(setDrawer, "right");
      }
    } else {
      toaster("info", "No data was changed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLocalItem((prev) => ({ ...prev, ...drawer.data }));
  }, [drawer.data]);
  useEffect(() => {
    if (calendar && typeof localItem?.month === "number") setMonthDays(calendar?.months?.[localItem.month]?.days);
  }, [localItem?.month]);

  return (
    <div className="flex h-full flex-col gap-y-2 overflow-y-auto overflow-x-hidden">
      <h2 className="truncate text-center font-Lato text-2xl">
        {localItem?.id ? `Edit ${localItem.title}` : "Create New Event"}
      </h2>
      <DrawerSection title="Event title">
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
        <div className="flex w-full flex-col gap-y-1">
          <div className="flex gap-x-0.5">
            <span>
              <span className="text-sm text-zinc-400">Day</span>

              <InputNumber
                disabled={localItem?.month === undefined}
                inputClassName="w-full"
                max={localItem?.month?.days}
                min={1}
                name="day"
                onChange={(e) => {
                  handleChange({
                    name: "day",
                    value: e.value && monthDays && e.value >= monthDays ? monthDays : e.value,
                  });
                }}
                placeholder="Day"
                tooltip={localItem?.month === undefined ? "Select a month first" : ""}
                tooltipOptions={{ disabled: localItem?.month !== undefined, position: "left" }}
                useGrouping={false}
                value={localItem?.day}
              />
            </span>
            <span>
              <span className="text-sm text-zinc-400">Month</span>
              <Dropdown
                dropdownIcon={isFetching ? "pi pi-spin pi-spinner" : "pi pi-chevron-down"}
                name="monthsId"
                onChange={(e) => handleChange({ name: "monthsId", value: e.value })}
                optionLabel="title"
                options={calendar?.months}
                optionValue="id"
                placeholder="Month"
                value={localItem?.monthsId}
              />
            </span>
            <span>
              <span className="text-sm text-zinc-400">Year</span>
              <InputNumber
                inputClassName="w-full"
                name="year"
                onChange={(e) => handleChange({ name: "year", value: e.value })}
                placeholder="Year"
                useGrouping={false}
                value={localItem?.year}
              />
            </span>
          </div>
          <div className="flex gap-x-0.5">
            <span>
              <span className="text-sm text-zinc-400">Hours</span>
              <InputNumber
                inputClassName="w-full"
                min={1}
                name="hours"
                onChange={(e) => handleChange({ name: "hours", value: e.value })}
                placeholder="Hour(s)"
                useGrouping={false}
                value={localItem?.hours}
              />
            </span>
            <span>
              <span className="text-sm text-zinc-400">Minutes</span>
              <InputNumber
                inputClassName="w-full"
                name="minutes"
                onChange={(e) => handleChange({ name: "minutes", value: e.value })}
                placeholder="Minute(s)"
                useGrouping={false}
                value={localItem?.minutes}
              />
            </span>
          </div>
        </div>
      </DrawerSection>
      <DrawerSection title="Event Description (optional)">
        <InputTextarea
          disabled={!!localItem?.documentsId}
          name="description"
          onChange={(e) => handleChange(e.target)}
          placeholder="Note: the event will use a document's content if selected."
          value={localItem.description || ""}
        />
      </DrawerSection>
      <DrawerSection title="Event Document (optional)">
        <Dropdown
          disabled={isLoading}
          dropdownIcon={isLoading ? "pi pi-spinner pi-spin" : "pi pi-chevron-down"}
          filter
          filterBy="title"
          onChange={(e) => handleChange({ name: "documentsId", value: e.value })}
          optionLabel="title"
          options={[{ title: "None", id: null, template: false, folder: false }, ...(documents || [])]
            .filter((doc) => !doc.template && !doc.folder)
            .map((doc) => ({ id: doc.id, title: doc.title }))}
          optionValue="id"
          placeholder="Select documents"
          value={localItem.documentsId}
          virtualScrollerOptions={virtualScrollerSettings}
        />
      </DrawerSection>
      <DrawerSection title="Event colors">
        <span className="mt-1 text-xs text-zinc-400">Background Color</span>
        <ColorInput
          color={localItem?.backgroundColor || ""}
          name="backgroundColor"
          onChange={({ name, value }) => handleChange({ name, value })}
        />
        <span className="text-xs text-zinc-400">Text color</span>
        <ColorInput
          color={localItem?.textColor || ""}
          name="textColor"
          onChange={({ name, value }) => handleChange({ name, value })}
        />
      </DrawerSection>
      <DrawerSection title="Event tags">
        <Tags handleChange={handleChange} localItem={localItem} type="events" />
      </DrawerSection>
      <div className="flex items-center justify-between">
        <span>Public:</span>
        <Checkbox
          checked={localItem?.isPublic ?? false}
          onChange={(e) => handleChange({ name: "isPublic", value: e.target.checked })}
        />
      </div>
      <hr className="border-zinc-600" />
      <Button
        className="p-button-outlined p-button-success"
        disabled={disableEventSaveButton(localItem) || loading}
        loading={loading}
        onClick={() => createUpdateEvent()}
        type="submit">
        {buttonLabelWithIcon("Save", IconEnum.save)}
      </Button>
      <div className="mt-auto flex w-full">
        {localItem?.id ? (
          <Button
            className="p-button-outlined p-button-danger w-full"
            loading={deleteEventMutation.isLoading}
            onClick={() => {
              deleteItem(
                "Are you sure you want to delete this event?",
                () => {
                  if (localItem?.id) {
                    deleteEvent(localItem, item_id as string, queryClient, itemType);
                    handleCloseDrawer(setDrawer, "right");
                  } else {
                    toaster("info", "Item not deleted.");
                  }
                },
                () => toaster("info", "Item not deleted."),
              );
            }}
            type="submit">
            {buttonLabelWithIcon("Delete", IconEnum.trash)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
