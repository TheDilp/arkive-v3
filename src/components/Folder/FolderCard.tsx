import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  isFolder: boolean;
  icon: string;
};

const getCardURL = ({ id, isFolder, type }: { id: string; isFolder: boolean; type: string | undefined }) => {
  let finalURL = "";
  if (isFolder) finalURL = finalURL.concat("folder/");

  if (type) finalURL = finalURL.concat(`${type}/`);
  finalURL = finalURL.concat(id);
  return finalURL;
};

export default function FolderCard({ id, title, isFolder, icon }: Props) {
  const { type } = useParams();
  return (
    <Link to={`../${getCardURL({ isFolder, type, id })}`}>
      <div className="flex h-36 w-36 cursor-pointer flex-col items-center justify-between px-4 py-2 transition-colors hover:text-blue-300">
        <Icon fontSize={80} icon={isFolder ? "mdi:folder" : icon} />
        <h3 className="text-center text-lg">{title}</h3>
      </div>
    </Link>
  );
}
