import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { MutableRefObject } from "react";
import { Link, useParams } from "react-router-dom";

import { baseURLS, getURLS } from "../../types/CRUDenums";
import { AvailableItemTypes } from "../../types/generalTypes";
import { SidebarTreeContextAtom } from "../../utils/Atoms/atoms";

type Props = {
  id: string;
  title: string;
  isFolder: boolean;
  icon: string;
  type: AvailableItemTypes;
  cm: MutableRefObject<any>;
  image?: string | null;
};

const getCardURL = ({ id, isFolder, type }: { id: string; type: AvailableItemTypes; isFolder: boolean }) => {
  let finalURL = "";
  if (type) finalURL = finalURL.concat(`${type}/`);
  if (isFolder) finalURL = finalURL.concat("folder/");
  finalURL = finalURL.concat(id);
  return finalURL;
};

export default function FolderCard({ id, title, type, isFolder, icon, image, cm }: Props) {
  const [, setContextMenu] = useAtom(SidebarTreeContextAtom);
  const { project_id } = useParams();
  return (
    <Link
      onContextMenu={(e) => {
        if (isFolder)
          setContextMenu({
            data: { id, title },
            type,
            folder: isFolder,
            template: false,
          });
        // else if (node.data && "template" in node.data && node.data?.template) {
        //   setContextMenu({ data: node.data, type, folder: false, template: true });
        // }
        else setContextMenu({ data: { id, title }, type, folder: false, template: false });
        cm.current.show(e);
      }}
      onDragStart={(e) => {
        if (!isFolder) e.dataTransfer.setData("item_id", JSON.stringify({ id, image, type }));
      }}
      to={`/project/${project_id}/${getCardURL({ isFolder, type, id })}`}>
      <div className="flex h-36 w-36 cursor-pointer flex-col items-center justify-between px-4 py-2 transition-colors hover:text-blue-300">
        {image && !isFolder ? (
          <img
            alt={type}
            className="object-contain"
            src={`${baseURLS.baseServer}${getURLS.getSingleImage}${project_id}/${image}`}
          />
        ) : (
          <Icon fontSize={80} icon={isFolder ? "mdi:folder" : icon} />
        )}

        <h3 className="text-center text-lg">{title}</h3>
      </div>
    </Link>
  );
}
