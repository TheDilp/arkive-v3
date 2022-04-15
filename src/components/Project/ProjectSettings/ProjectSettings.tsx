import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Project } from "../../../custom-types";
import { updateProject } from "../../../utils/supabaseUtils";
import { toastSuccess } from "../../../utils/utils";

type Props = {
  project: Project;
};

export default function ProjectSettings({ project }: Props) {
  const [localProject, setLocalProject] = useState<Project>(project);
  const queryClient = useQueryClient();
  const updateProjectMutation = useMutation(
    async (vars: {
      project_id: string;
      title?: string;
      categories?: string[];
    }) => await updateProject(vars.project_id, vars.title, vars.categories),
    {
      onMutate: async (updatedProject) => {
        await queryClient.cancelQueries(`${localProject.id}-project`);

        const previousProject = queryClient.getQueryData(
          `${localProject.id}-project`
        );
        queryClient.setQueryData(
          `${localProject.id}-project`,
          //   @ts-ignore
          (oldData: Project | undefined) => {
            if (oldData) return { ...oldData, ...updatedProject };
          }
        );
        return { previousProject };
      },
      onSuccess: () => {
        toastSuccess("Project successfully updated.");
      },
    }
  );
  const confirmDeleteDialog = () =>
    confirmDialog({
      message: `Are you sure you want to delete the project: ${project.title}?`,
      header: `Deleting ${project.title}`,
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        //   deleteDocument(rowData.id).then(() => {
        //     queryClient.setQueryData(
        //       `${project_id}-documents`,
        //       (oldData: Document[] | undefined) => {
        //         if (oldData) {
        //           return oldData.filter((doc) => doc.id !== rowData.id);
        //         } else {
        //           return [];
        //         }
        //       }
        //     );
        //   });
      },
    });
  return (
    <article className="w-full px-3 justify-content-center">
      <ConfirmDialog />
      <h2 className="Merriweather">{project.title} Settings</h2>
      <section className="Lato">
        <h3>Update Project Name</h3>
        <InputText
          className="w-4"
          value={localProject.title}
          onChange={(e) =>
            setLocalProject({ ...localProject, title: e.target.value })
          }
        />
        <Button
          label="Save"
          icon="pi pi-fw pi-save"
          className="p-button-outlined p-button-success ml-2"
          onClick={() => {
            updateProjectMutation.mutate({
              project_id: localProject.id,
              title: localProject.title,
            });
          }}
        />
      </section>
      <section className="Lato mt-5">
        <hr />
        <div className="w-fit">
          <h3>Delete Project</h3>
          <h4>
            Warning: A deleted project cannot be recovered. This also deletes
            all the documents, boards and maps associated with this project.
          </h4>
          <h5>
            You can export a project before deleting it via the button above.
          </h5>
          <div className="w-1">
            <Button
              label="Delete"
              icon="pi pi-fw pi-trash"
              className="p-button-outlined p-button-danger"
              onClick={confirmDeleteDialog}
            />
          </div>
        </div>
      </section>
      <div className="flex justify-content-center"></div>
    </article>
  );
}
