import { SetStateAction } from "jotai";
import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateTag, useGetAllTags, useUpdateAlterNameTag } from "../../CRUD/OtherCRUD";
import { AllItemsType, AvailableItemTypes, TagType } from "../../types/generalTypes";
import { BoardCreateType, DefaultEdgeType, DefaultNodeType, EdgeType, NodeType } from "../../types/ItemTypes/boardTypes";
import { CalendarCreateType } from "../../types/ItemTypes/calendarTypes";
import { DocumentCreateType } from "../../types/ItemTypes/documentTypes";
import { MapCreateType } from "../../types/ItemTypes/mapTypes";

type Props = {
  handleChange: ({ name, value }: { name: string; value: any }) => void;
  isSettings?: boolean;
  localItem:
    | AllItemsType
    | NodeType
    | EdgeType
    | DocumentCreateType
    | MapCreateType
    | BoardCreateType
    | DefaultNodeType
    | DefaultEdgeType
    | Omit<CalendarCreateType, "days">;
  type: AvailableItemTypes | "map_pins" | "nodes" | "edges" | "cards" | "events";
};

function getTagRelationId(
  id: string | undefined,
  type: AvailableItemTypes | "map_pins" | "nodes" | "edges" | "cards" | "events",
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

export default function Tags({ handleChange, localItem, type, isSettings }: Props) {
  const { project_id } = useParams();
  const { data: initialTags } = useGetAllTags(project_id as string);
  const [tags, setTags] = useState(initialTags || []);
  const { mutate: createTag } = useCreateTag(project_id as string);

  const { mutate: updateTag } = useUpdateAlterNameTag(project_id as string, "tag");

  return (
    <AutoComplete
      className="tagsAutocomplete max-h-40 w-full overflow-y-auto border-zinc-600"
      completeMethod={(e) => filterTags(e, initialTags || [], setTags)}
      field="title"
      multiple
      onChange={(e) => setTags(e.value)}
      onKeyPress={(e) => {
        if (isSettings) {
          e.stopPropagation();
          e.preventDefault();
        }
        // For adding completely new tags
        if (e.key === "Enter" && e.currentTarget.value !== "" && e.currentTarget.value !== undefined) {
          const id = crypto.randomUUID();
          handleChange({ name: "tags", value: [...(localItem?.tags || []), { id, title: e?.currentTarget?.value }] });
          if (!isSettings) createTag({ id, title: e.currentTarget.value, ...getTagRelationId(localItem.id, type, "connect") });
          e.currentTarget.value = "";
        }
      }}
      onSelect={(e) => {
        if (isSettings) {
          e.originalEvent.preventDefault();
          e.originalEvent.preventDefault();
        }
        handleChange({ name: "tags", value: [...(localItem?.tags || []), e.value] });
        if (localItem.id) updateTag({ id: e.value.id, ...getTagRelationId(localItem.id, type, "connect") });
      }}
      onUnselect={(e) => {
        if (isSettings) {
          e.originalEvent.stopPropagation();
          e.originalEvent.preventDefault();
        }
        handleChange({
          name: "tags",
          value: [...(localItem?.tags || []).filter((tag) => tag.id !== e.value.id)],
        });
        if (localItem.id) updateTag({ id: e.value.id, ...getTagRelationId(localItem.id, type, "disconnect") });
      }}
      placeholder="Add Tags"
      suggestions={tags}
      value={localItem?.tags}
    />
  );
}
