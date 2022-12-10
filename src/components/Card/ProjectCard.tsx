import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link } from "react-router-dom";

import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { ProjectType } from "../../types/projectTypes";
import { buttonLabelWithIcon } from "../../utils/transform";

export default function ProjectCard({ ...project }: ProjectType) {
  const header = (
    <Link className="relative h-60 no-underline" to={`/project/${project.id}/documents`}>
      <img alt="Card" className="h-full w-full cursor-pointer" src={defaultImage} style={{ objectFit: "fill" }} />
    </Link>
  );
  const footer = (
    <div className="flex flex-wrap justify-between">
      <Link className="no-underline" to={`../project/${project.id}/documents`}>
        <Button className="p-button-outlined p-button-primary w-full font-Lato">
          {buttonLabelWithIcon("Wiki", "mdi:files")}
        </Button>
      </Link>
      {/* <Link to={`../project/${Project.id}/maps`} className="w-4 no-underline">
        <Button
          // label="Maps"
          icon="pi pi-fw pi-map"
          iconPos="right"
          className="p-button-outlined p-button-primary Lato"
        />
      </Link>
      <Link to={`../project/${Project.id}/boards`} className="w-4 no-underline">
        <Button
          // label="Boards"
          icon={() => (
            <Icon
              className="cursor-pointer hover:text-primary "
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
        className="w-4 no-underline"
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

      <Link className="no-underline" to={`/project/${project.id}/settings/project-settings`}>
        <Button className="p-button-outlined p-button-secondary w-full font-Lato">
          {buttonLabelWithIcon("Settings", "mdi:cog")}
        </Button>
      </Link>
    </div>
  );
  return (
    <Card
      className="h-25rem Merriweather mx-2 flex w-80 flex-col justify-between text-center"
      footer={footer}
      header={header}
      title={<div className="font-Merriweather">{project.title}</div>}
    />
  );
}
