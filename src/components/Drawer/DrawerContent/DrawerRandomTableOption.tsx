import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useDeleteItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { baseURLS, createURLS, updateURLs } from "../../../types/CRUDenums";
import { RandomTableOptionCreateType, RandomTableOptionType } from "../../../types/ItemTypes/randomTableTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";
import { DefaultRandomTableOption } from "../../../utils/DefaultValues/RandomTableDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import IconPlaceholder from "../../IconSelect/IconPlaceholder";
import { IconSelect } from "../../IconSelect/IconSelect";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

export default function DrawerRandomTableOptionContent() {
  const queryClient = useQueryClient();
  const { project_id, item_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const [loading, setLoading] = useState(false);
  const deleteRandomTableMutation = useDeleteItem("randomtables", project_id as string);

  const [localItem, setLocalItem] = useState<RandomTableOptionType | RandomTableOptionCreateType>(
    drawer?.data ?? DefaultRandomTableOption,
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  const createUpdateRandomTableOption = async () => {
    setLoading(true);
    if (changedData) {
      if (localItem?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tags, ...rest } = changedData;
        await FetchFunction({
          url: `${baseURLS.baseServer}${updateURLs.updateRandomTableOption}`,
          method: "POST",
          body: JSON.stringify({ ...rest, id: localItem.id }),
        });
        await queryClient.refetchQueries<RandomTableOptionType>(["randomtables", item_id]);
        resetChanges();
        toaster("success", "Option successfully updated.");
        setLoading(false);
        handleCloseDrawer(setDrawer, "right");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await FetchFunction({
          url: `${baseURLS.baseServer}${createURLS.createRandomTableOption}`,
          method: "POST",
          body: JSON.stringify({ ...localItem, parentId: item_id as string }),
        });
        await queryClient.refetchQueries<RandomTableOptionType>(["randomtables", item_id]);
        resetChanges();
        toaster("success", "Option successfully created.");
        setLocalItem(DefaultRandomTableOption);
        setLoading(false);
      }
    } else {
      toaster("info", "No data was changed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (drawer?.data) {
      setLocalItem(drawer?.data as RandomTableOptionType);
    } else {
      setLocalItem(DefaultRandomTableOption);
    }
  }, [drawer?.data]);
  return (
    <div className="flex h-full flex-col gap-y-2 font-Lato">
      <h2 className="text-center font-Lato text-2xl">
        {localItem?.id ? `Edit ${localItem?.title}` : "Create New Random Table Option"}
      </h2>
      <DrawerSection title="Random table option title">
        <div className="flex items-center gap-x-1">
          <InputText
            autoFocus
            className="w-full"
            name="title"
            onChange={(e) => handleChange(e.target)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await createUpdateRandomTableOption();
              }
            }}
            placeholder="Random table option title"
            value={localItem?.title || ""}
          />
          <IconSelect iconTypes={["weather"]} setIcon={(newIcon) => handleChange({ name: "icon", value: newIcon })}>
            {localItem?.icon ? (
              <Icon className="cursor-pointer transition-colors hover:text-sky-400" fontSize={32} icon={localItem?.icon} />
            ) : (
              <IconPlaceholder />
            )}
          </IconSelect>
        </div>
      </DrawerSection>
      <DrawerSection title="Random table option description (optional)">
        <InputTextarea
          name="description"
          onChange={(e) => handleChange(e.target)}
          placeholder="Random table description"
          value={localItem.description}
        />
      </DrawerSection>
      <Button
        className="p-button-outlined p-button-success ml-auto"
        disabled={loading || !localItem?.title}
        loading={loading}
        onClick={async () => {
          await createUpdateRandomTableOption();
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {document ? (
          <Button
            className="p-button-outlined  p-button-danger w-full"
            loading={deleteRandomTableMutation.isLoading}
            onClick={() => {
              if (localItem?.id)
                deleteItem(
                  "Are you sure you want to delete this option?",
                  () => {
                    if (localItem?.id)
                      deleteRandomTableMutation?.mutate(localItem.id, {
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
