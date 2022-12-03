import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useAtom } from "jotai";
import { MutableRefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDeleteMutation, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { AvailableItemTypes } from "../../types/generalTypes";
import { TreeDataType } from "../../types/treeTypes";
import { DrawerAtom, SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { toaster } from "../../utils/toast";
import { IconSelect } from "../IconSelect/IconSelect";

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
  const [, setContextMenu] = useAtom(SidebarTreeContextAtom);
  const [, setDrawer] = useAtom(DrawerAtom);
  const updateMutation = useUpdateItem(type);
  const deleteMutation = useDeleteMutation(type);
  if (!node.data) return null;
  return (
    <button
      className="text-md group inline-flex w-full cursor-pointer items-center gap-x-1 py-1 text-left hover:bg-sky-700"
      onClick={() => {
        // Navigate if not a folder
        if (!node.data?.folder) {
          if (type === "documents") navigate(`./wiki/doc/${node.id}`);
          if (type === "maps") navigate(`./maps/${node.id}`);
          if (type === "boards") navigate(`./boards/${node.id}`);
        } else {
          navigate(`folder/${node.id}`);
        }
      }}
      onContextMenu={(e) => {
        if (node.droppable)
          setContextMenu({
            data: node.data,
            type: "doc_folder",
          });
        else if (node.data && "template" in node.data && node.data?.template) {
          setContextMenu({ data: node.data, type: "template" });
        } else setContextMenu({ data: node.data, type });
        cm.current.show(e);
      }}
      type="button">
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
          }}
          onKeyDown={() => {}}
          role="button"
          tabIndex={-1}>
          {isOpen ? <Icon icon="akar-icons:chevron-down" /> : <Icon icon="akar-icons:chevron-right" />}
        </span>
      )}

      <span
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={() => {}}
        role="button"
        style={{ marginInlineStart: depth * 40 }}
        tabIndex={-1}>
        {node.data?.folder ? (
          <Icon className="mr-1" icon="bxs:folder" inline />
        ) : (
          <IconSelect
            disabled={type !== "documents"}
            setIcon={(newIcon) => updateMutation?.mutate({ icon: newIcon, id: node.id as string })}>
            <Icon
              className={`rounded-full ${type === "documents" ? "hover:bg-sky-400" : ""}`}
              icon={
                ("icon" in node.data && (node.data?.icon as string)) ||
                (type === "maps" && "mdi:map") ||
                (type === "boards" && "mdi:draw") ||
                (type === "timelines" && "mdi:file") ||
                "mdi:file"
              }
              inline
            />
          </IconSelect>
        )}
      </span>

      <div className={`flex w-full items-center font-Lato ${node.id === item_id && "text-sky-400"}`}>
        <div className="white-space-nowrap text-overflow-ellipsis w-full overflow-hidden">
          {node.text} {"template" in node.data && node.data?.template && !node.droppable ? "[TEMPLATE]" : null}
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100">
          <Icon
            color="white"
            icon="material-symbols:edit-outline"
            onClick={(e) => {
              e.stopPropagation();
              setDrawer({
                exceptions: {},
                id: node.id as string,
                position: "right",
                show: true,
                type,
              });
            }}
          />
          <Icon
            color="white"
            icon="ic:outline-delete"
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
    </button>
  );
}
