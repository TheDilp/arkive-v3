import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteItem, useUpdateSubItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { DictionaryType, WordCreateType, WordType } from "../../../types/ItemTypes/dictionaryTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultWord } from "../../../utils/DefaultValues/DictionaryDefaults";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { handleCloseDrawer } from "../Drawer";

function disableWordSaveButton(localItem: WordType | WordCreateType) {
  if (!localItem.title || !localItem.translation) return true;
  return false;
}

export default function DrawerWordContent() {
  const queryClient = useQueryClient();
  const { project_id, item_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createWordMutation = useCreateSubItem<WordType>(item_id as string, "words", "dictionaries");
  const updateWordMutation = useUpdateSubItem<WordType>(item_id as string, "words", "dictionaries");
  const deleteWordMutation = useDeleteItem("words", project_id as string);
  const allDictionaries = queryClient.getQueryData<DictionaryType[]>(["allItems", project_id, "dictionaries"]);
  const dictionary = allDictionaries?.find((dict) => dict.id === item_id);

  const [localItem, setLocalItem] = useState<WordType | WordCreateType>(drawer?.data ?? DefaultWord);
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  const createUpdateWord = () => {
    if (localItem) {
      if (changedData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tags, ...rest } = changedData;
        if (localItem?.id)
          updateWordMutation.mutate(
            { id: localItem.id, ...rest },
            {
              onSuccess: () => {
                toaster("success", `Section ${localItem?.title || ""} was successfully updated.`);
                resetChanges();
                if (tags)
                  queryClient.setQueryData(["dictionaries", item_id], (oldData: DictionaryType | undefined) => {
                    if (oldData)
                      return {
                        ...oldData,
                        words: oldData?.words?.map((oldWord) => {
                          if (oldWord.id === localItem.id) {
                            return { ...oldWord, tags };
                          }
                          return oldWord;
                        }),
                      };
                    return oldData;
                  });

                handleCloseDrawer(setDrawer, "right");
              },
            },
          );
        else
          createWordMutation.mutate(
            { ...DefaultWord, ...changedData, id: crypto.randomUUID(), parentId: item_id as string },

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

  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center text-2xl">{localItem?.id ? `Edit ${localItem.title}` : "Create New Word"}</h2>
      <h3 className="text-center text-lg">{`For dictionary "${dictionary?.title}"`}</h3>
      <InputText
        autoFocus
        className="w-full"
        name="title"
        onChange={(e) => handleChange(e.target)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            createUpdateWord();
          }
        }}
        placeholder="Word"
        value={localItem?.title || ""}
      />
      <InputText
        className="w-full"
        name="translation"
        onChange={(e) => handleChange(e.target)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            createUpdateWord();
          }
        }}
        placeholder="Word translation"
        value={localItem?.translation || ""}
      />

      <InputTextarea
        className="w-full"
        maxLength={200}
        name="description"
        onChange={(e) => handleChange(e.target)}
        placeholder="Word explanation/context (max 200 characters)"
        rows={8}
        value={localItem?.description || ""}
      />

      <Button
        className="p-button-outlined p-button-success ml-auto"
        disabled={disableWordSaveButton(localItem)}
        loading={createWordMutation.isLoading || updateWordMutation.isLoading}
        onClick={async () => {
          createUpdateWord();
        }}
        type="submit">
        {buttonLabelWithIcon("Save", IconEnum.save)}
      </Button>
      <div className="mt-auto flex w-full">
        {document ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            loading={deleteWordMutation.isLoading}
            onClick={() => {
              if (dictionary)
                deleteItem(
                  "Are you sure you want to delete this word?",
                  () => {
                    deleteWordMutation?.mutate(dictionary.id, {
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
