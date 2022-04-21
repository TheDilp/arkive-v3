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
export default function PropertiesPanel() {
  const { project_id, doc_id } = useParams();
  const queryClient = useQueryClient();
  const [currentDoc, setCurrentDoc] = useState<Document | null>();
  const project = useGetProjectData(project_id as string);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const { data: categories, refetch: refetchAllTags } = useGetTags(
    project_id as string
  );
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
    <div className="h-full w-2 surface-50 text-white">
      {project && currentDoc && (
        <div className="p-fluid">
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
      <div className="Lato">
        <hr />
        CREATE TEMPLATE FROM DOCUMENT
        <div className="flex justify-content-end mt-2">
          <Button
            label="Create Template"
            icon="pi pi-fw pi-copy"
            className="p-button-outlined p-button-raised"
            onClick={() => {
              let id = uuid();
              console.log(currentDoc);
              if (currentDoc && currentDoc.content)
                createTemplateMutation.mutate({
                  id,
                  project_id: project_id as string,
                  title: `${currentDoc.title} template`,
                  content: currentDoc?.content,
                });
            }}
          />
        </div>
      </div>
    </div>
  );
}
