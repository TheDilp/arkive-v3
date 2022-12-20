import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetSingleProject, useUpdateProject } from "../../CRUD/ProjectCRUD";
import { ProjectType } from "../../types/projectTypes";

type Props = {};

export default function ProjectSettings({}: Props) {
  const { project_id } = useParams();
  const { data } = useGetSingleProject(project_id as string);
  const [localItem, setLocalItem] = useState<ProjectType | undefined>(data);

  useEffect(() => {
    if (data) setLocalItem(data);
  }, [data]);

  const updateProject = useUpdateProject();
  return (
    <div className="flex flex-col gap-y-4 p-4">
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
      <div className="flex gap-x-4">
        <img src="" />
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
    </div>
  );
}
