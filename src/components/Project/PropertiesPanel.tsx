import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../custom-types";
import { AutoComplete } from "primereact/autocomplete";
import { searchCategory, toastError } from "../../utils/utils";
import { updateDocument } from "../../utils/supabaseUtils";
export default function PropertiesPanel() {
  const { project_id, doc_id } = useParams();
  const queryClient = useQueryClient();
  const [currentDoc, setCurrentDoc] = useState<Document | null>();
  const [currentProject, setCurrentProject] = useState<Project | null>();
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  useEffect(() => {
    const currentProject: Project = queryClient.getQueryData(
      `${project_id}-project`
    ) as Project;
    if (currentProject) {
      setCurrentProject(currentProject);
      setFilteredCategories(currentProject.categories);
    }
  }, []);

  useEffect(() => {
    const allDocs: Document[] = queryClient.getQueryData(
      `${project_id}-documents`
    ) as Document[];
    if (allDocs) {
      setCurrentDoc(allDocs.filter((doc) => doc.id === doc_id)[0]);
    }
  }, [doc_id]);
  return (
    <div className="h-full w-2 surface-50 text-white">
      {currentProject && currentDoc && (
        <span className="p-fluid">
          <AutoComplete
            value={currentDoc.categories}
            suggestions={filteredCategories}
            completeMethod={(e) =>
              searchCategory(
                e,
                currentProject.categories,
                setFilteredCategories
              )
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
                toastError(
                  "There was an error updating your document's categories"
                );
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
        </span>
      )}
    </div>
  );
}
