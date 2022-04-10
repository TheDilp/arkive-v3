import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../custom-types";
import { Chip } from "primereact/chip";
import {
  deleteDocument,
  getCurrentProject,
  getDocumentsForSettings,
} from "../utils/supabaseUtils";
import LoadingScreen from "./Util/LoadingScreen";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
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
  });
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filter = { ...filter };
    _filter.global.value = value;

    setFilter(_filter);
    setGlobalFilterValue1(value);
  };
  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
          onClick={() =>
            setFilter({
              global: { value: null, matchMode: FilterMatchMode.CONTAINS },
              name: {
                operator: FilterOperator.AND,
                constraints: [
                  { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                ],
              },
            })
          }
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header1 = renderHeader1();

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

  return (
    <div className="w-full px-8 mx-8 mt-4">
      <ConfirmDialog />
      <DataTable
        value={documents}
        responsiveLayout="scroll"
        filterDisplay="menu"
        filters={filter}
        globalFilterFields={["name"]}
        header={header1}
      >
        <Column field="title" header="Title" filter></Column>
        <Column field="image" header="Image" body={imageBodyTemplate}></Column>

        <Column
          header="Tags"
          filterField="categories"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "28rem" }}
          style={{ maxWidth: "14rem" }}
          body={categoriesBodyTemplate}
          filterElement={categoriesFilterTemplate}
          filter
        />
        <Column header="Delete" body={deleteBodyTemplate} />
      </DataTable>
    </div>
  );
}
