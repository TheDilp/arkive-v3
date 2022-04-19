import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../../custom-types";
import { useGetTags } from "../../../utils/utils";
import CategoryAutocomplete from "./CategoryAutocomplete";
export default function PropertiesPanel() {
  const { project_id, doc_id } = useParams();
  const queryClient = useQueryClient();
  const [currentDoc, setCurrentDoc] = useState<Document | null>();
  const [project, setProject] = useState<Project | null>();
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const { data: categories, refetch: refetchAllTags } = useGetTags(
    project_id as string
  );
  useEffect(() => {
    if (categories.length > 0) {
      setFilteredCategories(categories);
    }
  }, [categories]);
  useEffect(() => {
    const allDocs: Document[] = queryClient.getQueryData(
      `${project_id}-documents`
    ) as Document[];
    if (allDocs) {
      setCurrentDoc(allDocs.filter((doc) => doc.id === doc_id)[0]);
    }
    const project: Project = queryClient.getQueryData(
      `${project_id}-project`
    ) as Project;
    if (project) {
      setProject(project);
    }
  }, [doc_id]);

  return (
    <div className="h-full w-2 surface-50 text-white">
      {project && currentDoc && (
        <span className="p-fluid">
          <CategoryAutocomplete
            currentDoc={currentDoc}
            currentProject={project}
            categories={categories}
            refetchAllTags={refetchAllTags}
            filteredCategories={filteredCategories}
            setCurrentDoc={setCurrentDoc}
            setFilteredCategories={setFilteredCategories}
          />
        </span>
      )}
    </div>
  );
}
