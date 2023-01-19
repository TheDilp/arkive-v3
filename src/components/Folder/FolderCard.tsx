import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { MutableRefObject } from "react";
import { Link, useParams } from "react-router-dom";

import { useSortMutation } from "../../CRUD/ItemsCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { AvailableItemTypes, DragItem } from "../../types/generalTypes";
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
  const sortItemsMutation = useSortMutation(project_id as string, type);
  return (
    <Link
      className="cursor-pointer"
      onContextMenu={(e) => {
        if (isFolder)
          setContextMenu({
            data: { id, title },
            type,
            folder: isFolder,
            template: false,
          });
        else setContextMenu({ data: { id, title }, type, folder: false, template: false });
        cm.current.show(e);
      }}
      onDragStart={(e) => {
        if (!isFolder) e.dataTransfer.setData("item_id", JSON.stringify({ id, image, title, type }));
      }}
      onDrop={(e) => {
        if (!isFolder) return;
        const data = e.dataTransfer.getData("item_id");
        if (data) {
          const parsedData: DragItem = JSON.parse(data);
          sortItemsMutation.mutate([{ id: parsedData.id, parentId: id, sort: 0 }]);
        }
      }}
      to={`/project/${project_id}/${getCardURL({ isFolder, type, id })}`}>
      <div className="flex h-36 w-36 cursor-pointer flex-col items-center justify-between px-4 py-2 transition-colors hover:text-blue-300">
        {image && !isFolder ? (
          <img alt={type} className="object-contain" src={`${baseURLS.baseImageHost}${image}`} />
        ) : (
          <Icon fontSize={150} icon={isFolder ? "mdi:folder" : icon} />
        )}

        <h3 className="text-center text-lg">{title}</h3>
      </div>
    </Link>
  );
}
