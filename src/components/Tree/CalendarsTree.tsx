import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { CalendarType } from "../../types/ItemTypes/calendarTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import BaseTree from "./BaseTree";

export default function CalendarsTree() {
  const { project_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const createCalendarMutation = useCreateItem<CalendarType>("calendars");
  const { isMd } = useBreakpoint();
  return (
    <div className="flex h-screen flex-1 flex-col">
      <h2 className="h-8 text-center font-Merriweather text-2xl">Calendars</h2>

      <div className="mt-4 flex flex-col items-center justify-between gap-y-2 gap-x-1 border-b border-zinc-600 pb-2">
        <Button
          className="p-button-outlined p-button-secondary w-full truncate"
          icon="pi pi-folder"
          iconPos="right"
          label={isMd ? "" : "New Folder"}
          onClick={() => {
            createCalendarMutation?.mutate({
              folder: true,
              project_id: project_id as string,
              title: "New Folder",
            });
          }}
        />
        <Button
          className="p-button-outlined w-full truncate"
          onClick={() => {
            setDrawer({
              ...DefaultDrawer,
              position: "right",
              show: true,
              type: "calendars",
            });
          }}>
          <div className="flex w-full items-center justify-center gap-x-1">
            <div className="w-full">New Calendar</div>
            <div className="ml-auto">
              <Icon fontSize={20} icon="ph:calendar-blank-thin" />
            </div>
          </div>
        </Button>
      </div>

      <BaseTree type="calendars" />
    </div>
  );
}
