import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useAtom } from "jotai";
import { MutableRefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DrawerAtom, SidebarTreeContextAtom } from "../../utils/atoms";
import { TreeDataType } from "../../types/treeTypes";
import { useUpdateMutation } from "../../CRUD/DocumentCRUD";
import { AvailableItemTypes } from "../../types/generalTypes";
import { IconSelect } from "../IconSelect/IconSelect";
type Props = {
  node: NodeModel<TreeDataType>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  cm: MutableRefObject<any>;
  type: AvailableItemTypes;
};

export default function TreeItem({
  node,
  depth,
  isOpen,
  onToggle,
  cm,
  type,
}: Props) {
  const { item_id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useAtom(SidebarTreeContextAtom);
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const updateMutation = useUpdateMutation(type);
  return (
    <div
      style={{ marginInlineStart: depth * 40 }}
      className="flex items-center py-1 cursor-pointer group max-w-20rem text-md hover:bg-sky-700 gap-x-1 "
      onClick={() => {
        // Navigate if not a folder
        if (!node.droppable) {
          navigate(`./wiki/doc/${node.id}`);
        } else {
          navigate(`folder/${node.id}`);
        }
      }}
      onContextMenu={(e) => {
        if (node.droppable)
          setText({
            data: node.data,
            type: "doc_folder",
          });
        else if (node.data?.template)
          setText({ data: node.data, type: "template" });
        else setText({ data: node.data, type: "document" });
        cm.current.show(e);
      }}>
      {node.droppable && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateMutation?.mutate({
              id: node.id as string,
              expanded: !isOpen,
            });

            onToggle();
          }}>
          {isOpen ? (
            <Icon icon="akar-icons:chevron-down" />
          ) : (
            <Icon icon="akar-icons:chevron-right" />
          )}
        </span>
      )}

      <span
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {node.droppable ? (
          <Icon icon="bxs:folder" inline={true} className="mr-1" />
        ) : (
          <IconSelect
            setIcon={(newIcon) =>
              updateMutation?.mutate({ id: node.id as string, icon: newIcon })
            }>
            <Icon
              icon={node.data?.icon as string}
              inline={true}
              className="rounded-full hover:bg-sky-400 selectableIcon"
            />
          </IconSelect>
        )}
      </span>

      <div
        className={`font-Lato flex items-center w-full ${
          node.id === item_id && "text-sky-400"
        }`}>
        <div className="w-full overflow-hidden white-space-nowrap text-overflow-ellipsis">
          {node.text}
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100">
          <Icon
            icon="material-symbols:edit-outline"
            color="white"
            onClick={(e) => {
              e.stopPropagation();
              setDrawer({
                id: node.id as string,
                type: "documents",
                show: true,
              });
            }}
          />
          <Icon icon="ic:outline-delete" color="white" />
        </div>
      </div>
    </div>
  );
}
