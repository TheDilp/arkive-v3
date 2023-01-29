import { SetStateAction } from "jotai";
import { DataTable } from "primereact/datatable";
import { Dispatch, MutableRefObject } from "react";

import { AllItemsType, TagType } from "../../types/generalTypes";

type Props = {
  children: JSX.Element | JSX.Element[];
  data: AllItemsType[];
  globalFilter: {
    title: string;
    tags: TagType[];
  };
  isLoading: boolean;
  selected: AllItemsType[];
  setSelected: Dispatch<SetStateAction<any>>;
  tableRef: MutableRefObject<DataTable>;
};

export default function SettingsTable({ children, data, selected, setSelected, globalFilter, isLoading, tableRef }: Props) {
  return (
    <DataTable
      ref={tableRef}
      className="h-full w-full"
      dataKey="id"
      editMode="cell"
      filterDisplay="menu"
      loading={isLoading}
      onSelectionChange={(e) => setSelected(e.value)}
      paginator
      removableSort
      responsiveLayout="scroll"
      rows={10}
      scrollHeight="80%"
      selection={selected}
      selectionMode="checkbox"
      showGridlines
      size="small"
      sortMode="multiple"
      value={data
        ?.filter((item) => (globalFilter.title ? item.title.toLowerCase().includes(globalFilter.title.toLowerCase()) : true))
        ?.filter((doc) =>
          globalFilter.tags.length ? globalFilter.tags.every((tag) => doc.tags.some((docTag) => docTag.id === tag.id)) : true,
        )}>
      {children}
    </DataTable>
  );
}
