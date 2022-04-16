import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Category, Document } from "../../../custom-types";
import { useGetProjectData } from "../../../utils/utils";
import CategoryAutocomplete from "./CategoryAutocomplete";
export default function PropertiesPanel() {
  const { project_id, doc_id } = useParams();
  const queryClient = useQueryClient();
  const [currentDoc, setCurrentDoc] = useState<Document | null>();
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const project = useGetProjectData(project_id as string);
  useEffect(() => {
    if (project_id) {
      let cats: Category[] | undefined =
        queryClient.getQueryData("getCategories");
      if (cats) {
        setFilteredCategories(cats);
      }
    }
  }, [project_id]);

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
