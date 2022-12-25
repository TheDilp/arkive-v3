import { UseMutateFunction } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Dispatch, forwardRef, MutableRefObject, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { getSearchTags } from "../../utils/CRUD/CRUDFunctions";

type Props = {
  type: AvailableItemTypes;
  filter: {
    globalFilter: { title: string; tags: string[] };
    setGlobalFilter: Dispatch<SetStateAction<{ title: string; tags: string[] }>>;
  };
};

const leftToolbarTemplate = (
  createItem: UseMutateFunction<Response | null, unknown, Partial<AllItemsType>, unknown>,
  project_id: string,
) => {
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
        // onClick={() =>
        //   confirmDialog({
        //     message: selectAll
        //       ? "Are you sure you want to delete all of your documents?"
        //       : `Are you sure you want to delete ${selectedDocuments.length} documents?`,
        //     header: `Deleting ${selectedDocuments.length} documents`,
        //     icon: "pi pi-exclamation-triangle",
        //     acceptClassName: "p-button-danger",
        //     className: selectAll ? "deleteAllDocuments" : "",
        //     accept: () => {
        //       deleteManyDocuments(selectedDocuments).then(() => {
        //         queryClient.setQueryData(`${project_id}-documents`, (oldData: DocumentProps[] | undefined) => {
        //           if (oldData) {
        //             return oldData.filter((doc) => !selectedDocuments.includes(doc.id));
        //           }
        //           return [];
        //         });
        //       });
        //     },
        //   })
        // }
      />
    </div>
  );
};
function RightToolbarTemplate(
  ref: MutableRefObject<DataTable>,
  filter: {
    globalFilter: { title: string; tags: string[] };
    setGlobalFilter: Dispatch<SetStateAction<{ title: string; tags: string[] }>>;
  },
  type: AvailableItemTypes,
) {
  const { project_id } = useParams();
  const { current } = ref;
  const { globalFilter, setGlobalFilter } = filter;

  const { data: tags } = useGetAllTags(project_id as string, type);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  return (
    <div className="flex flex-1 gap-x-2">
      <Button
        className="w-48 p-button-outlined"
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
        suggestions={filteredTags}
        value={globalFilter.tags}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          onChange={(e) => {
            setGlobalFilter({ title: e.currentTarget.value, tags: globalFilter.tags });
          }}
          placeholder="Quick Search"
          value={globalFilter.title}
        />
      </span>
    </div>
  );
}

const SettingsToolbar = forwardRef<DataTable, Props>(({ type, filter }, ref) => {
  const { project_id } = useParams();
  const { mutate } = useCreateItem(type);
  return (
    <Toolbar
      className="flex mb-1"
      left={() => leftToolbarTemplate(mutate, project_id as string)}
      right={() => RightToolbarTemplate(ref as MutableRefObject<DataTable>, filter, type)}
    />
  );
});

export default SettingsToolbar;
