import { useQueryClient } from "@tanstack/react-query";
import { Accordion, AccordionTab } from "primereact/accordion";
import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Checkbox } from "primereact/checkbox";
import { Chips } from "primereact/chips";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { useGetItem } from "../../hooks/getItemHook";
import { DocumentType } from "../../types/documentTypes";

export default function DocumentProperties() {
  const { project_id, item_id } = useParams();
  const currentDocument = useGetItem(project_id as string, item_id as string, "documents") as DocumentType;
  const { data: initialTags } = useGetAllTags(project_id as string, "documents");
  const queryClient = useQueryClient();
  const [tags, setTags] = useState({ selected: currentDocument?.tags || [], suggestions: initialTags });
  const updateDocumentMutation = useUpdateItem("documents");

  const filterTags = (e: AutoCompleteCompleteMethodParams) => {
    const { query } = e;
    if (query && initialTags)
      setTags((prev) => ({
        ...prev,
        suggestions: initialTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      }));

    if (!query && initialTags) setTags((prev) => ({ ...prev, suggestions: initialTags }));
  };
  const handleTagsChange = async (value: string) => {
    if (currentDocument && !currentDocument.tags.includes(value)) {
      await updateDocumentMutation?.mutateAsync({
        id: currentDocument.id,
        tags: [...currentDocument.tags, value],
      });
    } else if (currentDocument.tags.includes(value)) {
      await updateDocumentMutation?.mutateAsync({
        id: currentDocument.id,
        tags: currentDocument.tags.filter((tag) => tag !== value),
      });
    }
    await queryClient.refetchQueries({ queryKey: ["allTags", project_id, "documents"] });
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
    <span className="p-fluid propertiesBar overflow-hidden">
      <Chips
        allowDuplicate={false}
        className="alterNamesChips box-border max-h-40 min-h-[48px] w-full max-w-full border-l border-zinc-600"
        max={5}
        onChange={(e) => {
          const { value } = e;
          handleAlterNamesChange(value);
        }}
        placeholder="Alternative names (5 max)"
        value={currentDocument?.alter_names}
      />
      <AutoComplete
        className="documentTagsAutocomplete max-h-40 border-zinc-600"
        completeMethod={filterTags}
        multiple
        onChange={(e) => setTags((prev) => ({ ...prev, selected: e.value }))}
        onKeyPress={async (e) => {
          // For adding completely new tags
          if (e.key === "Enter" && e.currentTarget.value !== "") {
            handleTagsChange(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
        onSelect={(e) => handleTagsChange(e.value)}
        onUnselect={(e) => handleTagsChange(e.value)}
        placeholder="Add Tags"
        suggestions={tags.suggestions}
        value={currentDocument?.tags}
      />
      <Accordion>
        <AccordionTab header="Options">
          {!currentDocument?.template ? (
            <div className="flex w-full flex-nowrap items-center justify-between">
              <span className="mx-2">Public:</span>
              <Checkbox
                checked={currentDocument?.public}
                onChange={(e) => handlePublicChange(e.checked)}
                tooltip="If checked, anyone can access the content via a public page"
                tooltipOptions={{ position: "left", showDelay: 500 }}
              />
            </div>
          ) : null}
        </AccordionTab>
      </Accordion>
    </span>
  );
}
