import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import defaultImage from "../assets/DefaultProjectImage.jpg";
import { VariantsENUM } from "../types/ComponentEnums";
import { ProjectType } from "../types/projectTypes";
import Button from "./Button/Button";
export default function ProjectCard({ ...Project }: ProjectType) {
  const header = (
    <Link
      to={`/project/${Project.id}/wiki`}
      className="relative no-underline h-15rem"
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
    <div className="flex flex-wrap justify-content-between">
      <Link to={`../project/${Project.id}/wiki`} className="no-underline">
        {/* <Button
          label="Wiki"
          icon="pi pi-fw pi-file"
          iconPos="right"
          className="w-full p-button-outlined p-button-primary Lato"
        /> */}
        <Button
          icon="mdi:book-open-blank-variant"
          title="Wiki"
          variant={VariantsENUM.primary}
        />
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
        className="no-underline"
      >
        <Button
          title="Settings"
          icon="mdi:cog-outline"
          variant={VariantsENUM.secondary}
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
