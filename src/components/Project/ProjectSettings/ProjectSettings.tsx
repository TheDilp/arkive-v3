import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Project } from "../../../custom-types";
import { deleteProject, updateProject } from "../../../utils/supabaseUtils";
import { toastSuccess, useUpdateProject } from "../../../utils/utils";

type Props = {
  project: Project;
};

export default function ProjectSettings({ project }: Props) {
  const [localProject, setLocalProject] = useState<Project>(project);
  const queryClient = useQueryClient();
  const projectMutation = useUpdateProject();

  const navigate = useNavigate();
  const confirmDeleteDialog = () =>
    confirmDialog({
      message: `Are you sure you want to delete the project: ${project.title}?`,
      header: `Deleting ${project.title}`,
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteProject(project.id).then(() => {
          navigate("/");
        });
      },
    });
  return (
    <article className="w-full px-3 justify-content-center text-white">
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
          iconPos="right"
          className="p-button-outlined p-button-success ml-2"
          onClick={() => {
            projectMutation.mutate({
              project_id: localProject.id,
              title: localProject.title,
            });
          }}
        />
      </section>
      <section className="Lato">
        <h3>Update Project Card Image</h3>
        <div className="w-10rem">
          <img
            src={project.cardImage}
            alt="Card"
            className="w-full h-full border-round cursor-pointer relative"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
        <div className="w-full flex flex-nowrap mt-2">
          <InputText
            value={localProject.cardImage}
            onChange={(e) =>
              setLocalProject({ ...localProject, cardImage: e.target.value })
            }
            className="w-20rem"
          />
          <Button
            label="Save"
            icon="pi pi-fw pi-save"
            iconPos="right"
            className="p-button-outlined p-button-success ml-2"
            onClick={() =>
              projectMutation.mutate({
                project_id: localProject.id,
                cardImage: localProject.cardImage,
              })
            }
          />
        </div>
      </section>
      <section className="Lato mt-5">
        <hr />
        <div className="w-fit">
          <h3>Delete Project</h3>
          <h4 style={{ color: "var(--red-500)" }}>
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
              iconPos="right"
            />
          </div>
        </div>
      </section>
      <div className="flex justify-content-center"></div>
    </article>
  );
}
