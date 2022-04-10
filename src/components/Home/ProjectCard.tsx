import { Link } from "react-router-dom";
import { Project } from "../../custom-types";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
export default function ProjectCard({ ...Project }: Project) {
  const header = (
    <Link to={`/project/${Project.id}/wiki`} className="no-underline">
      <img
        alt="Card"
        src={Project.cardImage}
        style={{ objectFit: "cover" }}
        className="w-full h-15rem cursor-pointer"
      />
    </Link>
  );
  const footer = (
    <div className="flex justify-content-between">
      <Link to={`/project/${Project.id}/wiki`} className="no-underline">
        <Button
          label="Wiki"
          icon="pi pi-fw pi-file"
          iconPos="right"
          className="p-button-outlined p-button-primary"
        />
      </Link>
      <Link to={`/project/${Project.id}/settings`} className="no-underline">
        <Button
          label="Settings"
          icon="pi pi-fw pi-cog"
          iconPos="right"
          className="p-button-outlined p-button-secondary"
        />
      </Link>
    </div>
  );
  return (
    <Card
      title={Project.title}
      className="text-center relative w-3 mx-2 h-full overflow-hidden"
      header={header}
      footer={footer}
    ></Card>
  );
}
