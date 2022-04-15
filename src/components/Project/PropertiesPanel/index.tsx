import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, Project } from "../../../custom-types";
import { getProjects } from "../../../utils/supabaseUtils";
import { useGetProjectData } from "../../../utils/utils";
import CategoryAutocomplete from "./CategoryAutocomplete";
export default function PropertiesPanel() {
  const { project_id, doc_id } = useParams();
  const queryClient = useQueryClient();
  const [currentDoc, setCurrentDoc] = useState<Document | null>();
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const project = useGetProjectData(project_id as string);
  useEffect(() => {
    if (project) {
      setFilteredCategories(project.categories);
    }
  }, [project]);

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
      {project && currentDoc && (
        <span className="p-fluid">
          <CategoryAutocomplete
            currentDoc={currentDoc}
            currentProject={project}
            filteredCategories={filteredCategories}
            setCurrentDoc={setCurrentDoc}
            setFilteredCategories={setFilteredCategories}
          />
        </span>
      )}
    </div>
  );
}
