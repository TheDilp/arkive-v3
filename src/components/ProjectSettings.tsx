import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getDocuments } from "../utils/supabaseUtils";
import LoadingScreen from "./Util/LoadingScreen";
import { Document } from "../custom-types";
type Props = {};

export default function ProjectSettings({}: Props) {
  const { project_id } = useParams();

  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
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

  const tagsBodyTemplate = (rowData: Document) => {
    return (
      <div>
        {rowData.categories
          ? rowData.categories.map((cat, index) => (
              <span>
                {cat}
                {index === rowData.categories.length - 1 ? "" : ", "}
              </span>
            ))
          : ""}
      </div>
    );
  };
  const tagItemTemplate = (option: string) => {
    return (
      <div className="">
        <span>TEST</span>
      </div>
    );
  };

  const {
    data: documents,
    error,
    isLoading,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id as string)
  );
  const representatives = [
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ];
  const representativeBodyTemplate = (rowData: any) => {
    console.log(rowData);
    return (
      <React.Fragment>
        <span className="image-text">CATEGORIES</span>
      </React.Fragment>
    );
  };

  const representativeFilterTemplate = (options: any) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };

  const representativesItemTemplate = (option: any) => {
    return (
      <div className="p-multiselect-representative-option">
        <span className="image-text">TEST</span>
      </div>
    );
  };
  if (error || isLoading) return <LoadingScreen />;
  const tagsFilterElement = (options: any) => {
    console.log(options);
    return (
      <MultiSelect
        value={["Salaraan", "Radekai", "Torenai"]}
        options={["Salaraan", "Radekai", "Torenai"]}
        itemTemplate={tagItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="Tag"
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };
  return (
    <div className="w-full px-5 mt-4">
      <DataTable
        value={documents}
        responsiveLayout="scroll"
        filterDisplay="menu"
        filters={filter}
        globalFilterFields={["name"]}
        header={header1}
      >
        <Column field="title" header="Title" filter></Column>
        <Column
          header="Agent"
          filterField="representative"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "14rem" }}
          body={representativeBodyTemplate}
          filterElement={representativeFilterTemplate}
          filter
        />
      </DataTable>
    </div>
  );
}
