import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useDeleteTagsFromAllItems, useGetAllTags, useGetTagSettings } from "../../CRUD/OtherCRUD";
import { SettingsTagsResults } from "../../types/generalTypes";

function removeTag(tag: string, tagToRemove: string) {
  return tag !== tagToRemove;
}
function deleteTagsFromAllItems(tag: string, items: SettingsTagsResults | undefined, deleteTags: any) {
  if (!items) return null;
  const { documents, maps, boards, nodes, edges } = items;
  const final = [];
  final.push(
    documents
      .filter((doc) => doc.tags.includes(tag))
      .map((doc) => ({ id: doc.id, type: "documents", tags: doc.tags.filter((itemTag) => removeTag(itemTag, tag)) })),
  );
  final.push(
    maps
      .filter((map) => map.tags.includes(tag))
      .map((map) => ({ id: map.id, type: "maps", tags: map.tags.filter((itemTag) => removeTag(itemTag, tag)) })),
  );
  final.push(
    boards
      .filter((board) => board.tags.includes(tag))
      .map((board) => ({
        id: board.id,
        type: "boards",
        tags: board.tags.filter((itemTag) => removeTag(itemTag, tag)),
      })),
  );
  final.push(
    nodes
      .filter((node) => node.tags.includes(tag))
      .map((node) => ({ id: node.id, type: "nodes", tags: node.tags.filter((itemTag) => removeTag(itemTag, tag)) })),
  );
  final.push(
    edges
      .filter((edge) => edge.tags.includes(tag))
      .map((edge) => ({ id: edge.id, type: "edges", tags: edge.tags.filter((itemTag) => removeTag(itemTag, tag)) })),
  );
  deleteTags(final);
  return null;
}
function DeleteColumn(tag: string, items: SettingsTagsResults | undefined, deleteTags: any) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-outlined p-button-danger"
        icon="pi pi-fw pi-trash"
        onClick={() => deleteTagsFromAllItems(tag, items, deleteTags)}
        tooltip="Go to item"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
    </div>
  );
}

function ExpandedSection(tag: string, items: SettingsTagsResults | undefined) {
  if (!items) return null;
  const { documents, maps, boards, nodes, edges } = items;
  // eslint-disable-next-line react/destructuring-assignment
  const filteredItems = [...documents, ...maps, ...boards, ...nodes, ...edges].filter((item) => item.tags.includes(tag));
  return (
    <div className="ml-28 flex w-full flex-col">
      <h4 className="text-lg font-semibold">Items containing this tag</h4>
      {filteredItems.map((item) => {
        return (
          <div
            key={item.id}
            className="flex cursor-pointer items-center gap-x-2 border-zinc-700 py-1 font-medium odd:border-t hover:text-sky-400">
            {"icon" in item ? <Icon icon={item.icon} /> : null}
            {"title" in item ? item.title : null}
            {"label" in item ? item?.label || "Unlabeled node/edge." : null}
          </div>
        );
      })}
    </div>
  );
}
function TagTitle(tag: string) {
  return <Tag value={tag} />;
}
export default function TagsSettings() {
  const { project_id } = useParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
  const { data: tags, isLoading: isLoadingTags } = useGetAllTags(project_id as string);
  const { data: itemsWithTags, isLoading: isLoadingItems } = useGetTagSettings(project_id as string);
  const { mutate: deleteTags } = useDeleteTagsFromAllItems(project_id as string);
  if (isLoadingTags || isLoadingItems) return <ProgressSpinner />;
  return (
    <DataTable
      editMode="cell"
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      onSelectionChange={(e) => setSelected(e.value)}
      paginator
      removableSort
      rowExpansionTemplate={(data) => ExpandedSection(data, itemsWithTags)}
      rows={10}
      selection={selected}
      selectionMode="checkbox"
      size="small"
      sortMode="multiple"
      value={tags}>
      <Column headerClassName="w-12" selectionMode="multiple" />
      <Column className="w-8" expander />
      <Column body={TagTitle} header="Tag" sortable />
      <Column
        align="center"
        body={(data) => DeleteColumn(data, itemsWithTags, deleteTags)}
        className="w-28"
        header="Delete Tag"
      />
    </DataTable>
  );
}
