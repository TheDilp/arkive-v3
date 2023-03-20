import { SetStateAction } from "jotai";
import { AutoComplete, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteSubItem } from "../../CRUD/ItemsCRUD";
import { AlterNameCreateType, AlterNameType, DocumentCreateType } from "../../types/ItemTypes/documentTypes";

type Props = {
  handleChange: ({ name, value }: { name: string; value: any }) => void;
  isSettings?: boolean;
  localItem: DocumentCreateType;
  parentId: string;
};

function getAlterNameRelationId(id: string | undefined, updateType: "connect" | "disconnect") {
  if (!id) return {};
  return {
    documents: {
      [updateType]: { id },
    },
  };
}

const filterTags = (
  e: AutoCompleteCompleteMethodParams,
  initialTags: AlterNameType[],
  setAlterNames: Dispatch<SetStateAction<AlterNameType[]>>,
) => {
  const { query } = e;
  if (query && initialTags) setAlterNames(initialTags.filter((tag) => tag.title.toLowerCase().includes(query.toLowerCase())));

  if (!query && initialTags) setAlterNames(initialTags);
};

export default function AlterNames({ handleChange, localItem, parentId, isSettings }: Props) {
  const { project_id } = useParams();
  const [alterNames, setAlterNames] = useState(localItem?.alter_names || []);
  const { mutate: createAlterName } = useCreateSubItem<AlterNameCreateType>(project_id as string, "alter_names", "documents");
  const { mutate: deleteAlterName } = useDeleteSubItem(parentId, "alter_names", "documents");

  return (
    <AutoComplete
      className="tagsAutocomplete max-h-40 w-full overflow-y-auto border-zinc-600"
      completeMethod={(e) => filterTags(e, localItem?.alter_names || [], setAlterNames)}
      field="title"
      multiple
      onChange={(e) => setAlterNames(e.value)}
      onKeyPress={(e) => {
        if (isSettings) {
          e.stopPropagation();
          e.preventDefault();
        }
        // For adding completely new alter_names
        if (e.key === "Enter" && e.currentTarget.value !== "" && e.currentTarget.value !== undefined) {
          const id = crypto.randomUUID();
          handleChange({ name: "alternames", value: [...(localItem?.tags || []), { id, title: e?.currentTarget?.value }] });
          if (!isSettings)
            createAlterName({
              id,
              title: e.currentTarget.value,
              parentId,
              project_id,
              ...getAlterNameRelationId(localItem.id, "connect"),
            });
          e.currentTarget.value = "";
        }
      }}
      onUnselect={(e) => {
        if (isSettings) {
          e.originalEvent.stopPropagation();
          e.originalEvent.preventDefault();
        }
        handleChange({
          name: "alternames",
          value: [...(localItem?.alter_names || []).filter((tag) => tag.id !== e.value.id)],
        });
        if (localItem.id) deleteAlterName(e.value.id);
      }}
      placeholder="Add alternative names"
      suggestions={alterNames}
      value={localItem?.alter_names}
    />
  );
}
