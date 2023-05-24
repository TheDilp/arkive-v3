import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteManySubItems, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { ScreenType, SectionCreateType, SectionType } from "../../../types/ItemTypes/screenTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { DefaultSection } from "../../../utils/DefaultValues/ScreenDefaults";
import { SectionSizeOptions } from "../../../utils/screenUtils";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

export default function DrawerSectionContent() {
  const queryClient = useQueryClient();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const { item_id } = useParams();

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
  const deleteSectionMutation = useDeleteManySubItems(item_id as string, "sections");
  const [localItem, setLocalItem] = useState<SectionType | SectionCreateType>(
    (drawer?.data as SectionType) ?? {
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

  if (!localItem) {
    setDrawer(DefaultDrawer);
    return null;
  }
  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center font-Lato text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create new Section"}</h2>
      <DrawerSection title="Section title">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && localItem) {
              createUpdateSection();
            }
          }}
          placeholder="Screen Name"
          title="Section title"
          value={localItem?.title || ""}
        />
      </DrawerSection>
      <DrawerSection title="Card height">
        <Dropdown
          name="cardSize"
          onChange={(e) => handleChange(e.target)}
          options={SectionSizeOptions}
          title="Section size"
          value={localItem?.cardSize}
        />
      </DrawerSection>
      <div className="mt-auto flex w-full flex-col gap-y-2">
        <Button
          className="p-button-outlined p-button-success ml-auto"
          disabled={isLoadingCreate || isLoadingUpdate || !localItem?.title}
          loading={isLoadingCreate || isLoadingUpdate}
          onClick={createUpdateSection}
          type="submit">
          {buttonLabelWithIcon("Save", IconEnum.save)}
        </Button>
        {localItem?.id ? (
          <Button
            className="p-button-outlined  p-button-danger w-full"
            onClick={() => {
              if (document)
                deleteItem(
                  "Are you sure you want to delete this section?",
                  () => {
                    deleteSectionMutation?.mutate([localItem.id]);
                    handleCloseDrawer(setDrawer, "right");
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
