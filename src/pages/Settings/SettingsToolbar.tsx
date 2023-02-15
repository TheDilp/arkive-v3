import { UseMutateFunction } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Dispatch, forwardRef, MutableRefObject, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { capitalCase } from "remirror";
import { useDebouncedCallback } from "use-debounce";

import { useCreateItem, useDeleteManyItems } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { AllItemsType, AvailableItemTypes, TagType } from "../../types/generalTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { toaster } from "../../utils/toast";
import { getItemNameForTree } from "../../utils/transform";

type Props = {
  type: AvailableItemTypes;
  filter: {
    globalFilter: { title: string; tags: TagType[] };
    setGlobalFilter: Dispatch<SetStateAction<{ title: string; tags: TagType[] }>>;
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
  type: AvailableItemTypes,
  isMutating: boolean,
) {
  return (
    <div className="flex gap-x-2 lg:w-full">
      <Button
        className="p-button-success p-button-outlined w-24"
        disabled={isMutating}
        icon="pi pi-plus"
        label="New"
        loading={isMutating}
        onClick={() =>
          createItem({
            title: `New ${capitalCase(getItemNameForTree(type))}`,
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
    globalFilter: { title: string; tags: TagType[] };
    setGlobalFilter: Dispatch<SetStateAction<{ title: string; tags: TagType[] }>>;
  },
) {
  const { project_id } = useParams();
  const { current } = ref;
  const { globalFilter, setGlobalFilter } = filter;

  const { data: tags } = useGetAllTags(project_id as string);
  const [localFilter, setLocalFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);

  const updateFilterTitle = useDebouncedCallback((title: string) => {
    setGlobalFilter({ title, tags: globalFilter.tags });
    setLoading(false);
  }, 850);

  useEffect(() => {
    setLoading(true);
    updateFilterTitle(localFilter);
  }, [localFilter]);

  return (
    <div className="flex flex-1 gap-x-2 lg:w-full ">
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
        completeMethod={(e) =>
          setFilteredTags(tags?.filter((tag) => tag.title.toLowerCase().includes(e.query.toLowerCase())) || [])
        }
        field="title"
        multiple
        onChange={(e) => setGlobalFilter({ title: globalFilter.title, tags: e.value })}
        onSelect={(e) => {
          if (globalFilter.tags.includes(e.value.id))
            setGlobalFilter({ title: globalFilter.title, tags: globalFilter.tags.filter((tag) => tag.id !== e.value.id) });
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
  const { mutate: deleteItemsMutation } = useDeleteManyItems(type, project_id as string);

  const { mutate, isLoading: isLoadingCreateItem } = useCreateItem(type);
  const deleteSelected = () => {
    if (selection.selected.length)
      deleteItem("Are you sure you want to delete these items?", () =>
        deleteItemsMutation(selection.selected.map((doc) => doc.id)),
      );
    else toaster("warning", "No items are selected.");
  };
  return (
    <Toolbar
      className="mb-1 flex gap-y-1 overflow-x-auto p-0 lg:flex-wrap"
      left={() => LeftToolbarTemplate(mutate, project_id as string, deleteSelected, type, isLoadingCreateItem)}
      right={() => RightToolbarTemplate(ref as MutableRefObject<DataTable>, filter)}
    />
  );
});

export default SettingsToolbar;
