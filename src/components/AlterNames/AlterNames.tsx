import { AutoComplete } from "primereact/autocomplete";
import { useParams } from "react-router-dom";

import { useCreateSubItem, useDeleteSubItem } from "../../CRUD/ItemsCRUD";
import { AlterNameCreateType, DocumentCreateType } from "../../types/ItemTypes/documentTypes";

type Props = {
  handleChange: ({ name, value }: { name: string; value: any }) => void;
  isSettings?: boolean;
  localItem: DocumentCreateType;
};

function getAlterNameRelationId(id: string | undefined, updateType: "connect" | "disconnect") {
  if (!id) return {};
  return {
    documents: {
      [updateType]: { id },
    },
  };
}

export default function AlterNames({ handleChange, localItem, isSettings }: Props) {
  const { project_id } = useParams();
  const { mutate: createAlterName } = useCreateSubItem<AlterNameCreateType>(project_id as string, "alter_names", "documents");
  const { mutate: deleteAlterName } = useDeleteSubItem(localItem.id as string, "alter_names", "documents");
  return (
    <AutoComplete
      className="alterNamesChips max-h-40 w-full overflow-y-auto border-zinc-600"
      field="title"
      multiple
      onKeyPress={(e) => {
        if (isSettings) {
          e.stopPropagation();
          e.preventDefault();
        }
        // For adding completely new alter_names
        if (e.key === "Enter" && e.currentTarget.value !== "" && e.currentTarget.value !== undefined) {
          const id = crypto.randomUUID();
          handleChange({
            name: "alter_names",
            value: [...(localItem?.alter_names || []), { id, title: e?.currentTarget?.value }],
          });
          if (!isSettings)
            createAlterName({
              id,
              title: e.currentTarget.value,
              parentId: localItem.id,
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
          name: "alter_names",
          value: [...(localItem?.alter_names || []).filter((tag) => tag.id !== e.value.id)],
        });
        if (localItem.id) deleteAlterName(e.value.id);
      }}
      placeholder="Add alternative names"
      suggestions={[]}
      value={localItem?.alter_names}
    />
  );
}
