import { SetStateAction } from "jotai";
import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { EdgeType, NodeType } from "../../types/boardTypes";
import { DocumentCreateType } from "../../types/documentTypes";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";

type Props = {
  handleChange: ({ name, value }: { name: string; value: any }) => void;
  localItem: AllItemsType | NodeType | EdgeType | DocumentCreateType;
  type: AvailableItemTypes | "nodes" | "edges";
};

const handleTagsChange = async (
  tags: string[],
  handleChange: ({ name, value }: { name: string; value: any }) => void,
  value: string,
) => {
  if (!tags?.includes(value)) {
    handleChange({ name: "tags", value: [...(tags || []), value] });
  } else if (tags?.includes(value)) {
    handleChange({ name: "tags", value: (tags || []).filter((tag) => tag !== value) });
  }
};

const filterTags = (
  e: AutoCompleteCompleteMethodParams,
  initialTags: string[],
  setTags: Dispatch<SetStateAction<string[]>>,
) => {
  const { query } = e;
  if (query && initialTags) setTags(initialTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())));

  if (!query && initialTags) setTags(initialTags);
};

export default function Tags({ handleChange, localItem, type }: Props) {
  const { project_id } = useParams();
  const { data: initialTags } = useGetAllTags(project_id as string, type);
  const [tags, setTags] = useState(initialTags || []);
  return (
    <AutoComplete
      className="w-full tagsAutocomplete max-h-40 border-zinc-600"
      completeMethod={(e) => filterTags(e, initialTags || [], setTags)}
      multiple
      onChange={(e) => setTags(e.value)}
      onKeyPress={async (e) => {
        // For adding completely new tags
        if (e.key === "Enter" && e.currentTarget.value !== "") {
          handleTagsChange(localItem?.tags || [], handleChange, e.currentTarget.value);
          e.currentTarget.value = "";
        }
      }}
      onSelect={(e) => handleTagsChange(localItem?.tags || [], handleChange, e.value)}
      onUnselect={(e) => handleTagsChange(localItem?.tags || [], handleChange, e.value)}
      placeholder="Add Tags"
      suggestions={tags}
      value={localItem?.tags}
    />
  );
}
