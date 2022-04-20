import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../utils/supabaseUtils";
import { useGetProjectData } from "../../utils/utils";

export default function NavSettingsButton() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const projectData = useGetProjectData(project_id as string);
  const user = auth.user();

  return projectData?.user_id === user?.id ? (
    <i
      className="pi pi-cog mr-3 cursor-pointer hover:text-primary settingsIcon"
      onClick={() => navigate("settings/documents-settings")}
    ></i>
  ) : null;
}