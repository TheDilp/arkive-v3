import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { ImageDropdownItem } from "../../components/Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../components/Dropdown/ImageDropdownValue";
import { useGetAllImages } from "../../CRUD/ItemsCRUD";
import { useDeleteProject, useGetSingleProject, useUpdateProject } from "../../CRUD/ProjectCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { virtualScrollerSettings } from "../../utils/uiUtils";

export default function ProjectSettings() {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSingleProject(project_id as string);
  const { data: allImages } = useGetAllImages(project_id as string);
  const [localItem, setLocalItem] = useState<ProjectType | undefined>(data);
  useEffect(() => {
    if (data) setLocalItem(data);
  }, [data]);
  const updateProject = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  if (isLoading) return <ProgressSpinner />;
  return (
    <div className="flex h-[95vh] flex-col gap-y-4 overflow-y-auto p-4">
      <div>
        <h2 className="font-Merriweather text-2xl font-bold">{data?.title} - Settings</h2>
      </div>
      <h3 className="text-lg font-semibold">Update Project Name</h3>
      <div className="flex gap-x-4">
        <InputText
          className="w-2/3"
          onChange={(e) => setLocalItem({ ...localItem, id: data?.id as string, title: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateProject.mutate({ id: project_id as string, title: localItem?.title });
          }}
          value={localItem?.title || ""}
        />
        <Button
          className="p-button-outlined p-button-success"
          icon="pi pi-save"
          iconPos="right"
          label="Save"
          onClick={() => {
            updateProject.mutate({ id: project_id as string, title: localItem?.title });
          }}
        />
      </div>
      <h3 className="text-lg font-semibold">Update Project Card Image</h3>
      <div className="flex h-48 w-48 flex-col gap-x-4">
        <div className=" max-h-36 max-w-[9rem] ">
          <img
            alt="Project cover"
            className="mb-2 object-cover"
            src={localItem?.image ? `${baseURLS.baseImageHost}${localItem?.image}` : defaultImage}
          />
        </div>
        <Dropdown
          className="w-64"
          itemTemplate={ImageDropdownItem}
          onChange={(e) => {
            updateProject.mutate({ id: data?.id, image: e.value });
          }}
          options={allImages || []}
          placeholder="Select image"
          value={localItem}
          valueTemplate={ImageDropdownValue({ image: localItem?.image || "" })}
          virtualScrollerOptions={virtualScrollerSettings}
        />
      </div>
      <hr />
      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-semibold">Export Project</h3>
        <h4 className="text-base font-semibold">
          This exports all data related to documents, maps, boards and images from this project in the JSON format (docs, maps,
          boards).
        </h4>
        <Button className="p-button-outlined w-fit" icon="pi pi-download" iconPos="right" label="Export All" />
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-semibold">Export All</h3>
        <h4 className="text-base font-semibold">This button exports only images that are related to this project.</h4>
        <Button className="p-button-outlined w-fit" icon="pi pi-download" iconPos="right" label="Export Images" />
      </div>
      <hr />
      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-semibold">Delete Project</h3>
        <h4 className="text-base font-bold text-red-600">
          Warning: A deleted project cannot be recovered. This also deletes all documents, maps, boards and images associated
          with this project.
        </h4>
        <h5 className="text-sm font-semibold">You can export a project before deleting it via the button above.</h5>

        <Button
          className="p-button-outlined p-button-danger w-fit"
          icon="pi pi-trash"
          iconPos="right"
          label="Delete Project"
          onClick={() =>
            deleteItem("Are you sure you want to delete this project?", async () => {
              await deleteProjectMutation.mutateAsync(project_id as string);
              navigate("/");
            })
          }
        />
      </div>
    </div>
  );
}
