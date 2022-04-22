import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../../custom-types";
import {
  useCreateTemplate,
  useGetProjectData,
  useGetTags,
} from "../../../utils/customHooks";
import CategoryAutocomplete from "./CategoryAutocomplete";
import { v4 as uuid } from "uuid";
import { auth } from "../../../utils/supabaseUtils";
import { toastSuccess, toastWarn } from "../../../utils/utils";
export default function PropertiesPanel() {
  const { project_id, doc_id } = useParams();
  const queryClient = useQueryClient();
  const [currentDoc, setCurrentDoc] = useState<Document | null>();
  const project = useGetProjectData(project_id as string);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const { data: categories, refetch: refetchAllTags } = useGetTags(
    project_id as string
  );
  const user = auth.user();
  const allDocs: Document[] = queryClient.getQueryData(
    `${project_id}-documents`
  ) as Document[];
  useEffect(() => {
    if (categories.length > 0) {
      setFilteredCategories(categories);
    }
  }, [categories]);
  useEffect(() => {
    if (allDocs) {
      setCurrentDoc(allDocs.filter((doc) => doc.id === doc_id)[0]);
    }
  }, [doc_id, allDocs]);
  const createTemplateMutation = useCreateTemplate();

  return (
    <div
      className="w-2 surface-50 text-white flex flex-wrap"
      style={{
        height: "96.4vh",
      }}
    >
      {project && currentDoc && (
        <div className="p-fluid w-full">
          <CategoryAutocomplete
            currentDoc={currentDoc}
            currentProject={project}
            categories={categories}
            refetchAllTags={refetchAllTags}
            filteredCategories={filteredCategories}
            setCurrentDoc={setCurrentDoc}
            setFilteredCategories={setFilteredCategories}
          />
        </div>
      )}
      <div className="Lato w-full align-self-end">
        <hr className="border-gray-500" />
        <div className="flex justify-content-center py-2">
          <Button
            label="Create Template"
            icon="pi pi-fw pi-copy"
            iconPos="right"
            className="p-button-outlined p-button-raised p-2"
            onClick={() => {
              let id = uuid();
              if (currentDoc && user) {
                if (currentDoc.content) {
                  createTemplateMutation.mutate({
                    ...currentDoc,
                    content: currentDoc.content,
                    id,
                  });
                  toastSuccess(
                    `Template from document ${currentDoc.title} created.`
                  );
                } else {
                  toastWarn(
                    "Document must have some content in order to create template!"
                  );
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
