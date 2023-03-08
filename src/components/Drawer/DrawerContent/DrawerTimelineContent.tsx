import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useGetAllItems, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { TimelineCreateType, TimelineType } from "../../../types/ItemTypes/timelineTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { DefaultTimeline } from "../../../utils/DefaultValues/TimelineDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

export default function DrawerTimelineContent() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [drawer, setDrawer] = useAtom(DrawerAtom);

  const allTimelines = queryClient.getQueryData<TimelineType[]>(["allItems", project_id, "timelines"]);
  const { data: allCalendars } = useGetAllItems(project_id as string, "calendars");
  const dictionary = allTimelines?.find((dict) => dict.id === drawer.id);

  const createTimelineMutation = useCreateItem("timelines");
  const updateTimelineMutation = useUpdateItem("timelines", project_id as string);
  const deleteTimelineMutation = useDeleteItem("timelines", project_id as string);

  const [localItem, setLocalItem] = useState<TimelineType | TimelineCreateType>(
    drawer?.data ?? { ...DefaultTimeline, project_id: project_id as string },
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  useEffect(() => {
    if (dictionary) {
      setLocalItem(dictionary);
    } else {
      setLocalItem({
        ...DefaultTimeline,
        project_id: project_id as string,
      });
    }
  }, [dictionary, project_id]);
  console.log(localItem);
  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center font-Lato text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create New Timeline"}</h2>
      <DrawerSection title="Timeline title">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await createUpdateItem<TimelineType>(
                dictionary,
                localItem,
                changedData,
                DefaultTimeline,
                allTimelines,
                resetChanges,
                createTimelineMutation.mutateAsync,
                updateTimelineMutation.mutateAsync,
                setDrawer,
              );
            }
          }}
          placeholder="Timeline title"
          value={localItem?.title || ""}
        />
      </DrawerSection>
      <DrawerSection subtitle="Calendars from which the timeline will draw events" title="Calendars">
        <MultiSelect
          className="w-full"
          name="calendars"
          onChange={(e) => handleChange({ name: "calendars", value: e.value })}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await createUpdateItem<TimelineType>(
                dictionary,
                localItem,
                changedData,
                DefaultTimeline,
                allTimelines,
                resetChanges,
                createTimelineMutation.mutateAsync,
                updateTimelineMutation.mutateAsync,
                setDrawer,
              );
            }
          }}
          optionLabel="title"
          options={allCalendars}
          optionValue="id"
          placeholder="Selected Calendars"
          value={localItem?.calendars || ""}
        />
      </DrawerSection>
      <Button
        className="p-button-outlined p-button-success"
        disabled={createTimelineMutation.isLoading || updateTimelineMutation.isLoading || !localItem?.title}
        loading={createTimelineMutation.isLoading || updateTimelineMutation.isLoading}
        onClick={async () => {
          await createUpdateItem<TimelineType>(
            dictionary,
            localItem,
            changedData,
            DefaultTimeline,
            allTimelines,
            resetChanges,
            createTimelineMutation.mutateAsync,
            updateTimelineMutation.mutateAsync,
            setDrawer,
          );
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {localItem?.id ? (
          <Button
            className="p-button-outlined p-button-danger w-full"
            loading={deleteTimelineMutation.isLoading}
            onClick={() => {
              deleteItem(
                "Are you sure you want to delete this timeline?",
                () => {
                  if (localItem?.id)
                    deleteTimelineMutation?.mutate(localItem.id, {
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
