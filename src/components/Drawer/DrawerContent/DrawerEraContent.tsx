import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteItem, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { CalendarType, EraCreateType, EraType } from "../../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultEra } from "../../../utils/DefaultValues/CalendarDefaults";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

function disableMonthSaveButton(localItem: EraType | EraCreateType) {
  if (!localItem.title || !localItem.start_year || !localItem.end_year) return true;
  return false;
}

export default function DrawerEraContent() {
  const queryClient = useQueryClient();
  const { project_id, item_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createEraMutation = useCreateSubItem<EraType>(drawer?.data?.parentId as string, "eras", "calendars");
  const updateEraMutation = useUpdateSubItem<EraType>(drawer?.data?.parentId as string, "eras", "calendars");
  const deleteEraMutation = useDeleteItem("calendars", project_id as string);
  const allCalendars = queryClient.getQueryData<CalendarType[]>(["allItems", project_id, "calendars"]);
  const month = allCalendars?.find((cal) => cal.id === drawer?.data?.parentId)?.months?.find((m) => m?.id === drawer?.data?.id);

  const [localItem, setLocalItem] = useState<EraType | EraCreateType>(drawer?.data ?? { ...DefaultEra, parentId: item_id });
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const createUpdateEra = () => {
    if (changedData) {
      if (localItem?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tags, ...rest } = changedData;
        updateEraMutation.mutate(
          { id: localItem.id, ...rest },
          {
            onSuccess: () => {
              toaster("success", `Era ${localItem?.title || ""} was successfully updated.`);
              handleCloseDrawer(setDrawer, "right");
              //   queryClient.refetchQueries(["calendars", item_id]);
              resetChanges();
            },
          },
        );
      } else {
        createEraMutation.mutate(
          { id: crypto.randomUUID(), ...changedData, parentId: item_id as string },
          {
            onSuccess: () => {
              toaster("success", `Era ${localItem?.title || ""} was successfully created.`);
              handleCloseDrawer(setDrawer, "right");
              //   queryClient.refetchQueries(["calendars", item_id]);

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
      <h2 className="text-center font-Lato text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create new Era"}</h2>
      <DrawerSection title="Era title">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createUpdateEra();
            }
          }}
          placeholder="Era title"
          value={localItem?.title || ""}
        />
      </DrawerSection>
      <DrawerSection title="Era range">
        <div className="mt-1 flex gap-x-0.5">
          <div className="flex w-full flex-col">
            <span className="text-xs text-zinc-600">Start year</span>
            <InputNumber
              inputClassName="w-full"
              name="start_year"
              onChange={(e) => handleChange({ name: "start_year", value: e.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !disableMonthSaveButton(localItem)) {
                  createUpdateEra();
                }
              }}
              placeholder="Era start year"
              useGrouping={false}
              value={localItem?.start_year || 0}
            />
          </div>
          <div className="flex w-full flex-col">
            <span className="text-xs text-zinc-600">End year</span>
            <InputNumber
              inputClassName="w-full"
              name="end_year"
              onChange={(e) => handleChange({ name: "end_year", value: e.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !disableMonthSaveButton(localItem)) {
                  createUpdateEra();
                }
              }}
              placeholder="Era end year"
              useGrouping={false}
              value={localItem?.end_year || 0}
            />
          </div>
        </div>
      </DrawerSection>

      <hr className="border-zinc-600" />

      <Button
        className="p-button-outlined p-button-success"
        disabled={createEraMutation.isLoading || updateEraMutation.isLoading || disableMonthSaveButton(localItem)}
        loading={createEraMutation.isLoading || updateEraMutation.isLoading}
        onClick={() => createUpdateEra()}
        type="submit">
        {buttonLabelWithIcon("Save", IconEnum.save)}
      </Button>
      <div className="mt-auto flex w-full">
        {month ? (
          <Button
            className="p-button-outlined p-button-danger w-full"
            loading={deleteEraMutation.isLoading}
            onClick={() => {
              if (month)
                deleteItem(
                  "Are you sure you want to delete this month?",
                  () => {
                    deleteEraMutation?.mutate(month.id, {
                      onSuccess: () => {
                        handleCloseDrawer(setDrawer, "right");
                      },
                    });
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
