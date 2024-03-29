import { SetStateAction, useSetAtom } from "jotai";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

import { useDeleteSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { DictionaryType, WordType } from "../../types/ItemTypes/dictionaryTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { setTabTitle } from "../../utils/uiUtils";

function ActionsColumn(
  data: WordType,
  deleteAction: (wordId: string) => void,
  setDrawer: (update: SetStateAction<DrawerAtomType>) => void,
) {
  const { id } = data;
  return (
    <div className="flex w-full justify-start gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-pencil"
        onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "words", data })}
        tooltip="Edit word"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
      <Button
        className="p-button-danger p-button-outlined"
        icon="pi pi-fw pi-trash"
        iconPos="right"
        onClick={() => deleteAction(id)}
      />
    </div>
  );
}

function LeftToolbarTemplate() {
  const setDrawer = useSetAtom(DrawerAtom);
  return (
    <div className="flex gap-x-2">
      <Button
        className="p-button-primary p-button-outlined"
        icon="pi pi-plus"
        label="New Word"
        onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "words" })}
      />
    </div>
  );
}

export default function DictionaryView() {
  const { item_id } = useParams();
  const { data: dictionary, isLoading } = useGetItem<DictionaryType>(item_id as string, "dictionaries");

  const deleteWordMutation = useDeleteSubItem(item_id as string, "words", "dictionaries");
  const setDrawer = useSetAtom(DrawerAtom);

  useLayoutEffect(() => {
    if (dictionary?.title) {
      setTabTitle(dictionary.title);
    }
  }, [dictionary]);

  return (
    <div className="p-4">
      <Toolbar className="mb-4" left={LeftToolbarTemplate} />
      <DataTable loading={isLoading} paginator responsiveLayout="scroll" rows={10} value={dictionary?.words || []}>
        <Column
          bodyClassName="italic font-semilight"
          field="title"
          header="Title"
          headerClassName="text-lg font-Merriweather"
        />
        <Column field="translation" header="Translation" headerClassName="text-lg font-Merriweather" />
        <Column field="description" header="Description" headerClassName="text-lg font-Merriweather" />
        <Column
          body={(row) =>
            ActionsColumn(
              row,
              (wordId: string) => {
                deleteItem("Are you sure you want to delete this word?", () => {
                  deleteWordMutation.mutate(wordId);
                });
              },
              setDrawer,
            )
          }
          header="Actions"
          headerClassName="text-lg font-Merriweather"
        />
      </DataTable>
    </div>
  );
}
