import { SetStateAction } from "jotai";
import { DataTable } from "primereact/datatable";
import { Dispatch, MutableRefObject } from "react";

import { AllItemsType } from "../../types/generalTypes";

type Props = {
  children: JSX.Element | JSX.Element[];
  data: AllItemsType[];
  globalFilter: {
    title: string;
    tags: string[];
  };
  selected: AllItemsType[];
  setSelected: Dispatch<SetStateAction<any>>;
  tableRef: MutableRefObject<DataTable>;
};

export default function SettingsTable({ children, data, selected, setSelected, globalFilter, tableRef }: Props) {
  return (
    <DataTable
      ref={tableRef}
      dataKey="id"
      editMode="cell"
      filterDisplay="menu"
      onSelectionChange={(e) => setSelected(e.value)}
      paginator
      removableSort
      rows={10}
      selection={selected}
      selectionMode="checkbox"
      showGridlines
      size="small"
      sortMode="multiple"
      value={data
        ?.filter((item) => (globalFilter.title ? item.title.toLowerCase().includes(globalFilter.title.toLowerCase()) : true))
        ?.filter((doc) => (globalFilter.tags.length ? globalFilter.tags.every((tag) => doc.tags.includes(tag)) : true))}>
      {children}
    </DataTable>
  );
}
