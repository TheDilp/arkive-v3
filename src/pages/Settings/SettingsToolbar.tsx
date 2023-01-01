import { UseMutateFunction } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Dispatch, forwardRef, MutableRefObject, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useCreateItem, useDeleteManyItems } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { toaster } from "../../utils/toast";

type Props = {
  type: AvailableItemTypes;
  filter: {
    globalFilter: { title: string; tags: string[] };
    setGlobalFilter: Dispatch<SetStateAction<{ title: string; tags: string[] }>>;
  };
  selection: {
    selected: AllItemsType[];
    setSelected: Dispatch<SetStateAction<any[]>>;
  };
};

function LeftToolbarTemplate(
  createItem: UseMutateFunction<Response | null, unknown, Partial<AllItemsType>, unknown>,
  project_id: string,
  deletedSelected: () => void,
) {
  return (
    <div className="flex gap-x-2">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-plus"
        label="New"
        onClick={() =>
          createItem({
            title: "New Document",
            project_id: project_id as string,
          })
        }
      />
      <Button
        className="p-button-danger p-button-outlined"
        // disabled={selectedDocuments.length === 0}
        icon="pi pi-trash"
        label="Delete Selected"
        onClick={deletedSelected}
      />
    </div>
  );
}
function RightToolbarTemplate(
  ref: MutableRefObject<DataTable>,
  filter: {
    globalFilter: { title: string; tags: string[] };
    setGlobalFilter: Dispatch<SetStateAction<{ title: string; tags: string[] }>>;
  },
) {
  const { project_id } = useParams();
  const { current } = ref;
  const { globalFilter, setGlobalFilter } = filter;

  const { data: tags } = useGetAllTags(project_id as string);
  const [localFilter, setLocalFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  const updateFilterTitle = useDebouncedCallback((title: string) => {
    setGlobalFilter({ title, tags: globalFilter.tags });
    setLoading(false);
  }, 850);

  useEffect(() => {
    setLoading(true);
    updateFilterTitle(localFilter);
  }, [localFilter]);

  return (
    <div className="flex flex-1 gap-x-2">
      <Button
        className="p-button-outlined w-48"
        icon="pi pi-filter-slash"
        label="Reset"
        onClick={() => {
          // @ts-ignore
          current?.reset();
          setGlobalFilter({ title: globalFilter.title, tags: [] });
        }}
        tooltip="Resets Filters, Sorting and Pagination"
        type="button"
      />
      <AutoComplete
        className="w-full"
        completeMethod={(e) => setFilteredTags(tags?.filter((tag) => tag.toLowerCase().includes(e.query.toLowerCase())) || [])}
        multiple
        onChange={(e) => setGlobalFilter({ title: globalFilter.title, tags: e.value })}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            if (globalFilter.tags.includes(e.currentTarget.value))
              setGlobalFilter({
                title: globalFilter.title,
                tags: globalFilter.tags.filter((tag) => tag !== e.currentTarget.value),
              });
            else setGlobalFilter({ title: globalFilter.title, tags: [...globalFilter.tags, e.currentTarget.value] });
          }
        }}
        onSelect={(e) => {
          if (globalFilter.tags.includes(e.value))
            setGlobalFilter({ title: globalFilter.title, tags: globalFilter.tags.filter((tag) => tag !== e.value) });
          else setGlobalFilter({ title: globalFilter.title, tags: [...globalFilter.tags, e.value] });
        }}
        placeholder="Search by tags"
        suggestions={filteredTags}
        value={globalFilter.tags}
      />
      <span className="p-input-icon-right">
        {loading ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-search" />}
        <InputText onChange={(e) => setLocalFilter(e.currentTarget.value)} placeholder="Quick Search" value={localFilter} />
      </span>
    </div>
  );
}

const SettingsToolbar = forwardRef<DataTable, Props>(({ type, filter, selection }, ref) => {
  const { project_id } = useParams();
  const { mutate: deleteItemsMutation } = useDeleteManyItems("documents", project_id as string);

  const { mutate } = useCreateItem(type);
  const deleteSelected = () => {
    if (selection.selected.length)
      deleteItem("Are you sure you want to delete these items?", () =>
        deleteItemsMutation(selection.selected.map((doc) => doc.id)),
      );
    else toaster("warning", "No items are selected.");
  };
  return (
    <Toolbar
      className="mb-1 flex"
      left={() => LeftToolbarTemplate(mutate, project_id as string, deleteSelected)}
      right={() => RightToolbarTemplate(ref as MutableRefObject<DataTable>, filter)}
    />
  );
});

export default SettingsToolbar;
