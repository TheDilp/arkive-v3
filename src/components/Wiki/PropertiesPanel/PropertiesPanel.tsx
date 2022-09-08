import { Button } from "primereact/button";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetDocumentData,
  useGetProjectData,
  useGetTags
} from "../../../utils/customHooks";
import { auth } from "../../../utils/supabaseUtils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import AlterNamesAutocomplete from "./AlterNamesAutocomplete";
import CategoryAutocomplete from "./CategoryAutocomplete";
import LinkedItems from "./LinkedItems";
export default function PropertiesPanel() {
  const { project_id, doc_id } = useParams();
  const currentDoc = useGetDocumentData(project_id as string, doc_id as string);
  const project = useGetProjectData(project_id as string);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const { data: categories, refetch: refetchAllTags } = useGetTags(
    project_id as string
  );
  const user = auth.user();
  useEffect(() => {
    if (categories.length > 0) {
      setFilteredCategories(categories);
    }
  }, [categories]);

  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  return (
    <div
      className={`${isLaptop ? "w-3" : "w-2"
        } surface-50 text-white align-items-start align-content-start Lato ${isTabletOrMobile ? "hidden" : "flex flex-wrap"
        }`}
      style={{
        height: "96.4vh",
      }}
    >
      <div className="w-full">
        {currentDoc && (
          <AlterNamesAutocomplete alter_names={currentDoc.alter_names} />
        )}
      </div>

      {project && currentDoc && (
        <div className="p-fluid w-full">
          <CategoryAutocomplete
            currentDoc={currentDoc}
            currentProject={project}
            categories={categories}
            refetchAllTags={refetchAllTags}
            filteredCategories={filteredCategories}
            setFilteredCategories={setFilteredCategories}
          />
        </div>
      )}

      <div className="w-full">
        {/* Markers and Nodes document is linked to */}
        <LinkedItems />
      </div>
      <div className="w-full">
        <hr className="border-gray-500" />

        <div className="w-full my-2 flex justify-content-center align-items-center">
          <Link
            to={`../../../../view/${project_id}/wiki/${doc_id}`}
            className="no-underline"
          >
            <Button
              className="p-button-outlined"
              label="Public Page"
              icon="pi pi-external-link"
              iconPos="right"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
