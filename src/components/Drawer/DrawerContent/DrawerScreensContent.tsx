import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { ScreenCreateType, ScreenType } from "../../../types/screenTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { DefaultScreen } from "../../../utils/DefaultValues/ScreenDefaults";
import { buttonLabelWithIcon } from "../../../utils/transform";

export default function DrawerScreensContent() {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createScreenMutation = useCreateItem<ScreenType>("screens");
  const updateScreenMutation = useUpdateItem<ScreenType>("screens", project_id as string);
  const deleteScreenMutation = useDeleteItem("screens", project_id as string);
  const allScreens = queryClient.getQueryData<ScreenType[]>(["allitems", project_id, "screens"]);
  const { data: screen } = useGetItem<ScreenType>(drawer?.id as string, "screens", { enabled: !!drawer?.id });
  const [localItem, setLocalItem] = useState<ScreenType | ScreenCreateType>(
    screen ?? {
      ...DefaultScreen,
      project_id: project_id as string,
    },
  );

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  useEffect(() => {
    if (screen) {
      setLocalItem(screen);
    } else {
      setLocalItem({
        ...DefaultScreen,
        project_id: project_id as string,
      });
    }
  }, [screen, project_id]);
  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center text-2xl">{screen ? `Edit ${screen.title}` : "Create New Screen"}</h2>
      <InputText
        autoFocus
        className="w-full"
        name="title"
        onChange={(e) => handleChange(e.target)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && screen) {
            updateScreenMutation?.mutate({
              id: screen.id,
              ...changedData,
            });
          }
        }}
        placeholder="Screen Name"
        value={localItem?.title || ""}
      />
      <div className="flex max-h-96 w-full flex-col  gap-y-2 overflow-y-auto">
        {localItem?.sections
          ? localItem?.sections?.map((section) => (
              <div key={section.id} className="flex w-full items-center justify-between">
                <h5 className="text-lg">{section.title}</h5>
                <div className="flex gap-x-2">
                  <Button
                    className="p-button-outlined p-button-primary"
                    icon="pi pi-pencil"
                    onClick={() => setDrawer({ ...DefaultDrawer, data: section, show: true, type: "sections" })}
                  />
                  <Button className="p-button-outlined p-button-danger" icon="pi pi-trash" />
                </div>
              </div>
            ))
          : null}
      </div>
      <Button
        className="p-button-outlined p-button-success ml-auto"
        onClick={() => {
          createUpdateItem<ScreenType>(
            screen,
            localItem,
            changedData,
            "screens",
            project_id as string,
            queryClient,
            DefaultScreen,
            allScreens,
            resetChanges,
            createScreenMutation.mutate,
            updateScreenMutation.mutate,
          );
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
