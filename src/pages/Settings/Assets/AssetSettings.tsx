import { saveAs } from "file-saver";
import { Button } from "primereact/button";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { useParams } from "react-router-dom";

import { useGetAllSettingsImages } from "../../../CRUD/ItemsCRUD";

export default function ListLayout() {
  const { project_id } = useParams();

  const { data: images } = useGetAllSettingsImages(project_id as string);
  const actionsBodyTemplate = (rowData: string) => {
    return (
      <div className="justify-content-end flex w-full">
        <Button
          className="p-button-primary p-button-outlined mr-2"
          icon="pi pi-fw pi-download"
          iconPos="right"
          //   onClick={async () => {
          //     const d = await downloadImage(rowData.link);
          //     if (d) {
          //       saveAs(
          //         new Blob([d], {
          //           type: d.type,
          //         }),
          //         `${rowData.title || rowData.id || project_id + "-image"}`,
          //       );
          //     }
          //   }}
        />
        <Button
          className="p-button-outlined text-red-400"
          icon="pi pi-fw pi-trash"
          iconPos="right"
          //   onClick={() => deleteImagesMutation.mutate([rowData.link])}
        />
      </div>
    );
  };
  const imageBodyTemplate = (rowData: string) => {
    return <div className="justify-content-center flex h-auto w-full cursor-pointer">IMAGE HERE</div>;
  };
  const titleEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        value={options.value}
        // onChange={(e) => {
        //   if (options.rowData.id && e.target.value)
        //     //@ts-ignore
        //     options.editorCallback(e.target.value);
        // }}
      />
    );
  };
  const typeFilterTemplate = (options: any) => {
    return (
      <SelectButton
        value={options.value}
        // options={["Image", "Map"]}
        // className="p-button-outlined mb-2 w-full"
        // onChange={(e) => {
        //   options.filterCallback(e.value);
        // }}
      />
    );
  };
  return (
    <div className=" align-items-start align-content-top justify-content-center flex  w-full">
      <DataTable
        // ref={tableRef}
        className="mt-5 h-full w-full"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        onSelectionChange={(e) => {
          //   setSelected(e.value);
          // setSelectAll(value.length === documents.data?.length);
        }}
        paginator
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        responsiveLayout="scroll"
        rows={10}
        rowsPerPageOptions={[10, 25, 40, 70, 100]}
        // selection={selected}
        size="small"
        sortField="title"
        sortOrder={1}
        // value={images.filter((image) => image.title.toLowerCase().includes(filter.toLowerCase()))}
      >
        <Column className="w-1rem" selectionMode="multiple" />
        <Column
          editor={titleEditor}
          field="title"
          filter
          header="Title"
          //   onCellEditComplete={(e: any) => {
          //     if (e.rowData.id && e.newValue)
          //       renameImageMutation.mutate({
          //         id: e.rowData.id,
          //         newName: e.newValue,
          //         project_id: project_id as string,
          //       });
          //   }}
        />
        <Column align="center" body={imageBodyTemplate} field="image" header="Image" />
        <Column
          field="type"
          filter
          filterElement={typeFilterTemplate}
          header="Type"
          style={{
            width: "10%",
          }}
        />
        <Column alignHeader="right" body={actionsBodyTemplate} header="Actions" headerClassName="pr-5" />
      </DataTable>
    </div>
  );
}
