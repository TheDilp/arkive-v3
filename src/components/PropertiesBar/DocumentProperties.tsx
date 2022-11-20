import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Chips } from "primereact/chips";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUpdateMutation } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/queries";
import { useGetItem } from "../../hooks/getItemHook";
import { Checkbox } from "primereact/checkbox";

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

  const handlePublicChange = (checked: boolean) => {
    if (currentDocument)
      updateDocumentMutation?.mutate({
        id: currentDocument.id as string,
        public: checked,
      });
  };

  return (
    <span className="overflow-hidden p-fluid propertiesBar">
      <Chips
        value={currentDocument?.alter_names}
        allowDuplicate={false}
        className="w-full max-w-full box-border border-b border-l border-zinc-600 max-h-40 alterNamesChips"
        placeholder="Alternative names (5 max)"
        max={5}
        onChange={(e) => {
          const { value } = e;
          handleAlterNamesChange(value);
        }}
      />
      <AutoComplete
        className="border-t max-h-40 border-zinc-600 documentTagsAutocomplete"
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
      <Accordion>
        <AccordionTab header="Options">
          {!currentDocument?.template ? (
            <div className="w-full flex items-center justify-between flex-nowrap">
              <label className="mx-2">Public:</label>
              <Checkbox
                checked={currentDocument?.public}
                tooltip="If checked, anyone can access the content via a public page"
                tooltipOptions={{ position: "left", showDelay: 500 }}
                onChange={(e) => handlePublicChange(e.checked)}
              />
            </div>
          ) : null}
        </AccordionTab>
      </Accordion>
    </span>
  );
}
