import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { DictionaryCreateType, DictionaryType } from "../../../types/ItemTypes/dictionaryTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { DefaultDictionary } from "../../../utils/DefaultValues/DictionaryDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerDictionaryContent() {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createDictionaryMutation = useCreateItem<DictionaryType>("dictionaries");
  const updateDictionaryMutation = useUpdateItem<DictionaryType>("dictionaries", project_id as string);
  const deleteDictionaryMutation = useDeleteItem("dictionaries", project_id as string);
  const allDictionaries = queryClient.getQueryData<DictionaryType[]>(["allItems", project_id, "dictionaries"]);
  const dictionary = allDictionaries?.find((dict) => dict.id === drawer.id);
  const [localItem, setLocalItem] = useState<DictionaryType | DictionaryCreateType>(
    dictionary ?? {
      ...DefaultDictionary,
      project_id: project_id as string,
    },
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  useEffect(() => {
    if (dictionary) {
      setLocalItem(dictionary);
    } else {
      setLocalItem({
        ...DefaultDictionary,
        project_id: project_id as string,
      });
    }
  }, [dictionary, project_id]);
  return (
    <div className="flex h-full flex-col gap-y-2 font-Lato">
      <h2 className="text-center font-Lato text-2xl">{dictionary ? `Edit ${dictionary.title}` : "Create New Dictionary"}</h2>
      <InputText
        autoFocus
        className="w-full"
        name="title"
        onChange={(e) => handleChange(e.target)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            await createUpdateItem<DictionaryType>(
              dictionary,
              localItem,
              changedData,
              DefaultDictionary,
              allDictionaries,
              resetChanges,
              createDictionaryMutation.mutateAsync,
              updateDictionaryMutation.mutateAsync,
              setDrawer,
            );
          }
        }}
        placeholder="Dictionary name"
        value={localItem?.title || ""}
      />

      <Button
        className="p-button-outlined p-button-success ml-auto"
        loading={createDictionaryMutation.isLoading || updateDictionaryMutation.isLoading}
        onClick={async () => {
          await createUpdateItem<DictionaryType>(
            dictionary,
            localItem,
            changedData,
            DefaultDictionary,
            allDictionaries,
            resetChanges,
            createDictionaryMutation.mutateAsync,
            updateDictionaryMutation.mutateAsync,
            setDrawer,
          );
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {document ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            loading={deleteDictionaryMutation.isLoading}
            onClick={() => {
              if (dictionary)
                deleteItem(
                  dictionary.folder
                    ? "Are you sure you want to delete this folder? Deleting it will also delete all of its children!"
                    : "Are you sure you want to delete this dictionaries?",
                  () => {
                    deleteDictionaryMutation?.mutate(dictionary.id, {
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
