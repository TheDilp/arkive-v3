import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { ScreenCreateType, ScreenType } from "../../../types/ItemTypes/screenTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { DefaultScreen } from "../../../utils/DefaultValues/ScreenDefaults";
import { SectionSizeOptions } from "../../../utils/screenUtils";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

function isDisabledSaveScreen(localItem: ScreenType | ScreenCreateType) {
  if (!localItem?.title) return true;
  return false;
}

export default function DrawerScreensContent() {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createScreenMutation = useCreateItem<ScreenType>("screens");
  const updateScreenMutation = useUpdateItem<ScreenType>("screens", project_id as string);
  const deleteScreenMutation = useDeleteItem("screens", project_id as string);
  const allScreens = queryClient.getQueryData<ScreenType[]>(["allItems", project_id, "screens"]);
  const screen = allScreens?.find((scrn) => scrn.id === drawer.id);
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
      <h2 className="text-center font-Lato text-2xl">{screen ? `Edit ${screen.title}` : "Create new Screen"}</h2>
      <DrawerSection title="Section title">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              if (!isDisabledSaveScreen(localItem))
                await createUpdateItem<ScreenType>(
                  screen,
                  localItem,
                  changedData,
                  DefaultScreen,
                  allScreens,
                  resetChanges,
                  createScreenMutation.mutateAsync,
                  updateScreenMutation.mutateAsync,
                  setDrawer,
                );
            }
          }}
          placeholder="Screen Name"
          value={localItem?.title || ""}
        />
      </DrawerSection>
      <div className="flex w-full flex-col">
        <DrawerSection title="Section size">
          <Dropdown
            name="sectionSize"
            onChange={(e) => handleChange(e.target)}
            options={SectionSizeOptions}
            title="Section size"
            value={localItem?.sectionSize}
          />
        </DrawerSection>
      </div>
      <div className="mt-auto flex w-full flex-col gap-y-2">
        <Button
          className="p-button-outlined p-button-success ml-auto"
          disabled={createScreenMutation.isLoading || updateScreenMutation.isLoading || isDisabledSaveScreen(localItem)}
          loading={createScreenMutation.isLoading || updateScreenMutation.isLoading}
          onClick={async () => {
            await createUpdateItem<ScreenType>(
              screen,
              localItem,
              changedData,
              DefaultScreen,
              allScreens,
              resetChanges,
              createScreenMutation.mutateAsync,
              updateScreenMutation.mutateAsync,
              setDrawer,
            );
          }}
          type="submit">
          {buttonLabelWithIcon("Save", IconEnum.save)}
        </Button>
        {document ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            loading={deleteScreenMutation.isLoading}
            onClick={() => {
              if (screen)
                deleteItem(
                  screen.folder
                    ? "Are you sure you want to delete this folder? Deleting it will also delete all of its children!"
                    : "Are you sure you want to delete this screen?",
                  () => {
                    deleteScreenMutation?.mutate(screen.id, {
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
