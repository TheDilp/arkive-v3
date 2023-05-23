import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { ImageDropdownItem } from "../../components/Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../components/Dropdown/ImageDropdownValue";
import { useGetAllImages } from "../../CRUD/ItemsCRUD";
import { useDeleteProject, useGetSingleProject, useUpdateProject } from "../../CRUD/ProjectCRUD";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { PermissionAtom, UserAtom } from "../../utils/Atoms/atoms";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { exportImages } from "../../utils/imageUtils";
import { exportProject } from "../../utils/settingsUtils";
import { toaster } from "../../utils/toast";
import { virtualScrollerSettings } from "../../utils/uiUtils";

export default function ProjectSettings() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userData = useAtomValue(UserAtom);
  const permission = useAtomValue(PermissionAtom);
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useGetSingleProject(project_id as string);
  const [localItem, setLocalItem] = useState<ProjectType | undefined>(data);
  const { data: allImages } = useGetAllImages(project_id as string, {
    staleTime: 5 * 60 * 1000,
  });
  useEffect(() => {
    if (data) setLocalItem(data);
  }, [data]);
  const updateProject = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  if (!permission || permission !== "owner") {
    toaster("info", "You do not have permissions to view the project settings.");
    return <Navigate to="/" />;
  }
  if (isLoading || !userData) return <ProgressSpinner />;
  return (
    <div className="flex h-[95vh] flex-col gap-y-4 overflow-y-auto p-4">
      <div>
        <h2 className="font-Merriweather text-2xl font-bold">{data?.title} - Settings</h2>
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
          filter
          itemTemplate={ImageDropdownItem}
          onChange={(e) => {
            updateProject.mutate({ id: data?.id, image: e.value, user_id: userData.id });
          }}
          options={allImages || []}
          placeholder="Select image"
          value={localItem}
          valueTemplate={ImageDropdownValue({ image: localItem?.image || "" })}
          virtualScrollerOptions={virtualScrollerSettings}
        />
      </div>
      <h3 className="text-lg font-semibold">Update Project Name</h3>
      <div className="flex w-full max-w-lg gap-x-4">
        <InputText
          className="w-2/3"
          // @ts-ignore
          onChange={(e) => setLocalItem((prev) => ({ ...prev, id: data?.id as string, title: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              updateProject.mutate({ id: project_id as string, title: localItem?.title, user_id: userData.id });
          }}
          value={localItem?.title || ""}
        />
        <Button
          className="p-button-outlined p-button-success"
          icon="pi pi-save"
          iconPos="right"
          label="Save"
          onClick={() => {
            updateProject.mutate({ id: project_id as string, title: localItem?.title, user_id: userData.id });
          }}
        />
      </div>

      <hr className="border-zinc-700" />

      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-semibold">Export Project</h3>
        <h4 className="text-base font-semibold">
          This exports all data related to documents, maps, graphs, calendars, timelines, screens, dictionaries and random
          tables from this project in the JSON format.
        </h4>
        <Button
          className="p-button-outlined w-fit"
          disabled={loading}
          icon="pi pi-download"
          iconPos="right"
          label="Export All"
          onClick={async () => {
            setLoading(true);
            const projectData: ProjectType = await FetchFunction({
              url: `${baseURLS.baseServer}exportproject/${project_id}`,
              method: "GET",
            });
            exportProject(projectData);
            setLoading(false);
          }}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-semibold">Export All</h3>
        <h4 className="text-base font-semibold">This button exports only images that are related to this project.</h4>
        <Button
          className="p-button-outlined w-fit"
          disabled={loading}
          icon="pi pi-download"
          iconPos="right"
          label="Export Images"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            const imagesData = await queryClient.ensureQueryData({
              queryKey: ["allSettingsImages", project_id],
              queryFn: async () =>
                FetchFunction({
                  url: `${baseURLS.baseServer}${getURLS.getAllSettingsImages}${project_id}`,
                  method: "GET",
                }),
            });
            if (imagesData) {
              const images = imagesData?.map((img: { Key: string }) => `${import.meta.env.VITE_S3_CDN_HOST}/${img.Key}`);
              if (data) await exportImages(project_id as string, images);
            }
            setLoading(false);
          }}
        />
      </div>
      <hr className="border-zinc-700" />

      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-semibold">Delete Project</h3>
        <h4 className="text-base font-bold text-red-600">
          Warning: A deleted project cannot be recovered. This also deletes all data and images associated with this project.
        </h4>
        <h5 className="text-sm font-semibold">You can export a project before deleting it via the button above.</h5>

        <Button
          className="p-button-outlined p-button-danger w-fit"
          icon="pi pi-trash"
          iconPos="right"
          label="Delete Project"
          onClick={() =>
            deleteItem("Are you sure you want to delete this project?", async () => {
              await deleteProjectMutation.mutateAsync({ id: project_id as string, user_id: userData.id });
              navigate("/");
            })
          }
        />
      </div>
    </div>
  );
}
