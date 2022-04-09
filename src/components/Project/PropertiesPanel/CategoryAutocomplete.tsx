import { AutoComplete } from "primereact/autocomplete";
import React from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../../custom-types";
import { updateDocument } from "../../../utils/supabaseUtils";
import { searchCategory, toastError } from "../../../utils/utils";

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

  return (
    <AutoComplete
      value={currentDoc.categories}
      suggestions={filteredCategories}
      completeMethod={(e) =>
        searchCategory(e, currentProject.categories, setFilteredCategories)
      }
      multiple
      onChange={async (e) => {
        let oldDocument = currentDoc;
        setCurrentDoc({ ...currentDoc, categories: e.value });
        const updatedDocument = await updateDocument(
          doc_id as string,
          undefined,
          e.value
        ).catch((err) => {
          setCurrentDoc(oldDocument);
          toastError("There was an error updating your document's categories");
        });
        if (updatedDocument) {
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
      }}
    />
  );
}
