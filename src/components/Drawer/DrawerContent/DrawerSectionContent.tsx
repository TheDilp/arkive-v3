import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteItem, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { ScreenType, SectionCreateType, SectionType } from "../../../types/screenTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { DefaultSection } from "../../../utils/DefaultValues/ScreenDefaults";
import { SectionSizeOptions } from "../../../utils/screenUtils";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerSectionContent() {
  const queryClient = useQueryClient();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const { project_id, item_id } = useParams();
  const { mutate: createSectionMutation, isLoading: isLoadingCreate } = useCreateSubItem<SectionCreateType>(
    item_id as string,
    "sections",
    "screens",
  );
  const { mutate: updateSectionMutation, isLoading: isLoadingUpdate } = useUpdateSubItem<SectionType>(
    item_id as string,
    "sections",
    "screens",
  );
  const deleteScreenMutation = useDeleteItem("screens", project_id as string);
  const screen = queryClient.getQueryData<ScreenType>(["screens", item_id as string]);
  const section = screen?.sections?.find((screenSection) => screenSection.id === drawer?.data?.id);
  const [localItem, setLocalItem] = useState<SectionType | SectionCreateType>(
    section ?? {
      ...DefaultSection,
    },
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  const createUpdateSection = () => {
    if (localItem) {
      if (changedData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tags, ...rest } = changedData;
        if (localItem?.id)
          updateSectionMutation(
            { id: localItem.id, ...rest },
            {
              onSuccess: () => {
                toaster("success", `Section ${localItem?.title || ""} was successfully updated.`);
                resetChanges();
                if (tags)
                  queryClient.setQueryData(["screens", item_id], (oldData: ScreenType | undefined) => {
                    if (oldData)
                      return {
                        ...oldData,
                        sections: oldData?.sections?.map((oldSection) => {
                          if (oldSection.id === localItem.id) {
                            return { ...oldSection, tags };
                          }
                          return oldSection;
                        }),
                      };
                    return oldData;
                  });

                handleCloseDrawer(setDrawer, "right");
              },
            },
          );
        else
          createSectionMutation(
            { ...DefaultSection, ...changedData, id: crypto.randomUUID(), parentId: item_id as string },

            {
              onSuccess: () => {
                toaster("success", `Section ${localItem?.title || ""} was successfully created.`);
                handleCloseDrawer(setDrawer, "right");
              },
            },
          );
      } else {
        toaster("info", "No data was changed.");
      }
    }
  };

  useEffect(() => {
    if (drawer?.data) setLocalItem(drawer?.data as SectionType);
  }, [drawer?.data]);
  if (!localItem) {
    setDrawer(DefaultDrawer);
    return null;
  }
  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center text-2xl">{section ? `Edit ${section.title}` : "Create New Screen"}</h2>
      <div className="flex w-full flex-col">
        <span className="w-full text-sm text-zinc-400">Section title</span>
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && section) {
              createUpdateSection();
            }
          }}
          placeholder="Screen Name"
          title="Section title"
          value={localItem?.title || ""}
        />
      </div>
      <div className="flex w-full flex-col">
        <span className="w-full text-sm text-zinc-400">Section size</span>
        <Dropdown
          name="size"
          onChange={(e) => handleChange(e.target)}
          options={SectionSizeOptions}
          title="Section size"
          value={localItem?.size}
        />
      </div>
      <Button
        className="p-button-outlined p-button-success ml-auto"
        loading={isLoadingCreate || isLoadingUpdate}
        onClick={createUpdateSection}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
