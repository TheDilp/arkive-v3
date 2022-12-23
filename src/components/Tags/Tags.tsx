import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { DocumentCreateType } from "../../types/documentTypes";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";

type Props = {
  item: AllItemsType | DocumentCreateType | undefined;
  setLocalItem: Dispatch<SetStateAction<AllItemsType | DocumentCreateType>>;
  localItem: AllItemsType | DocumentCreateType;
  updateMutation: any;
  type: AvailableItemTypes;
};

const handleTagsChange = async (
  queryClient: QueryClient,
  tags: string[],
  setLocalItem: Dispatch<SetStateAction<AllItemsType | DocumentCreateType>>,
  value: string,
  item: AllItemsType | DocumentCreateType | undefined,
  updateMutation: any,
  project_id: string,
) => {
  // Create
  if (!item && !tags?.includes(value)) {
    setLocalItem((prev) => ({ ...prev, tags: [...(tags || []), value] }));
  } else if (!item && tags?.includes(value)) {
    setLocalItem((prev) => ({ ...prev, tags: (tags || []).filter((tag) => tag !== value) }));
  }

  //   Update
  if (item && !tags?.includes(value)) {
    await updateMutation?.mutateAsync({
      id: item.id,
      tags: [...(item.tags || []), value],
    });
  } else if (item && item?.tags?.includes(value)) {
    await updateMutation?.mutateAsync({
      id: item.id,
      tags: item.tags.filter((tag) => tag !== value),
    });
  }
  queryClient.refetchQueries({ queryKey: ["allTags", project_id, "documents"] });
};

const filterTags = (
  e: AutoCompleteCompleteMethodParams,
  initialTags: string[],
  setTags: Dispatch<SetStateAction<{ selected: string[]; suggestions: string[] | undefined }>>,
) => {
  const { query } = e;
  if (query && initialTags)
    setTags((prev) => ({
      ...prev,
      suggestions: initialTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    }));

  if (!query && initialTags) setTags((prev) => ({ ...prev, suggestions: initialTags }));
};

export default function Tags({ setLocalItem, localItem, updateMutation, type, item }: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const { data: initialTags } = useGetAllTags(project_id as string, type);
  const [tags, setTags] = useState({ selected: localItem?.tags || [], suggestions: initialTags });

  return (
    <AutoComplete
      className="mapTagsAutocomplete max-h-40 w-full border-zinc-600"
      completeMethod={(e) => filterTags(e, initialTags || [], setTags)}
      multiple
      onChange={(e) => setTags((prev) => ({ ...prev, selected: e.value }))}
      onKeyPress={async (e) => {
        // For adding completely new tags
        if (e.key === "Enter" && e.currentTarget.value !== "") {
          handleTagsChange(
            queryClient,
            tags.selected,
            setLocalItem,
            e.currentTarget.value,
            item,
            updateMutation,
            project_id as string,
          );
          e.currentTarget.value = "";
        }
      }}
      onSelect={(e) =>
        handleTagsChange(queryClient, tags.selected, setLocalItem, e.value, localItem, updateMutation, project_id as string)
      }
      onUnselect={(e) =>
        handleTagsChange(queryClient, tags.selected, setLocalItem, e.value, localItem, updateMutation, project_id as string)
      }
      placeholder="Add Tags"
      suggestions={tags.suggestions}
      value={localItem?.tags}
    />
  );
}
