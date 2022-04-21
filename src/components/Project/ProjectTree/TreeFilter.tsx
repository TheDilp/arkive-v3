import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useParams } from "react-router-dom";
import { useCreateDocument, useGetTags } from "../../../utils/customHooks";
import { auth } from "../../../utils/supabaseUtils";
import { v4 as uuid } from "uuid";
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
  const user = auth.user();
  const createDocument = useCreateDocument(
    project_id as string,
    user?.id as string
  );

  return (
    <div className="pt-2 px-2 w-full">
      <div className="w-full py-1 flex justify-content-between">
        <Button
          label="Quick Create"
          icon={"pi pi-fw pi-bolt"}
          iconPos="right"
          className="p-button-outlined Lato p-2"
          onClick={() => {
            let id = uuid();
            createDocument.mutate({
              id,
            });
          }}
        />
        <Button
          label="New Document"
          icon={"pi pi-fw pi-plus"}
          iconPos="right"
          className="p-button-outlined Lato p-2"
          // onClick={() => createDocument.mutate()}
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
