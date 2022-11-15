import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useAtom } from "jotai";
import { MutableRefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DrawerAtom, SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { TreeDataType } from "../../types/treeTypes";
import { useDeleteMutation, useUpdateMutation } from "../../CRUD/DocumentCRUD";
import { AvailableItemTypes } from "../../types/generalTypes";
import { IconSelect } from "../IconSelect/IconSelect";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { toaster } from "../../utils/toast";
type Props = {
  node: NodeModel<TreeDataType>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  cm: MutableRefObject<any>;
  type: AvailableItemTypes;
};

export default function TreeItem({ node, depth, isOpen, onToggle, cm, type }: Props) {
  const { item_id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useAtom(SidebarTreeContextAtom);
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const updateMutation = useUpdateMutation(type);
  const deleteMutation = useDeleteMutation(type);
  return (
    <div
      style={{ marginInlineStart: depth * 40 }}
      className="flex items-center py-1 cursor-pointer group max-w-20rem text-md hover:bg-sky-700 gap-x-1 "
      onClick={() => {
        // Navigate if not a folder
        if (!node.data?.folder) {
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
        else if (node.data?.template) setText({ data: node.data, type: "template" });
        else setText({ data: node.data, type: "document" });
        cm.current.show(e);
      }}>
      {node.droppable && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateMutation?.mutate({
              expanded: !isOpen,
              id: node.id as string,
            });

            onToggle();
          }}>
          {isOpen ? <Icon icon="akar-icons:chevron-down" /> : <Icon icon="akar-icons:chevron-right" />}
        </span>
      )}

      <span
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {node.data?.folder ? (
          <Icon icon="bxs:folder" inline={true} className="mr-1" />
        ) : (
          <IconSelect setIcon={(newIcon) => updateMutation?.mutate({ icon: newIcon, id: node.id as string })}>
            <Icon
              icon={node.data?.icon as string}
              inline={true}
              className="rounded-full hover:bg-sky-400 selectableIcon"
            />
          </IconSelect>
        )}
      </span>

      <div className={`font-Lato flex items-center w-full ${node.id === item_id && "text-sky-400"}`}>
        <div className="w-full overflow-hidden white-space-nowrap text-overflow-ellipsis">
          {node.text} {node.data?.template && !node.droppable ? "[TEMPLATE]" : null}
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100">
          <Icon
            icon="material-symbols:edit-outline"
            color="white"
            onClick={(e) => {
              e.stopPropagation();
              setDrawer({
                exceptions: {},
                id: node.id as string,
                position: "right",
                show: true,
                type: "documents",
              });
            }}
          />
          <Icon
            icon="ic:outline-delete"
            color="white"
            onClick={(e) => {
              e.stopPropagation();
              deleteItem(
                "Are you sure you want to delete this item?",
                () => deleteMutation?.mutate(node.id as string),
                () => toaster("info", "Item not deleted."),
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
