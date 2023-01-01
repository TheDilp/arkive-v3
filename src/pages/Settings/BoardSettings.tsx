import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { MutableRefObject, useRef, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

import { IconSelect } from "../../components/IconSelect/IconSelect";
import { TitleEditor } from "../../components/Settings/Editors/TitleEditor";
import SettingsTable from "../../components/Settings/SettingsTable";
import Tags from "../../components/Tags/Tags";
import { useDeleteItem, useGetAllItems, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { BoardType } from "../../types/boardTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { toaster } from "../../utils/toast";
import SettingsToolbar from "./SettingsToolbar";
// TABLE UTIL FUNCTIONS
function getCheckedValue(
  { folder, isPublic }: { folder: boolean; isPublic: boolean },
  type: "folder" | "template" | "isPublic",
) {
  if (type === "folder") return folder;
  if (type === "isPublic") return isPublic;
  return false;
}

function IconColumn({ id, icon, folder }: BoardType) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const updateMapMutation = useUpdateItem<BoardType>("boards", project_id as string);
  return (
    <div className="flex justify-center">
      <IconSelect
        disabled={folder}
        setIcon={(newIcon) => {
          updateMapMutation?.mutate(
            { icon: newIcon, id },
            {
              onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ["allItems", project_id, "boards"] });
                toaster("success", "Icon updated successfully.");
              },
            },
          );
        }}>
        <Icon
          className={`rounded-full ${folder ? "" : "cursor-pointer hover:bg-sky-400"}`}
          fontSize={24}
          icon={folder ? "mdi:folder" : icon || "mdi:file"}
          inline
        />
      </IconSelect>
    </div>
  );
}

function FolderPublicColumn({ id, folder, isPublic }: BoardType, type: "folder" | "isPublic") {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateItem("boards", project_id as string);
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={getCheckedValue({ folder, isPublic }, type)}
      onChange={(e) =>
        updateDocumentMutation?.mutate(
          { [type]: e.checked, id },
          {
            onSuccess: () => {
              queryClient.refetchQueries({ queryKey: ["allItems", project_id, "boards"] });
              toaster("success", "Item updated successfully.");
            },
          },
        )
      }
    />
  );
}
function ParentColumn({ parent }: BoardType, boards: BoardType[]) {
  // eslint-disable-next-line react/destructuring-assignment
  const parentFolder = boards?.find((doc) => doc.id === parent?.id);
  if (parentFolder) return <div className="w-full">{parentFolder.title}</div>;
  return null;
}

function TagsColumn({ tags }: BoardType, type: "tags") {
  return (
    <div className={`flex justify-center gap-x-1 ${type}Tags`}>
      {tags?.map((tag) => (
        <Tag key={tag} value={tag} />
      ))}
    </div>
  );
}

function TagsEditor(
  editorOptions: ColumnEditorOptions,
  updateBoard: (data: Partial<BoardType>) => void,
  refetchTags: () => void,
) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <Tags
      handleChange={({ name, value }) => {
        updateBoard({ id: rowData.id, [name]: value });
        refetchTags();
        if (editorCallback) editorCallback(value);
      }}
      localItem={rowData}
    />
  );
}

function ActionsColumn({ id, folder }: BoardType, navigate: NavigateFunction, deleteAction: (docId: string) => void) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-link"
        onClick={() => {
          navigate(`../../boards/${folder ? "folder/" : ""}${id}`);
        }}
        tooltip="Go to item"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
      <Button
        className="p-button-danger p-button-outlined"
        icon="pi pi-fw pi-trash"
        iconPos="right"
        onClick={() => deleteAction(id)}
      />
    </div>
  );
}

export default function BoardSettings() {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const tableRef = useRef() as MutableRefObject<DataTable>;
  const { data: boards, isLoading } = useGetAllItems<BoardType>(project_id as string, "boards");
  const [selected, setSelected] = useState<BoardType[]>([]);
  const [globalFilter, setGlobalFilter] = useState<{ title: string; tags: string[] }>({ title: "", tags: [] });

  const { mutate } = useUpdateItem("boards", project_id as string);
  const { mutate: deleteMutation } = useDeleteItem("boards", project_id as string);
  const queryClient = useQueryClient();

  const updateBoard = (data: Partial<BoardType>) =>
    mutate(data, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "boards"] });
        toaster("success", "Item updated successfully.");
      },
    });
  const refetchTags = async () => queryClient.refetchQueries({ queryKey: ["allTags", project_id, "boards"] });
  const deleteAction = (id: string) => deleteItem("Are you sure you want to delete this item?", () => deleteMutation(id));
  if (!boards && isLoading) return <ProgressSpinner />;
  if (!boards) return null;
  return (
    <div className="p-4">
      <SettingsToolbar
        ref={tableRef}
        filter={{ globalFilter, setGlobalFilter }}
        selection={{ selected, setSelected }}
        type="boards"
      />
      <SettingsTable
        data={boards}
        globalFilter={globalFilter}
        selected={selected}
        setSelected={setSelected}
        tableRef={tableRef}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column editor={(e) => TitleEditor(e, updateBoard)} field="title" header="Title" sortable />
        <Column align="center" body={IconColumn} className="w-24" field="icon" header="Icon" />

        <Column
          align="center"
          body={(data) => ParentColumn(data, boards)}
          className="w-48"
          field="parent"
          header="Parent"
          sortable
          sortField="parent"
        />
        <Column
          align="center"
          body={(data) => TagsColumn(data, "tags")}
          editor={(e) => TagsEditor(e, updateBoard, refetchTags)}
          field="tags"
          header="Tags"
          sortable
          sortField="tags"
        />
        <Column
          align="center"
          body={(data) => FolderPublicColumn(data, "folder")}
          className="w-10"
          field="folder"
          header="Folder"
          sortable
        />

        <Column
          align="center"
          body={(data) => FolderPublicColumn(data, "isPublic")}
          className="w-10"
          field="isPublic"
          header="Public"
          sortable
        />

        <Column align="center" body={(data) => ActionsColumn(data, navigate, deleteAction)} header="Actions" />
      </SettingsTable>
    </div>
  );
}
