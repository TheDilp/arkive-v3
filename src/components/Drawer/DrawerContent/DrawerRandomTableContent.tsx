import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { RandomTableCreateType, RandomTableType } from "../../../types/ItemTypes/randomTableTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { DefaultRandomTable } from "../../../utils/DefaultValues/RandomTableDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";
import DrawerSection from "../DrawerSection";

export default function DrawerRandomTableContent() {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createRandomTableMutation = useCreateItem<RandomTableType>("randomtables");
  const updateRandomTableMutation = useUpdateItem<RandomTableType>("randomtables", project_id as string);
  const deleteRandomTableMutation = useDeleteItem("randomtables", project_id as string);
  const allRandomTables = queryClient.getQueryData<RandomTableType[]>(["allItems", project_id, "randomtables"]);
  const randomTable = allRandomTables?.find((dict) => dict.id === drawer.id);
  const [localItem, setLocalItem] = useState<RandomTableType | RandomTableCreateType>(
    randomTable ?? {
      ...DefaultRandomTable,
      project_id: project_id as string,
    },
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  useEffect(() => {
    if (randomTable) {
      setLocalItem(randomTable);
    } else {
      setLocalItem({
        ...DefaultRandomTable,
        project_id: project_id as string,
      });
    }
  }, [randomTable, project_id]);
  return (
    <div className="flex h-full flex-col gap-y-2 font-Lato">
      <h2 className="text-center font-Lato text-2xl">
        {randomTable ? `Edit ${randomTable.title}` : "Create New Random Table"}
      </h2>
      <DrawerSection title="Random table title">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await createUpdateItem<RandomTableType>(
                randomTable,
                localItem,
                changedData,
                DefaultRandomTable,
                allRandomTables,
                resetChanges,
                createRandomTableMutation.mutateAsync,
                updateRandomTableMutation.mutateAsync,
                setDrawer,
              );
            }
          }}
          placeholder="Random table title"
          value={localItem?.title || ""}
        />
      </DrawerSection>
      <DrawerSection title="Random table description (optional)">
        <InputTextarea
          name="description"
          onChange={(e) => handleChange(e.target)}
          placeholder="Random table description"
          value={localItem.description}
        />
      </DrawerSection>
      <div className="mt-auto flex w-full flex-col gap-y-2">
        <Button
          className="p-button-outlined p-button-success ml-auto"
          loading={createRandomTableMutation.isLoading || updateRandomTableMutation.isLoading}
          onClick={async () => {
            await createUpdateItem<RandomTableType>(
              randomTable,
              localItem,
              changedData,
              DefaultRandomTable,
              allRandomTables,
              resetChanges,
              createRandomTableMutation.mutateAsync,
              updateRandomTableMutation.mutateAsync,
              setDrawer,
            );
          }}
          type="submit">
          {buttonLabelWithIcon("Save", IconEnum.save)}
        </Button>
        {document ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            loading={deleteRandomTableMutation.isLoading}
            onClick={() => {
              if (randomTable)
                deleteItem(
                  randomTable.folder
                    ? "Are you sure you want to delete this folder? Deleting it will also delete all of its children!"
                    : "Are you sure you want to delete this dictionaries?",
                  () => {
                    deleteRandomTableMutation?.mutate(randomTable.id, {
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
