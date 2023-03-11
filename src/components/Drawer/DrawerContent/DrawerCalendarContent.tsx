import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { baseURLS, updateURLs } from "../../../types/CRUDenums";
import { CalendarCreateType, CalendarType } from "../../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { DefaultCalendar } from "../../../utils/DefaultValues/CalendarDefaults";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import Tags from "../../Tags/Tags";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

function disableCalendarSaveButton(
  localItem: Omit<CalendarType | CalendarCreateType, "days"> & { days: { id: string; value: string }[] },
) {
  if (!localItem.title) return true;
  return false;
}

export default function DrawerCalendarContent() {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const { data: calendar, isLoading } = useGetItem<CalendarType>(drawer?.data?.id, "calendars");
  const allCalendars = queryClient.getQueryData<CalendarType[]>(["allItems", project_id, "calendars"]);
  const createCalendarMutation = useCreateItem<CalendarType>("calendars");
  const updateCalendarMutation = useUpdateItem<CalendarType>("calendars", project_id as string);
  const deleteCalendarMutation = useDeleteItem("calendars", project_id as string);
  const [localItem, setLocalItem] = useState<
    Omit<CalendarType | CalendarCreateType, "days"> & { days: { id: string; value: string }[] }
  >(
    { ...calendar, days: calendar?.days?.map((day: string) => ({ value: day, id: crypto.randomUUID() })) || [] } ?? {
      ...DefaultCalendar,
      project_id,
    },
  );

  useEffect(() => {
    if (calendar)
      setLocalItem({
        ...calendar,
        days: calendar?.days?.map((day: string) => ({ value: day, id: crypto.randomUUID() })) || [],
      });
    else
      setLocalItem({
        ...DefaultCalendar,
        days: [],
        project_id,
      });
  }, [calendar]);

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  if (isLoading) return <ProgressSpinner />;
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flexw-full flex-1 flex-col">
        <h2 className="text-center font-Lato text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create New Calendar"}</h2>
        <TabView className="h-[90%] w-full overflow-y-auto" renderActiveOnly>
          <TabPanel header="Calendar">
            <div className="flex w-full flex-col gap-y-3 overflow-y-auto pt-3">
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
                        { ...localItem, days: localItem.days.map((day) => day.value) },
                        changedData,
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
              <DrawerSection title="Calendar days">
                <div className="flex h-fit flex-col items-end">
                  <Button
                    className="p-button-text"
                    icon="pi pi-plus"
                    iconPos="right"
                    label="Add new day"
                    onClick={() => {
                      const tempDays = [...(localItem.days || [])];
                      tempDays.push({ id: crypto.randomUUID(), value: `New Day ${(localItem.days?.length || 0) + 1}` });
                      handleChange({ name: "days", value: tempDays });
                    }}
                  />
                  <DragDropContext
                    onDragEnd={(result) => {
                      if (!result.destination) return;
                      const tempDays = [...(localItem?.days || [])];
                      const day = tempDays[result.source.index];
                      tempDays.splice(result.source.index, 1);

                      tempDays.splice(result.destination.index, 0, day);
                      handleChange({ name: "days", value: tempDays });
                    }}>
                    <Droppable droppableId="Days">
                      {(providedDroppable) => (
                        <div
                          ref={providedDroppable.innerRef}
                          {...providedDroppable.droppableProps}
                          className="flex w-full flex-col items-center overflow-x-hidden">
                          {(localItem?.days || [])?.map((day, index) => (
                            <Draggable key={day.id} draggableId={day.id} index={index}>
                              {(providedDraggable) => (
                                <div
                                  ref={providedDraggable.innerRef}
                                  className="mt-1 flex w-full items-center justify-between"
                                  tabIndex={-1}
                                  {...providedDraggable.draggableProps}>
                                  <div {...providedDraggable.dragHandleProps}>
                                    <Icon className="cursor-pointer hover:text-sky-400" fontSize={28} icon="mdi:drag" />
                                  </div>
                                  <InputText
                                    className="w-full"
                                    onChange={(e) => {
                                      const tempDays = [...(localItem?.days || [])];
                                      tempDays[index].value = e.target.value;
                                      handleChange({ name: "days", value: tempDays });
                                    }}
                                    value={day?.value}
                                  />
                                  <div>
                                    <Icon
                                      className="cursor-pointer hover:text-red-400"
                                      fontSize={20}
                                      icon="mdi:trash-outline"
                                      onClick={() => {
                                        const tempDays = [...(localItem?.days || [])];
                                        tempDays.splice(index, 1);
                                        handleChange({ name: "days", value: tempDays });
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {providedDroppable.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </DrawerSection>
              <DrawerSection title="Calendar hours (optional)">
                <InputNumber
                  name="hours"
                  onChange={(e) => handleChange({ name: "hours", value: e.value })}
                  placeholder="How many hours in a day?"
                  value={localItem.hours}
                />
              </DrawerSection>
              <DrawerSection title="Calendar minutes (optional)">
                <InputNumber
                  name="minutes"
                  onChange={(e) => handleChange({ name: "minutes", value: e.value })}
                  placeholder="How many minutes in a day?"
                  value={localItem.minutes}
                />
              </DrawerSection>

              <DrawerSection title="Tags">
                <Tags handleChange={handleChange} localItem={localItem} type="calendars" />
              </DrawerSection>
            </div>
          </TabPanel>
          <TabPanel disabled={!localItem?.id} header="Eras">
            <div className="flex w-full flex-col items-end gap-y-3 pt-3">
              {(localItem?.eras || []).map((era) => (
                <div key={era.id} className="flex w-full items-center">
                  <div className="w-full pl-2 text-left font-Lato text-base">
                    {era.title} ({era.start_year} - {era.end_year})
                  </div>
                  <div>
                    <Icon
                      className="cursor-pointer hover:text-sky-400"
                      fontSize={20}
                      icon="mdi:pencil-outline"
                      onClick={() => {
                        setDrawer({ ...DefaultDrawer, show: true, data: era, type: "eras" });
                      }}
                    />
                  </div>
                  <div>
                    <Icon className="cursor-pointer hover:text-red-400" fontSize={20} icon="mdi:trash-outline" />
                  </div>
                </div>
              ))}

              <Button
                className="p-button-text"
                icon="pi pi-plus"
                iconPos="right"
                label="Add new era"
                onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "eras" })}
              />
            </div>
          </TabPanel>
          <TabPanel disabled={!localItem?.id} header="Months">
            <div className="flex w-full justify-end">
              <Button
                className="p-button-primary p-button-text"
                icon="pi pi-plus"
                iconPos="right"
                label="Add new month"
                onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "months" })}
              />
            </div>
            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return;
                const tempMonths = [...(localItem?.months || [])];
                const month = tempMonths[result.source.index];
                tempMonths.splice(result.source.index, 1);
                tempMonths.splice(result.destination.index, 0, month);
                handleChange({ name: "months", value: tempMonths });
                FetchFunction({
                  url: `${baseURLS.baseServer}${updateURLs.sortMonths}`,
                  method: "POST",
                  body: JSON.stringify(
                    tempMonths.map((sortMonth, index) => ({ id: sortMonth.id, parentId: sortMonth.parentId, sort: index })),
                  ),
                });
              }}>
              <Droppable droppableId="Days">
                {(providedDroppable) => (
                  <div
                    ref={providedDroppable.innerRef}
                    {...providedDroppable.droppableProps}
                    className="flex h-full w-full flex-col items-center overflow-hidden">
                    {(localItem?.months || [])?.map((month, index) => (
                      <Draggable key={month.id} draggableId={month.id} index={index}>
                        {(providedDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            className="mt-1 flex w-full items-center justify-between border-b border-zinc-700"
                            tabIndex={-1}
                            {...providedDraggable.draggableProps}>
                            <div {...providedDraggable.dragHandleProps} tabIndex={-1}>
                              <Icon className="cursor-pointer hover:text-sky-400" fontSize={28} icon="mdi:drag" />
                            </div>
                            <div className="w-full pl-2 text-left text-lg">{month.title}</div>
                            <div className="flex items-center">
                              <Icon
                                className="cursor-pointer hover:text-sky-400"
                                fontSize={20}
                                icon="mdi:pencil-outline"
                                onClick={() => {
                                  setDrawer({ ...DefaultDrawer, show: true, data: month, type: "months" });
                                }}
                              />
                              <Icon className="cursor-pointer hover:text-red-400" fontSize={20} icon="mdi:trash-outline" />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {providedDroppable.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabPanel>
        </TabView>
      </div>

      <div className="justify-content-end mb-2 flex w-full">
        <Button
          className="p-button-outlined p-button-success w-full"
          disabled={
            createCalendarMutation.isLoading || updateCalendarMutation.isLoading || disableCalendarSaveButton(localItem)
          }
          loading={createCalendarMutation.isLoading || updateCalendarMutation.isLoading}
          onClick={async () => {
            createUpdateItem<CalendarType>(
              calendar,
              { ...localItem, days: localItem.days.map((day) => day.value) },
              {
                ...changedData,
                ...(changedData &&
                  "days" in changedData && { days: changedData.days.map((day: { id: string; value: string }) => day.value) }),
              },
              DefaultCalendar,
              allCalendars,
              resetChanges,
              createCalendarMutation.mutateAsync,
              updateCalendarMutation.mutateAsync,
              setDrawer,
            );
          }}
          type="submit">
          {buttonLabelWithIcon("Save", "mdi:content-save")}
        </Button>
      </div>

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
