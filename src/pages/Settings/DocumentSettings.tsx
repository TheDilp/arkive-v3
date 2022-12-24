/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from "@iconify/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/documentTypes";

const columnHelper = createColumnHelper<Omit<DocumentType, "project_id" | "content">>();

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        {...{
          checked: table.getIsAllRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        {...{
          checked: row.getIsSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("image", {
    header: "Image",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("icon", {
    header: () => <div className="flex w-full justify-center">Icon</div>,
    cell: ({ getValue, row }) => (
      <div className="flex w-full justify-center">
        <Icon fontSize={24} icon={getValue() || (row.original.folder ? "mdi:folder" : "mdi:file")} />
      </div>
    ),
  }),
];
function getHeaderClassNames(select: boolean, canSort: boolean) {
  if (select) return "w-8";
  if (canSort) return "cursor-pointer select-none flex flex-1 truncate items-start px-2";
  return "flex flex-1 truncate items-start px-2";
}
function getRowClassNames(select: boolean) {
  if (select) return "w-8";
  return "flex flex-1 items-center truncate px-2";
}
export default function DocumentSettings() {
  const { project_id } = useParams();
  const { data } = useGetAllItems(project_id as string, "documents") as { data: DocumentType[] };
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data:
      data.filter((item) => {
        if ("folder" in item && item.folder) return false;
        if ("template" in item && item.template) return false;
        return true;
      }) || [],
    state: {
      rowSelection,
      sorting,
    },
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col border border-zinc-700">
        <div className="flex items-center px-4 py-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="flex flex-1">
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  {...{
                    className: getHeaderClassNames(header.id === "select", header.column.getCanSort()),
                    onClick: header.column.getToggleSortingHandler(),
                  }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex h-full w-full flex-col">
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} className="flex w-full items-center  border-zinc-700 px-4 py-2 last:border-b odd:border-y">
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className={getRowClassNames(cell.column.id === "select")}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
