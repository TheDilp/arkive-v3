import { SetStateAction } from "jotai";
import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateTag, useGetAllTags, useUpdateTag } from "../../CRUD/OtherCRUD";
import { BoardCreateType, DefaultEdgeType, DefaultNodeType, EdgeType, NodeType } from "../../types/boardTypes";
import { DocumentCreateType } from "../../types/documentTypes";
import { AllItemsType, AvailableItemTypes, TagType } from "../../types/generalTypes";
import { MapCreateType } from "../../types/mapTypes";

type Props = {
  handleChange: ({ name, value }: { name: string; value: any }) => void;
  localItem:
    | AllItemsType
    | NodeType
    | EdgeType
    | DocumentCreateType
    | MapCreateType
    | BoardCreateType
    | DefaultNodeType
    | DefaultEdgeType;
  type: AvailableItemTypes | "map_pins" | "nodes" | "edges";
};

function getTagRelationId(
  id: string | undefined,
  type: AvailableItemTypes | "map_pins" | "nodes" | "edges",
  updateType: "connect" | "disconnect",
) {
  if (!id) return {};
  return {
    [type]: {
      [updateType]: { id },
    },
  };
}

const filterTags = (
  e: AutoCompleteCompleteMethodParams,
  initialTags: TagType[],
  setTags: Dispatch<SetStateAction<TagType[]>>,
) => {
  const { query } = e;
  if (query && initialTags) setTags(initialTags.filter((tag) => tag.title.toLowerCase().includes(query.toLowerCase())));

  if (!query && initialTags) setTags(initialTags);
};

export default function Tags({ handleChange, localItem, type }: Props) {
  const { project_id } = useParams();
  const { data: initialTags } = useGetAllTags(project_id as string);
  const [tags, setTags] = useState(initialTags || []);
  const { mutate } = useCreateTag(project_id as string);

  const { mutate: updateTag } = useUpdateTag();

  // const handleTagsChange = async (allTags: TagType[] | undefined, value: TagType | string) => {
  //   if (!allTags?.some((tag) => tag.title.includes("title" in value ? value?.title : value))) {
  //     mutateAsync(
  //       { title: value.title, ...getTagRelationId(localItem.id, type) },
  //       {
  //         onSuccess: () => {
  //           handleChange({ name: "tags", value: [...(localItem?.tags || []), value] });
  //         },
  //       },
  //     );
  //   } else if (localItem?.tags?.includes(value)) {
  //     handleChange({ name: "tags", value: (localItem?.tags || []).filter((tag) => tag.title !== value) });
  //   } else {
  //     updateTag({ id: value });
  //     handleChange({ name: "tags", value: [...(localItem?.tags || []), value] });
  //   }
  // };

  return (
    <AutoComplete
      className="tagsAutocomplete max-h-40 w-full border-zinc-600"
      completeMethod={(e) => filterTags(e, initialTags || [], setTags)}
      field="title"
      multiple
      onChange={(e) => setTags(e.value)}
      onKeyPress={(e) => {
        // For adding completely new tags
        if (e.key === "Enter" && e.currentTarget.value !== "" && e.currentTarget.value !== undefined) {
          handleChange({ name: "tags", value: [...(localItem?.tags || []), e?.currentTarget?.value] });
          mutate({ title: e.currentTarget.value, ...getTagRelationId(localItem.id, type, "connect") });
          e.currentTarget.value = "";
        }
      }}
      onSelect={(e) => {
        updateTag({ id: e.value.id, ...getTagRelationId(localItem.id, type, "connect") });
        handleChange({ name: "tags", value: [...(localItem?.tags || []), e.value] });
      }}
      onUnselect={(e) => {
        updateTag({ id: e.value.id, ...getTagRelationId(localItem.id, type, "disconnect") });
        handleChange({
          name: "tags",
          value: [...(localItem?.tags || []).filter((tag) => tag.id !== e.value.id)],
        });
      }}
      placeholder="Add Tags"
      suggestions={tags}
      value={localItem?.tags}
    />
  );
}
