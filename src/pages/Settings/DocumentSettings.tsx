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

export default function DocumentSettings() {
  const { project_id } = useParams();
  const { data } = useGetAllItems(project_id as string, "documents") as { data: DocumentType[] };
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: data || [],
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
      <table className="flex h-full w-full flex-col border border-zinc-700">
        <thead className="flex items-center px-4 py-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex items-center">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  {...{
                    className: header.column.getCanSort()
                      ? "cursor-pointer select-none flex w-24 truncate items-start px-2"
                      : "flex w-24 truncate items-start px-2",
                    onClick: header.column.getToggleSortingHandler(),
                  }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="flex h-full w-full flex-col">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="flex w-full items-center  border-zinc-700 px-4 py-2 last:border-b odd:border-y">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="flex w-24 items-center truncate px-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
