import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../../custom-types";
import CategoryAutocomplete from "./CategoryAutocomplete";
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
  }, [queryClient.getQueryData(`${project_id}-project`)]);

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
          <CategoryAutocomplete
            currentDoc={currentDoc}
            currentProject={currentProject}
            filteredCategories={filteredCategories}
            setCurrentDoc={setCurrentDoc}
            setFilteredCategories={setFilteredCategories}
          />
        </span>
      )}
    </div>
  );
}
