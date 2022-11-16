import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Chips } from "primereact/chips";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUpdateMutation } from "../../CRUD/DocumentCRUD";
import { useGetAllTags } from "../../CRUD/queries";
import { useGetItem } from "../../hooks/getItemHook";

export default function TagsAutocomplete() {
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
  const handleTagsChange = (value: string) => {
    if (currentDocument && !currentDocument.tags.includes(value)) {
      updateDocumentMutation?.mutate({
        id: currentDocument.id,
        tags: [...currentDocument.tags, value],
      });
    }
  };
  const handleAlterNamesChange = (value: string[]) => {
    if (currentDocument) {
      updateDocumentMutation?.mutate({
        alter_names: value,
        id: currentDocument.id,
      });
    }
  };

  return (
    <span className="overflow-hidden p-fluid propertiesBar">
      <Chips
        value={currentDocument?.alter_names}
        allowDuplicate={false}
        className="w-full max-w-full overflow-x-scroll max-h-40 alterNamesChips"
        placeholder="Alternative names (5 max)"
        max={5}
        onChange={(e) => {
          const { value } = e;
          handleAlterNamesChange(value);
        }}
      />
      <AutoComplete
        className="max-h-40 documentTagsAutocomplete"
        value={currentDocument?.tags}
        suggestions={tags.suggestions}
        completeMethod={filterTags}
        multiple
        onChange={(e) => setTags((prev) => ({ ...prev, selected: e.value }))}
        placeholder="Add Tags"
        onSelect={(e) => handleTagsChange(e.value)}
        onUnselect={(e) => handleTagsChange(e.value)}
        onKeyPress={async (e) => {
          // For adding completely new tags
          if (e.key === "Enter" && e.currentTarget.value !== "") {
            handleTagsChange(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </span>
  );
}
