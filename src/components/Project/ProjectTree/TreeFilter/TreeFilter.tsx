import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useCreateDocument, useGetTags } from "../../../../utils/customHooks";
import DocumentCreateDialog from "./DocumentCreateDialog";
import { SplitButton } from "primereact/splitbutton";
type Props = {
  filter: string;
  setFilter: (filter: string) => void;
  selectedTags: string[];
  setSelectedTags: (selectedTags: string[]) => void;
};

export default function TreeFilter({
  filter,
  setFilter,
  selectedTags,
  setSelectedTags,
}: Props) {
  const { project_id } = useParams();
  const tags = useGetTags(project_id as string).data;
  const createDocument = useCreateDocument(project_id as string);
  const [createDocumentDialog, setCreateDocumentDialog] = useState(false);
  const items = [
    {
      label: "Create Document",
      icon: "pi pi-fw pi-plus",
      command: () => setCreateDocumentDialog(true),
    },
  ];
  return (
    <div className="pt-2 px-2 w-full">
      <DocumentCreateDialog
        visible={createDocumentDialog}
        setVisible={setCreateDocumentDialog}
      />
      <div className="w-full py-1 flex justify-content-center">
        <SplitButton
          label="Quick Create"
          icon="pi pi-bolt"
          model={items}
          className="p-button-outlined mb-2 w-full"
          onClick={() => {
            let id = uuid();
            createDocument.mutate({
              id,
            });
          }}
        ></SplitButton>
      </div>
      <div className="w-full flex flex-wrap">
        <InputText
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-1"
          placeholder="Filter by Title"
        />
        <MultiSelect
          value={selectedTags}
          options={tags}
          placeholder="Filter by Tags"
          className="w-full p-0"
          showClear={true}
          display="chip"
          onChange={(e) => setSelectedTags(e.value)}
        />
      </div>
    </div>
  );
}
