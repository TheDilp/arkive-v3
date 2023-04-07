import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Password } from "primereact/password";
import { TabPanel, TabView } from "primereact/tabview";
import { useParams } from "react-router-dom";

import SwatchCard from "../../components/Card/SwatchCard";
import NewWebhook from "../../components/Webhook/NewWebhook";
import { useDeleteWebhook } from "../../CRUD/OtherCRUD";
import { useDeleteSwatch, useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { WebhookType } from "../../types/generalTypes";
import { DrawerAtom, UserAtom } from "../../utils/Atoms/atoms";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

function WebhookPassword({ url }: { url: string }) {
  return (
    <Password
      autoComplete="false"
      className="w-full"
      disabled
      feedback={false}
      inputClassName="w-full"
      name="Webhook url"
      placeholder="Webhook url"
      toggleMask
      type="text"
      value={url}
    />
  );
}
function ActionsColumn(
  { id, user_id }: WebhookType & { user_id: string },
  deleteAction: (hook_id: string, userId: string) => void,
) {
  return (
    <Button
      className="p-button-danger p-button-outlined"
      icon="pi pi-fw pi-trash"
      iconPos="right"
      onClick={() => deleteAction(id, user_id)}
    />
  );
}

export default function MiscellaneousSettings() {
  const { project_id } = useParams();
  const userData = useAtomValue(UserAtom);
  const setDrawer = useSetAtom(DrawerAtom);
  const { data: project } = useGetSingleProject(project_id as string, { staleTime: 5 * 60 * 1000 });
  const { mutateAsync } = useDeleteSwatch(project_id as string);
  const { mutate: deleteWebhookMutation } = useDeleteWebhook();
  const deleteAction = (id: string, user_id: string) =>
    deleteItem("Are you sure you want to delete this item?", () => {
      if (userData?.auth_id) deleteWebhookMutation({ id, user_id, auth_id: userData?.auth_id });
    });

  return (
    <div className="miscSettings">
      <TabView renderActiveOnly>
        <TabPanel header="Swatches">
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
        </TabPanel>
        <TabPanel header="Webhooks">
          <div className="flex w-full flex-col gap-4 rounded p-8">
            <NewWebhook />
            <DataTable value={userData?.webhooks || []}>
              <Column field="title" header="Server title" />
              <Column body={WebhookPassword} className="w-fit" field="url" header="Webhook" />
              <Column body={(data) => ActionsColumn({ ...data, user_id: userData?.id }, deleteAction)} header="Actions" />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
}
