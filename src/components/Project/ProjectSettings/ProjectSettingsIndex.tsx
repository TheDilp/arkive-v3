import { useParams } from "react-router-dom";
import { ProjectProps } from "../../../custom-types";
import { useGetProjectData } from "../../../utils/customHooks";
import BoardSettings from "./BoardSettings";
import DocumentsSettingsTable from "./DocumentsSettingsTable";
import ProjectSettings from "./ProjectSettings";
import SettingsNav from "./SettingsNav";

export default function ProjectSettingsIndex() {
  const { project_id, setting } = useParams();

  const project = useGetProjectData(project_id as string);
  return (
    <div className="flex w-full h-screen">
      <div className="w-17rem surface-50 h-full">
        <SettingsNav />
      </div>
      {project && (
        <div className="w-11 h-full">
          {setting === "project-settings" && (
            <ProjectSettings project={project as ProjectProps} />
          )}
          {setting === "documents-settings" && <DocumentsSettingsTable />}
          {setting === "board-settings" && (
            <BoardSettings project={project as ProjectProps} />
          )}
        </div>
      )}
    </div>
  );
}
