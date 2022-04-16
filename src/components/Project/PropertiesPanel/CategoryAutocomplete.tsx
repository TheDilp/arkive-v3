import { AutoComplete } from "primereact/autocomplete";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Category, Document, Project } from "../../../custom-types";
import { createCategory } from "../../../utils/supabaseUtils";
import {
  searchCategory,
  toastError,
  toastWarn,
  useCreateCategory,
} from "../../../utils/utils";

type Props = {
  currentDoc: Document;
  filteredCategories: Category[];
  currentProject: Project;
  setCurrentDoc: (doc: Document | null) => void;
  setFilteredCategories: (categories: Category[]) => void;
};

export default function CategoryAutocomplete({
  currentDoc,
  filteredCategories,
  setCurrentDoc,
  setFilteredCategories,
}: Props) {
  const queryClient = useQueryClient();
  const categories: Category[] | undefined =
    queryClient.getQueryData("getCategories");
  const createCategory = useCreateCategory();

  return (
    <AutoComplete
      value={currentDoc.categories}
      suggestions={filteredCategories}
      placeholder={
        currentDoc.categories ? "" : "Enter tags for this document..."
      }
      completeMethod={(e) =>
        searchCategory(e, categories || [], setFilteredCategories)
      }
      multiple
      field="tag"
      onSelect={(e) => {
        if (categories) {
          if (!categories.some((cat) => cat.tag === e.value)) {
            createCategory.mutate({ doc_id: currentDoc.id, tag: e.value.tag });
          }
        }
      }}
      onKeyPress={async (e) => {
        if (e.key === "Enter" && e.currentTarget.value !== "") {
          console.log(e.currentTarget.value);
          createCategory.mutate({
            doc_id: currentDoc.id,
            tag: e.currentTarget.value,
          });
          e.currentTarget.value = "";
        }
      }}
    />
  );
}
