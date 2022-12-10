import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ToggleButton } from "primereact/togglebutton";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import FolderCard from "../../components/Folder/FolderCard";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { getIcon, getType } from "../../utils/transform";

const columnHelper = createColumnHelper<AllItemsType>();

const columns = [
  // Display Column
  columnHelper.display({
    id: "actions",
    cell: () => "TEST",
  }),
  // Grouping Column
  columnHelper.group({
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      // Accessor Column
      columnHelper.accessor("title", {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
    ],
  }),
];

function FolderViewCards({ type, items }: { type: AvailableItemTypes; items: AllItemsType[] }) {
  return (
    <>
      {items.map((item: AllItemsType) => (
        <FolderCard key={item.id} icon={getIcon(type, item)} id={item.id} isFolder={item.folder} title={item.title} />
      ))}
    </>
  );
}

export default function FolderView() {
  const { project_id, item_id } = useParams();
  const { pathname } = useLocation();
  const [view, setView] = useState(true);
  const type = getType(pathname);
  const { data, isLoading, isError } = useGetAllItems(project_id as string, type);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  if (isLoading || isError) return null;

  const currentItems = data.filter((item) => {
    if (item_id) return item.parent === item_id;
    return !item.parent;
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="w-full">
        <ToggleButton checked={view} offLabel="Table View" onChange={(e) => setView(e.value)} onLabel="Card View" />
      </div>
      <div className="flex flex-wrap">
        {view ? (
          <FolderViewCards items={currentItems} type={type} />
        ) : (
          <div>
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <div key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                ))}
              </div>
            ))}
            {table.getRowModel().rows.map((row) => (
              <div key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
