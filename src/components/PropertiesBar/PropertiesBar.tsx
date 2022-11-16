import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUpdateMutation } from "../../CRUD/DocumentCRUD";
import { useGetAllTags } from "../../CRUD/queries";
import { useGetItem } from "../../hooks/getItemHook";

export default function PropertiesBar() {
  const { project_id, item_id } = useParams();
  const currentDocument = useGetItem(project_id as string, item_id as string, "documents");
  const { data: initialTags } = useGetAllTags(project_id as string);

  const [tags, setTags] = useState({ selected: currentDocument?.tags || [], suggestions: initialTags });
  const updateDocumentMutation = useUpdateMutation("documents");

  const filterTags = (e: AutoCompleteCompleteMethodParams) => {
    const { query } = e;
    if (query && initialTags)
      setTags((prev) => ({
        ...prev,
        suggestions: initialTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      }));

    if (!query && initialTags) setTags((prev) => ({ ...prev, suggestions: initialTags }));
  };
  console.log(item_id);
  const handleChange = (value: string) => {
    if (currentDocument && !currentDocument.tags.includes(value)) {
      updateDocumentMutation?.mutate({
        id: currentDocument.id,
        tags: [...currentDocument.tags, value],
      });
    }
  };

  return (
    <span className="p-fluid">
      <AutoComplete
        value={tags.selected}
        suggestions={tags.suggestions}
        completeMethod={filterTags}
        multiple
        onChange={(e) => setTags((prev) => ({ ...prev, selected: e.value }))}
        placeholder="Add Tags"
        onSelect={(e) => handleChange(e.value)}
        onUnselect={(e) => handleChange(e.value)}
        onKeyPress={async (e) => {
          // For adding completely new tags
          if (e.key === "Enter" && e.currentTarget.value !== "") {
            handleChange(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </span>
  );
}
