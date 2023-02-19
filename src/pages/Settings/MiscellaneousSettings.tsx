import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

import { useGetSingleProject } from "../../CRUD/ProjectCRUD";

export default function MiscellaneousSettings() {
  const { project_id } = useParams();
  const { data: project } = useGetSingleProject(project_id as string, { staleTime: 5 * 60 * 1000 });
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div>
        <Button
          className="p-button-outlined p-button-primary"
          icon="pi pi-plus"
          iconPos="right"
          label="Add new swatch"
          onClick={() => {}}
        />
      </div>
      {project?.swatches?.length ? "Test" : "There are no swatches."}
    </div>
  );
}
