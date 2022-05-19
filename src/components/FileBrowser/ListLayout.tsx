import { Button } from "primereact/button";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useParams } from "react-router-dom";
import { ImageProps } from "../../custom-types";
import { useRenameImage } from "../../utils/customHooks";
type Props = {
  images: ImageProps[];
  filter: string;
};

export default function ListLayout({ images, filter }: Props) {
  const { project_id } = useParams();
  const renameImageMutation = useRenameImage();
  const actionsBodyTemplate = (rowData: ImageProps) => {
    return (
      <div className="">
        <Button
          label="Delete"
          className="p-button-danger p-button-outlined"
          icon="pi pi-fw pi-trash"
          iconPos="right"
          onClick={() => {}}
        />
      </div>
    );
  };
  const imageBodyTemplate = (rowData: ImageProps) => {
    return (
      <div className="w-full h-auto cursor-pointer flex justify-content-center">
        {rowData.link && (
          <img
            src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${rowData.link}`}
            alt="document"
            className="w-3rem h-full relative border-round"
            style={{
              objectFit: "cover",
            }}
            loading="lazy"
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
          console.log(options.rowData, e.target.value);
          if (options.rowData.id && e.target.value)
            //@ts-ignore
            options.editorCallback(e.target.value);
        }}
      />
    );
  };
  return (
    <div className=" flex align-items-start align-content-top w-full  justify-content-center">
      <DataTable
        className="w-full h-full"
        value={images.filter((image) => image.title.includes(filter))}
        paginator
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        rows={9}
        sortField="title"
        sortOrder={1}
        rowsPerPageOptions={[10, 20, 50]}
        // paginatorLeft={paginatorLeft}
        // paginatorRight={paginatorRight}
      >
        <Column selectionMode="multiple"></Column>
        <Column
          field="title"
          header="Title"
          style={{ width: "" }}
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
