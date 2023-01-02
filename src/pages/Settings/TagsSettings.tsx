import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useDeleteTagsFromAllItems, useGetTagSettings } from "../../CRUD/OtherCRUD";
import { TagSettingsType, TagType } from "../../types/generalTypes";

function removeTag(tag: string, tagToRemove: string) {
  return tag !== tagToRemove;
}
function deleteTagsFromAllItems(tag: string, items: TagSettingsType[] | undefined, deleteTags: any) {
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
function DeleteColumn(tag: string, items: TagSettingsType | undefined, deleteTags: any) {
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

function ExpandedSection(tag: TagSettingsType) {
  if (!tag) return null;
  const { documents, maps, boards, nodes, edges } = tag;

  return (
    <div className="ml-28 flex w-full flex-col">
      <h4 className="text-lg font-semibold">Items containing this tag</h4>
      <h5 className="font-medium underline">Documents</h5>
      {documents.map((doc) => (
        <Link
          key={doc.id}
          className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
          to={`../../documents${doc.folder ? "/folder" : ""}/${doc.id}`}>
          <Icon icon={doc.icon} />
          {doc.title}
        </Link>
      ))}
      <h5 className="font-medium underline">Maps</h5>
      {maps.map((map) => (
        <Link
          key={map.id}
          className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
          to={`../../maps${map.folder ? "/folder" : ""}/${map.id}`}>
          <Icon icon={map.icon} />
          {map.title}
        </Link>
      ))}
      <h5 className="font-medium underline">Boards</h5>
      {boards.map((board) => (
        <Link
          key={board.id}
          className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
          to={`../../boards${board.folder ? "/folder" : ""}/${board.id}`}>
          {board.title}
        </Link>
      ))}
      <h5 className="font-medium underline">Nodes</h5>
      {nodes.map((node) => (
        <Link
          key={node.id}
          className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
          to={`../../boards/${node.parent}/${node.id}`}>
          <Icon icon="ph:graph-light" />
          {node.label || "Unlabeled node"}
        </Link>
      ))}
      <h5>Edges</h5>
      {edges.map((edge) => (
        <Link
          key={edge.id}
          className="flex cursor-pointer items-center gap-x-1 pl-1 hover:text-sky-400"
          to={`../../boards/${edge.parent}/${edge.id}`}>
          <Icon icon="ph:graph-light" />
          {edge.label || "Unlabeled edge"}
        </Link>
      ))}
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
  const { mutate: deleteTags } = useDeleteTagsFromAllItems(project_id as string);
  if (isLoadingTags || isLoadingTags) return <ProgressSpinner />;
  return (
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
      <Column
        align="center"
        // body={(data) => DeleteColumn(data, itemsWithTags, deleteTags)}
        className="w-28"
        header="Delete Tag"
      />
    </DataTable>
  );
}
