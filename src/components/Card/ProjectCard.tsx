import { Button } from "primereact/button";
import { buttonLabelWithIcon } from "../../utils/transform";
import { Card } from "primereact/card";
import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { Link } from "react-router-dom";
import { ProjectType } from "../../types/projectTypes";
export default function ProjectCard({ ...Project }: ProjectType) {
  const header = (
    <Link
      to={`/project/${Project.id}/wiki`}
      className="relative no-underline h-60">
      <img
        alt="Card"
        src={defaultImage}
        style={{ objectFit: "fill" }}
        className="w-full h-full cursor-pointer"
      />
    </Link>
  );
  const footer = (
    <div className="flex flex-wrap justify-between">
      <Link to={`../project/${Project.id}/wiki`} className="no-underline">
        <Button className="w-full p-button-outlined p-button-primary font-Lato">
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

      <Link
        to={`/project/${Project.id}/settings/project-settings`}
        className="no-underline">
        <Button className="w-full p-button-outlined p-button-secondary font-Lato">
          {buttonLabelWithIcon("Settings", "mdi:cog")}
        </Button>
      </Link>
    </div>
  );
  return (
    <Card
      title={<div className="font-Merriweather">{Project.title}</div>}
      className="flex flex-col justify-between mx-2 text-center h-25rem Merriweather w-80"
      header={header}
      footer={footer}></Card>
  );
}
