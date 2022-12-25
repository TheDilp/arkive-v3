import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React from "react";

type Props = {};

const leftToolbarTemplate = () => {
  return (
    <div className="flex gap-x-2">
      <Button
        className="p-button-success p-button-outlined mr-2"
        icon="pi pi-plus"
        label="New"
        onClick={async () => {
          createDocumentMutation.mutate({
            id: uuid(),
            ...DocumentCreateDefault,
            project_id: project_id as string,
          });
        }}
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
const rightToolbarTemplate = () => {
  return (
    <div className="flex gap-x-2">
      <Button
        className="p-button-outlined mr-2"
        icon="pi pi-filter-slash"
        label="Reset"
        onClick={() => {
          // @ts-ignore
          //   ref.current?.reset();
        }}
        tooltip="Resets Filters, Sorting and Pagination"
        type="button"
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          //   value={globalFilter}
          placeholder="Quick Search"
          //   onChange={(e) => {
          //     setGlobalFilter(e.target.value);
          //   }}
        />
      </span>
    </div>
  );
};

export default function SettingsToolbar({}: Props) {
  return <Toolbar className="mb-2 flex justify-between" left={leftToolbarTemplate} right={rightToolbarTemplate} />;
}
