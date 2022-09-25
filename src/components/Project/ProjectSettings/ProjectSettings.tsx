import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageProps, ProjectProps } from "../../../custom-types";
import defaultImage from "../../../styles/DefaultProjectImage.jpg";
import { useGetImages, useUpdateProject } from "../../../utils/customHooks";
import { deleteProject, exportProject } from "../../../utils/supabaseUtils";
import {
  supabaseStorageImagesLink,
  toastSuccess,
  virtualScrollerSettings,
} from "../../../utils/utils";
import ImgDropdownItem from "../../Util/ImgDropdownItem";
type Props = {
  project: ProjectProps;
};

export default function ProjectSettings({ project }: Props) {
  const { project_id } = useParams();
  const [localProject, setLocalProject] = useState<ProjectProps>(project);
  const [loading, setLoading] = useState(false);
  const projectMutation = useUpdateProject();
  const images = useGetImages(project_id as string);
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
          toastSuccess("Project deleted.");
        });
      },
    });

  const exportImages = async () => {
    setLoading(true);
    const zip = new JSZip();
    let images_folder = zip.folder("images");

    if (images?.data) {
      for (let index = 0; index < images?.data?.length; index++) {
        const res = await fetch(
          supabaseStorageImagesLink + images.data[index].link
        );
        const blob = await res.blob();
        images_folder?.file(images?.data[index].title, blob, {
          base64: true,
        });
      }
      zip
        ?.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 5,
          },
        })
        .then((content) => {
          saveAs(content, `${project_id}-images.zip`);
          setLoading(false);
        });
    }
  };

  const exportAll = async () => {
    await exportProject(project_id as string);
    await exportImages();
  };

  return (
    <article className="w-full px-3 justify-content-center text-white overflow-y-auto h-screen">
      <ConfirmDialog />
      <h2 className="Merriweather">{project.title} Settings</h2>
      <section className="Lato my-6">
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
      <section className="Lato my-6">
        <h3>Update Project Card Image</h3>
        <div className="w-10rem">
          <img
            src={
              project.cardImage
                ? supabaseStorageImagesLink + project.cardImage
                : defaultImage
            }
            alt="Card"
            className="w-full h-full border-round cursor-pointer relative"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
        <div className="w-4 flex flex-nowrap mt-2">
          <Dropdown
            filter
            filterBy="title"
            className="w-full"
            placeholder="Custom Image"
            optionLabel="title"
            virtualScrollerOptions={virtualScrollerSettings}
            itemTemplate={(item: ImageProps) => (
              <ImgDropdownItem title={item.title} link={item.link} />
            )}
            options={
              images?.data
                ? [
                    { title: "No image", id: null },
                    ...images?.data.filter((image) => image.type === "Image"),
                  ]
                : []
            }
            value={localProject.cardImage}
            onChange={(e) =>
              projectMutation.mutate({
                project_id: localProject.id,
                cardImage: e.target.value.link,
              })
            }
          />
        </div>
      </section>

      <section className="Lato my-6">
        <hr />
        <div className="w-fit">
          <h3>Export Project</h3>
          <p>
            This exports all data related to documents, maps, boards and images
            from this project. This exports them as JSON (docs, maps, boards).
          </p>
          <div className="w-full">
            <Button
              label="Export All"
              icon="pi pi-fw pi-download"
              className="p-button-outlined p-button-primary"
              onClick={exportAll}
              iconPos="right"
            />
          </div>
        </div>
        <div className="w-full">
          <h4>Export Images</h4>
          <p>
            This button exports only images that are related to this project.
          </p>
          <div className="w-full">
            <Button
              label="Export Images"
              icon="pi pi-fw pi-download"
              className="p-button-outlined p-button-primary"
              onClick={exportImages}
              loading={loading}
              iconPos="right"
            />
          </div>
        </div>
      </section>
      <section className="Lato my-6">
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
    </article>
  );
}
