import { Button } from "primereact/button";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useParams } from "react-router-dom";
import { ImageProps } from "../../custom-types";
import { useDeleteImages, useRenameImage } from "../../utils/customHooks";
import { Image } from "primereact/image";
import { downloadImage } from "../../utils/supabaseUtils";
import { saveAs } from "file-saver";
import { useContext } from "react";
import { FileBrowserContext } from "../Context/FileBrowserContext";
import { SplitButton } from "primereact/splitbutton";
import { SelectButton } from "primereact/selectbutton";
type Props = {
  images: ImageProps[];
};

export default function ListLayout({ images }: Props) {
  const { project_id } = useParams();
  const renameImageMutation = useRenameImage();
  const deleteImagesMutation = useDeleteImages(project_id as string);
  const { filter, selected, setSelected, tableRef } =
    useContext(FileBrowserContext);
  const actionsBodyTemplate = (rowData: ImageProps) => {
    return (
      <div className="">
        <Button
          className="p-button-primary p-button-outlined mr-2"
          icon="pi pi-fw pi-download"
          iconPos="right"
          onClick={async () => {
            const d = await downloadImage(rowData.link);
            if (d) {
              saveAs(
                new Blob([d], {
                  type: d.type,
                }),
                `${rowData.title || rowData.id || project_id + "-image"}`
              );
            }
          }}
        />
        <Button
          className="p-button-outlined text-red-400"
          icon="pi pi-fw pi-trash"
          iconPos="right"
          onClick={() => deleteImagesMutation.mutate([rowData.link])}
        />
      </div>
    );
  };
  const imageBodyTemplate = (rowData: ImageProps) => {
    return (
      <div className="w-full h-auto cursor-pointer w-full flex justify-content-center">
        {rowData.link && (
          <Image
            src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${rowData.link}`}
            alt="document"
            className="w-2rem h-full relative border-round"
            preview
            imageClassName="w-full h-full"
          />
        )}
      </div>
    );
  };
  const titleEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => {
          if (options.rowData.id && e.target.value)
            //@ts-ignore
            options.editorCallback(e.target.value);
        }}
      />
    );
  };
  const typeFilterTemplate = (options: any) => {
    return (
      <SelectButton
        value={options.value}
        options={["Image", "Map"]}
        className="p-button-outlined mb-2 w-full"
        onChange={(e) => {
          options.filterCallback(e.value);
        }}
      />
    );
  };
  return (
    <div className=" flex align-items-start align-content-top w-full  justify-content-center">
      <DataTable
        ref={tableRef}
        className="w-full h-full"
        value={images.filter((image) => image.title.includes(filter))}
        paginator
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        rows={9}
        sortField="title"
        sortOrder={1}
        rowsPerPageOptions={[9, 15, 25, 50]}
        selection={selected}
        onSelectionChange={(e) => {
          setSelected(e.value);
          // setSelectAll(value.length === documents.data?.length);
        }}
      >
        <Column selectionMode="multiple" className="w-1rem"></Column>
        <Column
          field="title"
          header="Title"
          filter
          style={{ width: "10rem" }}
          editor={titleEditor}
          onCellEditComplete={(e: any) => {
            if (e.rowData.id && e.newValue)
              renameImageMutation.mutate({
                id: e.rowData.id,
                newName: e.newValue,
                project_id: project_id as string,
              });
          }}
        ></Column>
        <Column
          field="image"
          header="Image"
          body={imageBodyTemplate}
          // editor={imageEditor}
          align="center"
          // onCellEditComplete={(e: any) => {
          //   if (e.rowData.id && e.newValue)
          //     updateDocumentMutation.mutate({
          //       doc_id: e.rowData.id,
          //       image: e.newValue,
          //     });
          // }}
        ></Column>
        <Column
          field="type"
          header="Type"
          filter
          filterElement={typeFilterTemplate}
        />
        <Column
          header="Actions"
          body={actionsBodyTemplate}
          style={{
            width: "11rem",
          }}
        />
      </DataTable>
    </div>
  );
}
