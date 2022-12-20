import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";

import { AvailableItemTypes } from "../../types/generalTypes";

type Props = {
  id: string;
  title: string;
  isFolder: boolean;
  icon: string;
  type: AvailableItemTypes;
};

const getCardURL = ({ id, isFolder, type }: { id: string; type: AvailableItemTypes; isFolder: boolean }) => {
  let finalURL = "";
  if (type) finalURL = finalURL.concat(`${type}/`);
  if (isFolder) finalURL = finalURL.concat("folder/");
  finalURL = finalURL.concat(id);
  return finalURL;
};

export default function FolderCard({ id, title, type, isFolder, icon }: Props) {
  const { project_id } = useParams();
  return (
    <Link to={`/project/${project_id}/${getCardURL({ isFolder, type, id })}`}>
      <div className="flex h-36 w-36 cursor-pointer flex-col items-center justify-between px-4 py-2 transition-colors hover:text-blue-300">
        <Icon fontSize={80} icon={isFolder ? "mdi:folder" : icon} />
        <h3 className="text-center text-lg">{title}</h3>
      </div>
    </Link>
  );
}
