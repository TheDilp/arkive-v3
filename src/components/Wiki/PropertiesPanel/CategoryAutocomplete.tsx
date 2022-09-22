import { AutoComplete } from "primereact/autocomplete";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { DocumentProps, ProjectProps } from "../../../custom-types";
import { useGetTags } from "../../../utils/customHooks";
import { updateDocument } from "../../../utils/supabaseUtils";
import { searchCategory } from "../../../utils/utils";

type Props = {
  currentDoc: DocumentProps;
};

export default function CategoryAutocomplete({ currentDoc }: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const updateCategoriesMutation = useMutation(
    async (vars: { doc_id: string; categories: string[] }) =>
      await updateDocument({
        id: vars.doc_id,
        categories: vars.categories,
      }),
    {
      onMutate: (vars) => {
        let oldCategories = currentDoc.categories;
        let oldDocs = queryClient.getQueryData(`${project_id}-documents`);
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: DocumentProps[] | undefined) => {
            if (oldData) {
              let newData: DocumentProps[] = oldData.map((doc) => {
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
          queryClient.setQueryData(`${project_id}-documents`, context.oldDocs);
        }
      },
      onSuccess: () => {
        refetchAllTags();
      },
    }
  );
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const { data: categories, refetch: refetchAllTags } = useGetTags(
    project_id as string
  );
  useEffect(() => {
    if (categories.length > 0) {
      setFilteredCategories(categories);
    }
  }, [categories]);
  return (
    <AutoComplete
      inputClassName="Lato border-noround"
      value={currentDoc.categories}
      suggestions={filteredCategories}
      placeholder={
        currentDoc.categories.length > 0 ? "" : "Enter tags for this document"
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
