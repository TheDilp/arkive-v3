import { AutoComplete } from "primereact/autocomplete";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../../custom-types";
import { getTags, updateDocument } from "../../../utils/supabaseUtils";
import { searchCategory, useGetTags } from "../../../utils/utils";

type Props = {
  currentDoc: Document;
  filteredCategories: string[];
  currentProject: Project;
  setCurrentDoc: (doc: Document | null) => void;
  setFilteredCategories: (categories: string[]) => void;
};

export default function CategoryAutocomplete({
  currentDoc,
  filteredCategories,
  setCurrentDoc,
  setFilteredCategories,
}: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  getTags(project_id as string);
  const { data: categories, refetch: refetchAllTags } = useGetTags(
    project_id as string
  );
  const updateCategoriesMutation = useMutation(
    async (vars: { doc_id: string; categories: string[] }) =>
      await updateDocument(
        vars.doc_id,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        vars.categories
      ),
    {
      onMutate: (vars) => {
        let oldCategories = currentDoc.categories;
        let oldDocs = queryClient.getQueryData(`${project_id}-documents`);
        setCurrentDoc({ ...currentDoc, categories: vars.categories });
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === vars.doc_id) {
                  return {
                    ...doc,
                    categories: vars.categories,
                  };
                } else {
                  return doc;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );
        return { oldCategories, oldDocs };
      },
      onError: (e, v, context) => {
        if (context) {
          setCurrentDoc({ ...currentDoc, categories: context.oldCategories });
          queryClient.setQueryData(`${project_id}-documents`, context.oldDocs);
        }
      },
      onSuccess: () => {
        refetchAllTags();
      },
    }
  );
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
          if (!categories.some((cat) => cat === e.value)) {
            setCurrentDoc({
              ...currentDoc,
              categories: [...currentDoc.categories, e.value],
            });
          }
        }
      }}
      onUnselect={(e) => {}}
      onKeyPress={async (e) => {
        if (e.key === "Enter" && e.currentTarget.value !== "") {
          if (!currentDoc.categories.includes(e.currentTarget.value)) {
            updateCategoriesMutation.mutate({
              doc_id: currentDoc.id,
              categories: [...currentDoc.categories, e.currentTarget.value],
            });
          }
          e.currentTarget.value = "";
        }
      }}
    />
  );
}
