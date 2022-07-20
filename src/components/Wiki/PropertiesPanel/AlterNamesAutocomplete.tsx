import { Chips } from "primereact/chips";
import { useParams } from "react-router-dom";
import { useUpdateDocument } from "../../../utils/customHooks";
type Props = {
  alter_names: string[];
};

export default function AlterNamesAutocomplete({ alter_names }: Props) {
  const { project_id, doc_id } = useParams();
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  return (
    <Chips
      value={alter_names}
      allowDuplicate={false}
      className="w-full alterNamesChips"
      placeholder="Alternative names (5 max)"
      max={5}
      onChange={(e) => {
        updateDocumentMutation.mutate({
          id: doc_id as string,
          alter_names: e.value,
        });
      }}
    />
  );
}
