import { useParams } from "react-router-dom";
import { useGetProjectData } from "../../utils/customHooks";

export default function NavbarTitle() {
  const { project_id } = useParams();
  const projectData = useGetProjectData(project_id as string);
  return (
    <div className="fixed w-full flex overflow-hidden pointer-events-none">
      <h2 className="mx-auto my-0">{projectData?.title}</h2>
    </div>
  );
}
