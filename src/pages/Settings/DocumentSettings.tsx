import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/documentTypes";

type Props = {};

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
];

export default function DocumentSettings() {
  const { project_id } = useParams();
  const { data } = useGetAllItems(project_id as string, "documents");
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data: data || [],
    state: {
      rowSelection,
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
  });
  return (
    <div className="h-full w-full">
      <table className="flex h-full w-full flex-col border border-zinc-700">
        <thead className="flex items-center px-4 py-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex items-center">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="flex h-min items-start px-2">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="flex h-full w-full flex-col">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="flex w-full items-center border-zinc-700 px-4 py-2 last:border-b odd:border-y">
              {row.getVisibleCells().map((cell) => (
                <td className="flex items-center px-2" key={cell.id}>
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
