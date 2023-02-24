import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { MutableRefObject } from "react";
import { Link, useParams } from "react-router-dom";

import { useSortMutation } from "../../CRUD/ItemsCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { AvailableItemTypes, BoardDragItemType } from "../../types/generalTypes";
import { SidebarTreeContextAtom } from "../../utils/Atoms/atoms";

type Props = {
  id: string;
  title: string;
  isFolder: boolean;
  isPublic: boolean;
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

export default function FolderCard({ id, title, type, isFolder, isPublic, icon, image, cm }: Props) {
  const [, setContextMenu] = useAtom(SidebarTreeContextAtom);
  const { project_id } = useParams();
  const sortItemsMutation = useSortMutation(project_id as string, type);
  return (
    <Link
      className="h-24 max-h-24 min-h-[6rem] cursor-pointer"
      onContextMenu={(e) => {
        if (isFolder)
          setContextMenu({
            data: { id, title, isPublic },
            type,
            folder: isFolder,
            template: false,
          });
        else setContextMenu({ data: { id, title, isPublic }, type, folder: false, template: false });
        cm.current.show(e);
      }}
      onDragStart={(e) => {
        if (!isFolder) e.dataTransfer.setData("item_id", JSON.stringify({ id, image, title, type }));
      }}
      onDrop={(e) => {
        if (!isFolder) return;
        const data = e.dataTransfer.getData("item_id");
        if (data) {
          const parsedData: BoardDragItemType = JSON.parse(data);
          sortItemsMutation.mutate([{ id: parsedData.id, parentId: id, sort: 0 }]);
        }
      }}
      to={`/project/${project_id}/${getCardURL({ isFolder, type, id })}`}>
      <div className="flex h-24 w-40 cursor-pointer flex-col items-center justify-center px-4 transition-colors hover:text-blue-300">
        {image && !isFolder ? (
          <img alt={type} className="max-h-[70px] object-contain" src={`${baseURLS.baseImageHost}${image}`} />
        ) : (
          <Icon fontSize={80} icon={isFolder ? "mdi:folder" : icon} />
        )}

        <h3 className="w-full max-w-full truncate text-center text-lg">{title}</h3>
      </div>
    </Link>
  );
}
