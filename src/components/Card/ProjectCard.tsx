import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { Card } from "primereact/card";
import { Tooltip as PrimeTooltip } from "primereact/tooltip";
import { Link } from "react-router-dom";

import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { baseURLS } from "../../types/CRUDenums";
import { PermissionCategoriesType } from "../../types/generalTypes";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { UserAtom } from "../../utils/Atoms/atoms";
import { checkIfCategoryAllowed, navItems } from "../../utils/uiUtils";
import DefaultTooltip from "../Tooltip/DefaultTooltip";
import { Tooltip } from "../Tooltip/Tooltip";

export default function ProjectCard({ id, image, title, members }: ProjectType) {
  const UserData = useAtomValue(UserAtom);
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
          const permission = members
            ?.find((member) => member.user_id === UserData?.id)
            ?.permissions.find((perm) => perm.project_id === id);
          const category = checkIfCategoryAllowed(
            permission ?? null,
            (navItem.tooltip === "Graphs" ? "Boards" : navItem.tooltip).toLowerCase() as PermissionCategoriesType,
          );
          return (
            <Link
              key={navItem.icon}
              className="flex flex-1 justify-center no-underline"
              to={category ? `../project/${id}/${navItem.navigate}` : "#"}>
              <PrimeTooltip
                content={navItem.tooltip.replace("_", " ")}
                position={index < 4 ? "top" : "bottom"}
                target={`#${navItem.tooltip.replace("_", "")}`}
              />
              <div
                className={`transition-color flex h-8 w-8 items-center justify-center rounded-full  ${
                  category ? "hover:text-sky-400" : "cursor-not-allowed text-zinc-700"
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
