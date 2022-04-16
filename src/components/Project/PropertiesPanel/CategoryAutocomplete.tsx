import { AutoComplete } from "primereact/autocomplete";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Category, Document, Project } from "../../../custom-types";
import { createCategory } from "../../../utils/supabaseUtils";
import { searchCategory, toastError, toastWarn } from "../../../utils/utils";

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
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const categories: Category[] | undefined =
    queryClient.getQueryData("getCategories");
  const categoriesMutation = useMutation(
    async (vars: { doc_id: string; categories: string[] }) =>
      await createCategory(vars.doc_id, undefined, undefined, vars.categories),
    {
      onMutate: async (updatedDocument) => {
        await queryClient.cancelQueries(`${project_id}-documents`);

        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        setCurrentDoc({
          ...currentDoc,
          categories: updatedDocument.categories,
        });
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              return oldData.map((document: Document) => {
                if (document.id === updatedDocument.doc_id) {
                  return {
                    ...document,
                    categories: updatedDocument.categories,
                  };
                } else {
                  return document;
                }
              });
            } else {
              return [];
            }
          }
        );

        return { previousDocuments };
      },
      onSuccess: async (data, vars) => {
        // let projectData: Project = queryClient.getQueryData(
        //   `${project_id}-project`
        // ) as Project;
        // if (projectData) {
        //   // Filter out any categories that are not already present in the global project categories
        //   let difference: string[] = [];
        //   if (projectData.categories) {
        //     difference = vars.categories.filter(
        //       (cat) => !projectData.categories.includes(cat)
        //     );
        //   }
        //   // Only update if there is a new category not present in the project categories
        //   if (difference.length > 0 || !projectData.categories) {
        //     const updatedProject = await updateProject(
        //       project_id as string,
        //       undefined,
        //       projectData.categories
        //         ? projectData.categories.concat(difference)
        //         : difference
        //     );
        //     if (updatedProject) {
        //       queryClient.setQueryData(
        //         `${project_id}-project`,
        //         (oldData: Project | undefined) => {
        //           let newData: any = {
        //             ...oldData,
        //             categories: updatedProject.categories,
        //           };
        //           return newData;
        //         }
        //       );
        //     }
        //   }
        // }
      },
      onError: (error, updatedDocument, context) => {
        if (context)
          queryClient.setQueryData(
            `${project_id}-documents`,
            context.previousDocuments
          );

        toastError("There was an error updating your document.");
      },
    }
  );

  return (
    <AutoComplete
      value={currentDoc.categories.map((cat) => cat.tag)}
      suggestions={filteredCategories}
      placeholder={
        currentDoc.categories ? "" : "Enter tags for this document..."
      }
      completeMethod={(e) =>
        searchCategory(e, categories || [], setFilteredCategories)
      }
      itemTemplate={(data) => <span>{data.tag}</span>}
      multiple
      onChange={async (e) =>
        categoriesMutation.mutate({
          doc_id: currentDoc.id,
          categories: e.value,
        })
      }
      onKeyUp={async (e) => {
        if (e.key === "Enter" && e.currentTarget.value !== "") {
          if (
            currentDoc.categories &&
            !currentDoc.categories.includes(e.currentTarget.value)
          ) {
            categoriesMutation.mutate({
              doc_id: currentDoc.id,
              categories: [...currentDoc.categories, e.currentTarget.value],
            });
          } else if (
            currentDoc.categories &&
            currentDoc.categories.includes(e.currentTarget.value)
          ) {
            toastWarn("Tag already exists on this document!");
          } else if (!currentDoc.categories) {
            categoriesMutation.mutate({
              doc_id: currentDoc.id,
              categories: [e.currentTarget.value],
            });
          }
          e.currentTarget.value = "";
        }
      }}
    />
  );
}
