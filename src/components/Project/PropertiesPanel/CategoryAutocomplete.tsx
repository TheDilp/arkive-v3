import { AutoComplete } from "primereact/autocomplete";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../../custom-types";
import { updateDocument } from "../../../utils/supabaseUtils";
import { searchCategory } from "../../../utils/utils";

type Props = {
  currentDoc: Document;
  categories: string[] | undefined;
  refetchAllTags: any;
  filteredCategories: string[];
  currentProject: Project;
  setCurrentDoc: (doc: Document | null) => void;
  setFilteredCategories: (categories: string[]) => void;
};

export default function CategoryAutocomplete({
  currentDoc,
  categories,
  refetchAllTags,
  filteredCategories,
  setCurrentDoc,
  setFilteredCategories,
}: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();

  const updateCategoriesMutation = useMutation(
    async (vars: { doc_id: string; categories: string[] }) =>
      await updateDocument({
        doc_id: vars.doc_id,
        categories: vars.categories,
      }),
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
      onSelect={(e) => {
        if (!currentDoc.categories.includes(e.value)) {
          updateCategoriesMutation.mutate({
            doc_id: currentDoc.id,
            categories: [...currentDoc.categories, e.value],
          });
        }
      }}
      onUnselect={(e) => {
        if (currentDoc.categories.includes(e.value)) {
          updateCategoriesMutation.mutate({
            doc_id: currentDoc.id,
            categories: currentDoc.categories.filter(
              (category) => category !== e.value
            ),
          });
        }
      }}
      onKeyPress={async (e) => {
        // For adding completely new tags
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
