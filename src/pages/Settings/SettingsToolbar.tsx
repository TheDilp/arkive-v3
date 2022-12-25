import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";

type Props = {
  type: AvailableItemTypes;
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
        onClick={() => {
          console.log(project_id);

          createItem({
            title: "New Document",
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

export default function SettingsToolbar({ type }: Props) {
  const { project_id } = useParams();
  const { mutate } = useCreateItem(type);
  return (
    <Toolbar
      className="mb-2 flex justify-between"
      left={() => leftToolbarTemplate(mutate, project_id as string)}
      right={rightToolbarTemplate}
    />
  );
}
