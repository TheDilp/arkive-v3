import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { ImageDropdownItem } from "../../components/Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../components/Dropdown/ImageDropdownValue";
import { useGetAllImages } from "../../CRUD/ItemsCRUD";
import { useGetSingleProject, useUpdateProject } from "../../CRUD/ProjectCRUD";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { ProjectType } from "../../types/projectTypes";

export default function ProjectSettings() {
  const { project_id } = useParams();
  const { data, isLoading } = useGetSingleProject(project_id as string);
  const { data: allImages } = useGetAllImages(project_id as string);
  const [localItem, setLocalItem] = useState<ProjectType | undefined>(data);
  console.log(allImages);
  useEffect(() => {
    if (data) setLocalItem(data);
  }, [data]);
  const updateProject = useUpdateProject();
  if (isLoading) return <ProgressSpinner />;
  return (
    <div className="flex h-[95vh] flex-col gap-y-4 overflow-y-auto p-4">
      <div>
        <h2 className="text-2xl font-bold font-Merriweather">{data?.title} - Settings</h2>
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
      <div className="flex flex-col w-48 h-48 gap-x-4">
        <img
          alt="Project cover"
          className="object-contain mb-2"
          src={
            localItem?.image ? `${baseURLS.baseServer}${getURLS.getSingleImage}${project_id}/${localItem?.image}` : defaultImage
          }
        />
        <Dropdown
          itemTemplate={ImageDropdownItem}
          onChange={(e) => {
            // if (localItem) setLocalItem({ ...localItem, id: data?.id as string, image: e.value });
            updateProject.mutate({ id: data?.id, image: e.value });
          }}
          options={allImages?.map((image) => `${import.meta.env.VITE_S3_CDN_HOST}/${image.Key}`) || []}
          placeholder="Select image"
          value={localItem}
          valueTemplate={ImageDropdownValue({ image: localItem?.image || "" })}
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

        <Button className="p-button-outlined p-button-danger w-fit" icon="pi pi-trash" iconPos="right" label="Delete Project" />
      </div>
    </div>
  );
}
