import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { SplitButton } from "primereact/splitbutton";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useCreateDocument, useGetTags } from "../../../../utils/customHooks";
import DocumentFromTempDialog from "./DocumentFromTempDialog";
import DocumentCreateDialog from "./DocumentCreateDialog";
type Props = {
  filter: string;
  setFilter: (filter: string) => void;
  selectedTags: string[];
  setSelectedTags: (selectedTags: string[]) => void;
};

export default function DocTreeFilter({
  filter,
  setFilter,
  selectedTags,
  setSelectedTags,
}: Props) {
  const { project_id } = useParams();
  const tags = useGetTags(project_id as string).data;
  const createDocumentMutation = useCreateDocument(project_id as string);
  const [createDocumentDialog, setCreateDocumentDialog] = useState(false);
  const [docFromTempDialog, setDocFromTempDialog] = useState(false);
  const items = [
    {
      label: "Create Document / Folder",
      icon: "pi pi-fw pi-plus",
      command: () => setCreateDocumentDialog(true),
    },

    {
      label: "Create from template",
      icon: "pi pi-fw pi-copy",
      command: () => setDocFromTempDialog(true),
    },
  ];
  return (
    <div className="pt-2 px-2 w-full">
      <DocumentCreateDialog
        visible={createDocumentDialog}
        setVisible={setCreateDocumentDialog}
      />
      <DocumentFromTempDialog
        visible={docFromTempDialog}
        setVisible={setDocFromTempDialog}
      />
      <div className="w-full py-1 flex justify-content-center">
        <SplitButton
          label="Quick Create"
          icon="pi pi-bolt"
          model={items}
          className="p-button-outlined mb-2 w-full"
          onClick={() => {
            let id = uuid();
            createDocumentMutation.mutate({
              id,
            });
          }}
        />
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
          options={tags.map((tag) => ({ label: tag, value: tag }))}
          placeholder="Filter by Tags"
          className="w-full p-0"
          showClear={true}
          display="chip"
          filter
          filterBy="label"
          onChange={(e) => {
            if (e.value === null) {
              setSelectedTags([]);
            } else {
              setSelectedTags(e.value);
            }
          }}
        />
      </div>
    </div>
  );
}
