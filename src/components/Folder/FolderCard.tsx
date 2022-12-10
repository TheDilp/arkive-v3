import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  isFolder: boolean;
  icon: string;
};

export default function FolderCard({ id, title, isFolder, icon }: Props) {
  const { type } = useParams();
  return (
    <Link to={`../${type}/${id}`}>
      <div className="flex h-36 w-36 cursor-pointer flex-col items-center justify-between px-4 py-2 transition-colors hover:text-blue-300">
        <Icon fontSize={80} icon={isFolder ? "mdi:folder" : icon} />
        <h3 className="text-center text-lg">{title}</h3>
      </div>
    </Link>
  );
}
