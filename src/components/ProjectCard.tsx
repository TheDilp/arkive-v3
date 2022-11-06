import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import defaultImage from "../assets/DefaultProjectImage.jpg";
import { ProjectType } from "../types/projectTypes";
export default function ProjectCard({ ...Project }: ProjectType) {
  const header = (
    <Link
      to={`/project/${Project.id}/wiki`}
      className="no-underline relative h-15rem"
    >
      <img
        alt="Card"
        src={defaultImage}
        style={{ objectFit: "fill" }}
        className="w-full h-full cursor-pointer h-15rem"
      />
    </Link>
  );
  const footer = (
    <div className="flex justify-content-between flex-wrap">
      <Link to={`../project/${Project.id}/wiki`} className="no-underline">
        <Button
          label="Wiki"
          icon="pi pi-fw pi-file"
          iconPos="right"
          className="p-button-outlined p-button-primary Lato w-full"
        />
      </Link>
      {/* <Link to={`../project/${Project.id}/maps`} className="no-underline w-4">
        <Button
          // label="Maps"
          icon="pi pi-fw pi-map"
          iconPos="right"
          className="p-button-outlined p-button-primary Lato"
        />
      </Link>
      <Link to={`../project/${Project.id}/boards`} className="no-underline w-4">
        <Button
          // label="Boards"
          icon={() => (
            <Icon
              className="hover:text-primary cursor-pointer "
              icon="mdi:draw"
              fontSize={20}
            />
          )}
          iconPos="right"
          className="p-button-outlined p-button-primary Lato"
        />
      </Link>
      <Link
        to={`../project/${Project.id}/timelines`}
        className="no-underline w-4"
      >
        <Button
          icon={() => (
            <Icon
              className="cursor-pointer"
              icon="mdi:chart-timeline-variant"
              fontSize={22}
            />
          )}
          iconPos="right"
          className="p-button-outlined p-button-primary Lato"
        />
      </Link> */}

      <Link
        to={`/project/${Project.id}/settings/project-settings`}
        className="no-underline"
      >
        <Button
          label="Settings"
          icon="pi pi-fw pi-cog"
          iconPos="right"
          className="p-button-outlined p-button-secondary Lato w-full"
        />
      </Link>
    </div>
  );
  return (
    <Card
      title={
        <div
          className={
            "white-space-nowrap overflow-hidden  text-overflow-ellipsis"
          }
        >
          {Project.title}
        </div>
      }
      className={
        "text-center relative mx-2 h-25rem Merriweather flex flex-column justify-content-between"
      }
      header={header}
      footer={footer}
    ></Card>
  );
}
