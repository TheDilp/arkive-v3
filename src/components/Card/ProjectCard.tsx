import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { Card } from "primereact/card";
import { Tooltip as PrimeTooltip } from "primereact/tooltip";
import { Link } from "react-router-dom";

import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { baseURLS } from "../../types/CRUDenums";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { UserAtom } from "../../utils/Atoms/atoms";
import { toaster } from "../../utils/toast";
import { checkItemPermission, navItems } from "../../utils/uiUtils";
import DefaultTooltip from "../Tooltip/DefaultTooltip";
import { Tooltip } from "../Tooltip/Tooltip";

export default function ProjectCard({ id, image, title, roles, owner_id }: ProjectType) {
  const UserData = useAtomValue(UserAtom);
  const userRole = roles?.[0];

  const header = (
    <Link className="relative h-60 no-underline" to={`/project/${id}`}>
      <img
        alt="Card"
        className="h-60 w-full cursor-pointer"
        src={image ? `${baseURLS.baseImageHost.concat(image)}` : defaultImage}
        style={{ objectFit: "fill" }}
      />
    </Link>
  );
  const footer = (
    <div className="grid grid-cols-4 gap-y-2">
      {navItems
        .filter((_, index) => index !== 0)
        .map((navItem, index) => {
          const itemPermission = checkItemPermission(navItem.tooltip.toLowerCase(), userRole, UserData?.id === owner_id);
          return (
            <Link
              key={navItem.icon}
              className="flex flex-1 justify-center no-underline"
              onClick={() => {
                if (!itemPermission) toaster("error", "You do not have viewing or editing permissions for this category.");
              }}
              to={itemPermission ? `../project/${id}/${navItem.navigate}` : "#"}>
              <PrimeTooltip
                content={navItem.tooltip.replace("_", " ")}
                position={index < 4 ? "top" : "bottom"}
                target={`#${navItem.tooltip.replace("_", "")}`}
              />
              <div
                className={`transition-color flex h-8 w-8 items-center justify-center rounded-full  ${
                  itemPermission ? "hover:text-sky-400" : "cursor-not-allowed text-zinc-700"
                }`}
                id={navItem.tooltip.replace("_", "")}>
                <Icon fontSize={42} icon={navItem.icon} />
              </div>
            </Link>
          );
        })}
    </div>
  );
  return (
    <Card
      className="Merriweather projectCard mx-2 flex h-[25rem] w-80 flex-col justify-between rounded-md border border-zinc-700 text-center shadow-sm"
      footer={footer}
      header={header}
      title={
        <Tooltip content={<DefaultTooltip>{title}</DefaultTooltip>}>
          <div className="truncate font-Merriweather">{title}</div>
        </Tooltip>
      }
    />
  );
}
