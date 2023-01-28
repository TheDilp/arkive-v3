import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useParams } from "react-router-dom";

import { useGetItem } from "../../hooks/useGetItem";
import { DictionaryType } from "../../types/ItemTypes/dictionaryTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

function LeftToolbarTemplate() {
  const [, setDrawer] = useAtom(DrawerAtom);
  return (
    <div className="flex gap-x-2">
      <Button
        className="p-button-primary p-button-outlined"
        icon="pi pi-plus"
        label="New Word"
        onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "words" })}
      />
      {/* <Button
        className="p-button-danger p-button-outlined"
        // disabled={!selectedProducts || !selectedProducts.length}
        icon="pi pi-trash"
        label="Delete"
        // onClick={confirmDeleteSelected}
      /> */}
    </div>
  );
}

export default function DictionaryView() {
  const { item_id } = useParams();
  const { data: dictionary, isLoading } = useGetItem<DictionaryType>(item_id as string, "dictionaries");
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
      </DataTable>
    </div>
  );
}
