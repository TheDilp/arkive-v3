import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toolbar } from "primereact/toolbar";
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document } from "../custom-types";
import {
  createManyDocuments,
  deleteDocument,
  deleteManyDocuments,
  getCurrentProject,
  getDocumentsForSettings,
  updateDocument,
} from "../utils/supabaseUtils";
import LoadingScreen from "./Util/LoadingScreen";
type Props = {};

export default function ProjectSettings({}: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
    folder: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filter = { ...filter };
    _filter.global.value = value;

    setFilter(_filter);
    setGlobalFilterValue1(value);
  };

  const {
    data: documents,
    error: documentsError,
    isLoading: documentsLoading,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocumentsForSettings(project_id as string)
  );
  const {
    data: project,
    error: projectError,
    isLoading: projectLoading,
  } = useQuery(
    `${project_id}-project`,
    async () => await getCurrentProject(project_id as string)
  );

  if (documentsError || documentsLoading || projectError || projectLoading)
    return <LoadingScreen />;
  const categoriesBodyTemplate = (rowData: Document) => {
    return (
      <div className="">
        {rowData.categories?.map((cat, index) => (
          <Chip label={cat} className="m-1 bg-primary text-primary"></Chip>
        ))}
      </div>
    );
  };
  const categoriesFilterTemplate = (options: any) => {
    return (
      <MultiSelect
        value={options.value}
        display="chip"
        options={project?.categories || []}
        itemTemplate={categoriesItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        placeholder="Any"
        className="p-column-filter w-12"
      />
    );
  };
  const categoriesItemTemplate = (option: any) => {
    return (
      <div className="p-multiselect-representative-option">
        <span className="image-text">{option}</span>
      </div>
    );
  };

  const imageBodyTemplate = (rowData: Document) => {
    return (
      <div className="w-4rem h-4rem relative">
        {rowData.image && (
          <img
            src={rowData.image}
            alt="document"
            className="w-full h-full border-round"
            loading="lazy"
          />
        )}
      </div>
    );
  };
  const folderBodyTemplate = (rowData: Document) => {
    return (
      <div className="relative flex justify-content-center">
        <Checkbox
          checked={rowData.folder}
          onChange={(e) =>
            updateDocument(
              rowData.id,
              undefined,
              undefined,
              undefined,
              e.checked
            )
          }
        />
      </div>
    );
  };
  const deleteBodyTemplate = (rowData: Document) => {
    return (
      <Button
        label="Delete"
        className="p-button-danger p-button-outlined"
        icon="pi pi-fw pi-trash"
        iconPos="right"
        onClick={() => {
          confirmDialog({
            message: `Are you sure you want to delete ${rowData.title}?`,
            header: `Deleting ${rowData.title}`,
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => {
              deleteDocument(rowData.id).then(() => {
                queryClient.setQueryData(
                  `${project_id}-documents`,
                  (oldData: Document[] | undefined) => {
                    if (oldData) {
                      return oldData.filter((doc) => doc.id !== rowData.id);
                    } else {
                      return [];
                    }
                  }
                );
              });
            },
          });
        }}
      />
    );
  };
  const leftToolbarTemplate = () => {
    return (
      <div>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2 p-button-outlined"
        />
        <Button
          label="Delete Selected"
          icon="pi pi-trash"
          className="p-button-danger p-button-outlined"
          disabled={selectedDocuments.length === 0}
          onClick={() =>
            confirmDialog({
              message: selectAll
                ? "Are you sure you want to delete all of your documents?"
                : `Are you sure you want to delete ${selectedDocuments.length} documents?`,
              header: `Deleting ${selectedDocuments.length} documents`,
              icon: "pi pi-exclamation-triangle",
              acceptClassName: "p-button-danger",
              className: selectAll ? "deleteAllDocuments" : "",
              accept: () => {
                let documentIdsForDeletion = selectedDocuments.map(
                  (doc: Document) => doc.id
                );
                deleteManyDocuments(documentIdsForDeletion).then(() => {
                  queryClient.setQueryData(
                    `${project_id}-documents`,
                    (oldData: Document[] | undefined) => {
                      if (oldData) {
                        return oldData.filter(
                          (doc) => !documentIdsForDeletion.includes(doc.id)
                        );
                      } else {
                        return [];
                      }
                    }
                  );
                });
              },
            })
          }
        />
      </div>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined mr-2"
          onClick={() =>
            setFilter({
              global: { value: null, matchMode: FilterMatchMode.CONTAINS },
              title: {
                operator: FilterOperator.AND,
                constraints: [
                  { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                ],
              },
              categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
            })
          }
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange}
            placeholder="Quick Search"
          />
        </span>
      </div>
    );
  };
  const onSelectAllChange = (event: any) => {
    const selectAll = event.checked;

    if (selectAll && documents) {
      setSelectAll(true);
      setSelectedDocuments(documents);
    } else {
      setSelectAll(false);
      setSelectedDocuments([]);
    }
  };

  return (
    <div className="w-full px-8 mx-8 mt-4">
      <ConfirmDialog />
      <Toolbar
        className="mb-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataTable
        value={documents}
        selection={selectedDocuments}
        selectionMode="checkbox"
        paginator
        rows={8}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
        onSelectionChange={(e) => {
          const value = e.value;
          setSelectedDocuments(value);
          setSelectAll(value.length === documents?.length);
        }}
        filterDisplay="menu"
        filters={filter}
        globalFilterFields={["title"]}
        size="small"
      >
        <Column selectionMode="multiple"></Column>
        <Column field="title" header="Title" filter></Column>
        <Column field="image" header="Image" body={imageBodyTemplate}></Column>
        <Column
          header="Folder"
          alignHeader={"center"}
          field="folder"
          filter
          body={folderBodyTemplate}
        ></Column>
        <Column
          header={() => <div className="text-center">Categories</div>}
          filterField="categories"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "28rem" }}
          body={categoriesBodyTemplate}
          filterElement={categoriesFilterTemplate}
          filter
        />
        <Column header="Delete" body={deleteBodyTemplate} />
      </DataTable>
    </div>
  );
}
