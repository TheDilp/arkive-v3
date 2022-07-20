import React, { useState } from "react";
import { Chips } from "primereact/chips";
import { useUpdateDocument } from "../../../utils/customHooks";
import { useParams } from "react-router-dom";
type Props = {
  alter_names: string[];
};

export default function AlterNamesAutocomplete({ alter_names }: Props) {
  const { project_id, doc_id } = useParams();
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const [temp, setTemp] = useState();
  return (
    <Chips
      value={alter_names}
      allowDuplicate={false}
      className="w-full alterNamesChips"
      placeholder="Alternative names"
      onChange={(e) => {
        updateDocumentMutation.mutate({
          id: doc_id as string,
          alter_names: e.value,
        });
      }}
    />
  );
}
