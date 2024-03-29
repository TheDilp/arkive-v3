import { SetStateAction } from "jotai";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Dispatch, MutableRefObject, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateTag, useGetAllTags } from "../../CRUD/OtherCRUD";
import { AllItemsType, AvailableItemTypes, TagType } from "../../types/generalTypes";
import { BoardCreateType, DefaultEdgeType, DefaultNodeType, EdgeType, NodeType } from "../../types/ItemTypes/boardTypes";
import { CalendarCreateType } from "../../types/ItemTypes/calendarTypes";
import { DocumentCreateType } from "../../types/ItemTypes/documentTypes";
import { MapCreateType } from "../../types/ItemTypes/mapTypes";
import { toaster } from "../../utils/toast";

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

const filterTags = (e: AutoCompleteCompleteEvent, initialTags: TagType[], setTags: Dispatch<SetStateAction<TagType[]>>) => {
  const { query } = e;
  if (query && initialTags) setTags(initialTags.filter((tag) => tag.title.toLowerCase().includes(query.toLowerCase())));

  if (!query && initialTags) setTags(initialTags);
};

export default function Tags({ handleChange, localItem, type, isSettings }: Props) {
  const { project_id } = useParams();
  const { data: initialTags } = useGetAllTags(project_id as string);
  const [tags, setTags] = useState(initialTags || []);
  const { mutate: createTag } = useCreateTag(project_id as string);
  const autocompleteRef = useRef() as MutableRefObject<any>;

  return (
    <AutoComplete
      ref={autocompleteRef}
      className="tagsAutocomplete max-h-40 w-full overflow-y-auto border-zinc-600"
      completeMethod={(e) => filterTags(e, initialTags || [], setTags)}
      field="title"
      multiple
      onChange={(e) => setTags(e.value)}
      onClick={() => autocompleteRef?.current?.show()}
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
        const selectedIds = (localItem?.tags || []).map((t) => t?.id);
        if (selectedIds.includes(e.value.id)) {
          toaster("warning", "Cannot have duplicate tags.");
          return;
        }
        handleChange({ name: "tags", value: [...(localItem?.tags || []), e.value] });
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
      }}
      placeholder="Add Tags"
      suggestions={tags}
      value={localItem?.tags}
    />
  );
}
