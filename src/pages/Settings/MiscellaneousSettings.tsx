import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

import SwatchCard from "../../components/Card/SwatchCard";
import { useDeleteSwatch, useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function MiscellaneousSettings() {
  const { project_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const { data: project } = useGetSingleProject(project_id as string, { staleTime: 5 * 60 * 1000 });
  const { mutateAsync } = useDeleteSwatch(project_id as string);

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div>
        <Button
          className="p-button-outlined p-button-primary"
          icon="pi pi-plus"
          iconPos="right"
          label="Add new swatch"
          onClick={() => setDrawer({ ...DefaultDrawer, type: "swatches", show: true, position: "right" })}
        />
      </div>
      <div className="grid max-w-full gap-4  lg:grid-cols-4 xl:grid-cols-6">
        {project?.swatches?.length
          ? project.swatches.map((swatch) => <SwatchCard key={swatch.id} {...swatch} deleteSwatch={mutateAsync} />)
          : "There are no swatches."}
      </div>
    </div>
  );
}
