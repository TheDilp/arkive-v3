import { Icon } from "@iconify/react";
import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useDeleteTags, useGetTagSettings } from "../../CRUD/OtherCRUD";
import { TagSettingsType, TagType } from "../../types/generalTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { toaster } from "../../utils/toast";

function DeleteColumn(item: TagType, deleteTags: UseMutateFunction<any, unknown, string[], unknown>) {
  const { id } = item;
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-outlined p-button-danger"
        icon="pi pi-fw pi-trash"
        onClick={() =>
          deleteItem("Are you sure you want to delete this tag?", () =>
            deleteTags([id], {
              onSuccess: () => toaster("success", "Tag successfully deleted."),
            }),
          )
        }
        tooltip="Delete tag"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
    </div>
  );
}

function ExpandedSection(tag: TagSettingsType) {
  if (!tag) return null;
  const { documents, maps, boards, nodes, edges } = tag;

  return (
    <div className="ml-28 flex w-full flex-wrap gap-y-3">
      <h4 className="w-full text-xl font-semibold">Items containing this tag</h4>
      <div className="w-1/2">
        <h5 className="flex items-center gap-x-2 text-lg font-medium underline">
          <Icon icon="mdi:files" />
          Documents
        </h5>
        {documents.map((doc) => (
          <Link
            key={doc.id}
            className="flex cursor-pointer items-center gap-x-1 pl-1 text-sm hover:text-sky-400"
            to={`../../documents${doc.folder ? "/folder" : ""}/${doc.id}`}>
            <Icon icon={doc.icon} />
            {doc.title}
          </Link>
        ))}
      </div>
      <div className="w-1/2">
        <h5 className="flex items-center gap-x-2 text-lg font-medium underline ">
          <Icon icon="mdi:map" />
          Maps
        </h5>
        {maps.map((map) => (
          <Link
            key={map.id}
            className="flex cursor-pointer items-center gap-x-1 pl-1 text-sm hover:text-sky-400"
            to={`../../maps${map.folder ? "/folder" : ""}/${map.id}`}>
            <Icon icon={map.icon} />
            {map.title}
          </Link>
        ))}
      </div>
      <div className="w-1/2">
        <h5 className="flex items-center gap-x-2 text-lg font-medium underline">
          <Icon icon="mdi:draw" />
          Boards
        </h5>
        {boards.map((board) => (
          <Link
            key={board.id}
            className="flex cursor-pointer items-center gap-x-1 pl-1 text-sm hover:text-sky-400"
            to={`../../boards${board.folder ? "/folder" : ""}/${board.id}`}>
            <Icon icon={board.icon} />
            {board.title}
          </Link>
        ))}
      </div>
      <div className="w-1/2">
        <h5 className="flex items-center gap-x-2 text-lg font-medium underline">
          <Icon icon="ph:graph-light" />
          Nodes
        </h5>
        {nodes.map((node) => (
          <Link
            key={node.id}
            className="flex cursor-pointer items-center gap-x-1 pl-1 text-sm hover:text-sky-400"
            to={`../../boards/${node.parent}/${node.id}`}>
            <Icon icon="ph:graph-light" />
            {node.label || "Unlabeled node"}
          </Link>
        ))}
      </div>
      <div className="w-1/2">
        <h5 className="flex items-center gap-x-2 text-lg font-medium underline">
          <Icon icon="ph:graph-light" />
          Edges
        </h5>
        {edges.map((edge) => (
          <Link
            key={edge.id}
            className="flex cursor-pointer items-center gap-x-1 pl-1 text-sm hover:text-sky-400"
            to={`../../boards/${edge.parent}/${edge.id}`}>
            <Icon icon="ph:graph-light" />
            {edge.label || "Unlabeled edge"}
          </Link>
        ))}
      </div>
    </div>
  );
}
function TagTitle(tag: TagType) {
  const { title } = tag;
  return <Tag value={title} />;
}
export default function TagsSettings() {
  const { project_id } = useParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
  const { data: tags, isLoading: isLoadingTags } = useGetTagSettings(project_id as string);
  const { mutate: deleteTags } = useDeleteTags(project_id as string);
  if (isLoadingTags || isLoadingTags) return <ProgressSpinner />;
  return (
    <div className="h-screen px-4 pt-4 pb-16">
      <DataTable
        editMode="cell"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onSelectionChange={(e) => setSelected(e.value)}
        paginator
        removableSort
        rowExpansionTemplate={(data) => ExpandedSection(data)}
        rows={10}
        selection={selected}
        selectionMode="checkbox"
        size="small"
        sortMode="multiple"
        value={tags}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column className="w-8" expander />
        <Column body={TagTitle} header="Tag" sortable />
        <Column align="center" body={(e) => DeleteColumn(e, deleteTags)} className="w-28" header="Delete Tag" />
      </DataTable>
    </div>
  );
}
