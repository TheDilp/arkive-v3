import { AutoComplete } from "primereact/autocomplete";
import React from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../../custom-types";
import { updateDocument, updateProject } from "../../../utils/supabaseUtils";
import { searchCategory, toastError, toastWarn } from "../../../utils/utils";

type Props = {
  currentDoc: Document;
  filteredCategories: string[];
  currentProject: Project;
  setCurrentDoc: (doc: Document | null) => void;
  setFilteredCategories: (categories: string[]) => void;
};

export default function CategoryAutocomplete({
  currentProject,
  currentDoc,
  filteredCategories,
  setCurrentDoc,
  setFilteredCategories,
}: Props) {
  const { project_id, doc_id } = useParams();
  const queryClient = useQueryClient();

  async function updateCategories(currentDoc: Document, categories: string[]) {
    let oldDocument = currentDoc;
    setCurrentDoc({ ...currentDoc, categories });
    const updatedDocument = await updateDocument(
      doc_id as string,
      undefined,
      undefined,
      categories
    ).catch((err) => {
      setCurrentDoc(oldDocument);
      toastError("There was an error updating your document's categories");
    });
    if (updatedDocument) {
      let projectData: Project = queryClient.getQueryData(
        `${project_id}-project`
      ) as Project;
      if (projectData) {
        // Filter out any categories that are not already present in the global project categories
        let difference = categories.filter(
          (cat) => !projectData.categories.includes(cat)
        );
        if (difference.length > 0) {
          await updateProject(
            project_id as string,
            undefined,
            projectData.categories.concat(difference)
          );
        }
      }
      queryClient.setQueryData(
        `${project_id}-documents`,
        (oldData: Document[] | undefined) => {
          if (oldData) {
            let newData: Document[] = oldData.map((doc) => {
              if (doc.id === updatedDocument.id) {
                return updatedDocument;
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
    }
  }

  return (
    <AutoComplete
      value={currentDoc.categories}
      suggestions={filteredCategories}
      placeholder={
        currentDoc.categories ? "" : "Enter tags for this document..."
      }
      completeMethod={(e) =>
        searchCategory(e, currentProject.categories, setFilteredCategories)
      }
      multiple
      onChange={async (e) => updateCategories(currentDoc, e.value)}
      onKeyUp={async (e) => {
        if (e.key === "Enter" && e.currentTarget.value !== "") {
          if (
            currentDoc.categories &&
            !currentDoc.categories.includes(e.currentTarget.value)
          ) {
            updateCategories(currentDoc, [
              ...currentDoc.categories,
              e.currentTarget.value,
            ]);
          } else if (
            currentDoc.categories &&
            currentDoc.categories.includes(e.currentTarget.value)
          ) {
            toastWarn("Tag already exists on this document!");
          } else if (!currentDoc.categories && e.currentTarget.value !== "") {
            updateCategories(currentDoc, [e.currentTarget.value]);
          }
          e.currentTarget.value = "";
        }
      }}
    />
  );
}
