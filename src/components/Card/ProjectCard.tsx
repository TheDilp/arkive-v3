import { Icon } from "@iconify/react";
import { Card } from "primereact/card";
import { Tooltip } from "primereact/tooltip";
import { Link } from "react-router-dom";

import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { baseURLS } from "../../types/CRUDenums";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { navItems } from "../../utils/uiUtils";

export default function ProjectCard({ id, image, title }: ProjectType) {
  const header = (
    <Link className="relative h-60 no-underline" to={`/project/${id}/documents`}>
      <img
        alt="Card"
        className="h-60 w-full cursor-pointer"
        src={image ? `${baseURLS.baseImageHost.concat(image)}` : defaultImage}
        style={{ objectFit: "fill" }}
      />
    </Link>
  );
  const footer = (
    <div className="flex flex-wrap justify-between gap-2">
      {navItems
        .filter((_, index) => index !== 0)
        .map((navItem) => (
          <Link key={navItem.icon} className="flex-1 no-underline" to={`../project/${id}/${navItem.navigate}`}>
            <Tooltip
              content={navItem.tooltip.replace("_", " ")}
              position="bottom"
              target={`#${navItem.tooltip.replace("_", "")}`}
            />
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-sky-400"
              id={navItem.tooltip.replace("_", "")}>
              <Icon fontSize={30} icon={navItem.icon} />
            </div>
          </Link>
        ))}
    </div>
  );
  return (
    <Card
      className="Merriweather projectCard mx-2 flex h-[25rem] w-80 flex-col justify-between rounded-md border border-zinc-700 text-center shadow-sm"
      footer={footer}
      header={header}
      title={<div className="font-Merriweather">{title}</div>}
    />
  );
}
