import { Link } from "react-router-dom";
import { ProjectProps } from "../../custom-types";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import defaultImage from "../../styles/DefaultProjectImage.jpg";
import { useMediaQuery } from "react-responsive";
import { supabaseStorageImagesLink } from "../../utils/utils";
export default function ProjectCard({ ...Project }: ProjectProps) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const header = (
    <Link
      to={`/project/${Project.id}/wiki`}
      className="no-underline relative h-15rem"
    >
      <img
        alt="Card"
        src={
          Project.cardImage
            ? supabaseStorageImagesLink + Project.cardImage
            : defaultImage
        }
        style={{ objectFit: "fill" }}
        className="w-full h-full cursor-pointer h-15rem"
      />
    </Link>
  );
  const footer = (
    <div className="flex justify-content-between ">
      <Link to={`../project/${Project.id}/wiki`} className="no-underline">
        <Button
          label="Wiki"
          icon="pi pi-fw pi-file"
          iconPos="right"
          className="p-button-outlined p-button-primary Lato"
        />
      </Link>

      <Link
        to={`/project/${Project.id}/settings/project-settings`}
        className="no-underline"
      >
        <Button
          label="Settings"
          icon="pi pi-fw pi-cog"
          iconPos="right"
          className="p-button-outlined p-button-secondary Lato"
        />
      </Link>
    </div>
  );
  return (
    <Card
      title={
        <div
          className={`${
            isTabletOrMobile
              ? "white-space-nowrap overflow-hidden  text-overflow-ellipsis"
              : ""
          }`}
        >
          {Project.title}
        </div>
      }
      className={`text-center relative mx-2 h-25rem Merriweather flex flex-column justify-content-between ${
        isTabletOrMobile ? "w-full" : "w-20rem"
      }`}
      header={header}
      footer={footer}
    ></Card>
  );
}
