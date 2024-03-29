import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useAtomValue, useSetAtom } from "jotai";
import { MutableRefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDeleteItem, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes, RolePermissionsType } from "../../types/generalTypes";
import { DrawerAtom, PendingUpdatesAtom, RoleAtom, SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { setItem } from "../../utils/storage";
import { toaster } from "../../utils/toast";
import { IconSelect } from "../IconSelect/IconSelect";

type Props = {
  node: NodeModel<AllItemsType>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  cm: MutableRefObject<any>;
  type: AvailableItemTypes;
};

export default function TreeItem({ node, depth, isOpen, onToggle, cm, type }: Props) {
  const { project_id, item_id } = useParams();
  const navigate = useNavigate();
  const setContextMenu = useSetAtom(SidebarTreeContextAtom);
  const setDrawer = useSetAtom(DrawerAtom);
  const pendingUpdates = useAtomValue(PendingUpdatesAtom);
  const updateMutation = useUpdateItem<AllItemsType>(type, project_id as string);
  const deleteMutation = useDeleteItem(type, project_id as string);
  const UserRole = useAtomValue(RoleAtom);
  const isAllowed = UserRole?.[`edit_${type}` as RolePermissionsType];
  if (!node.data) return null;
  return (
    <button
      className="group inline-flex w-full cursor-pointer items-center gap-x-1 py-1 text-left text-base hover:bg-sky-700"
      onClick={() => {
        if (pendingUpdates) {
          toaster("warning", "Please wait for autosave to the document finish or save manually with CTRL/CMD + S.");
          return;
        }
        // Navigate if not a folder
        if (!node.data?.folder) navigate(`./${type}/${node.id}`);
        else navigate(`./${type}/folder/${node.id}`);
      }}
      onContextMenu={(e) => {
        if (node.droppable && isAllowed)
          setContextMenu({
            data: node.data,
            type,
            folder: node.droppable,
            template: false,
          });
        else if (node.data && "template" in node.data && node.data?.template && isAllowed) {
          setContextMenu({ data: node.data, type, folder: false, template: true });
        } else if (isAllowed) setContextMenu({ data: node.data, type, folder: false, template: false });
        if (isAllowed) cm.current.show(e);
      }}
      type="button">
      <span
        className="flex items-center gap-x-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={() => {}}
        role="button"
        style={{ marginInlineStart: depth * 40 }}
        tabIndex={-1}>
        {node.droppable && (
          <span
            onClick={(e) => {
              // Toggle expanded state for the folders
              e.preventDefault();
              e.stopPropagation();
              let expandedItems = JSON.parse(localStorage.getItem(`${type}-expanded`) || "[]");
              if (isOpen) expandedItems = expandedItems.filter((item: string) => item !== node.id);
              else expandedItems.push(node.id);
              setItem(`${type}-expanded`, expandedItems);

              onToggle();
            }}
            onKeyDown={() => {}}
            role="button"
            tabIndex={-1}>
            {isOpen ? <Icon icon="akar-icons:chevron-down" /> : <Icon icon="akar-icons:chevron-right" />}
          </span>
        )}
        {node.data?.folder ? (
          <Icon className="mr-1" icon="bxs:folder" inline />
        ) : (
          <IconSelect
            iconTypes={["general", "weather"]}
            setIcon={(newIcon) => {
              updateMutation?.mutate(
                { icon: newIcon, id: node.id as string },
                {
                  onSuccess: () => {
                    toaster("success", "Icon updated successfully.");
                  },
                },
              );
            }}>
            <Icon
              className={`rounded-full ${type === "documents" ? "hover:bg-sky-400" : ""}`}
              icon={"icon" in node.data ? (node.data?.icon as string) : IconEnum.document}
              inline
            />
          </IconSelect>
        )}
      </span>

      <div className={`flex w-full items-center font-Lato ${node.id === item_id && "text-sky-400"}`}>
        <div className="w-full truncate">
          {node.text} {"template" in node.data && node.data?.template && !node.droppable ? "[TEMPLATE]" : null}
        </div>
        {isAllowed ? (
          <div className="flex items-center opacity-0 group-hover:opacity-100">
            <Icon
              color="white"
              icon={IconEnum.edit}
              onClick={(e) => {
                e.stopPropagation();
                if (isAllowed)
                  setDrawer({
                    exceptions: {},
                    id: node.id as string,
                    data: node.data,
                    position: "right",
                    show: true,
                    type,
                  });
              }}
            />
            <Icon
              color="white"
              icon={IconEnum.trash}
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(
                  "Are you sure you want to delete this item?",
                  () => {
                    deleteMutation?.mutate(node.id as string);
                    if (item_id === node.id) navigate(`./${type}`);
                  },
                  () => toaster("info", "Item not deleted."),
                );
              }}
            />
          </div>
        ) : null}
      </div>
    </button>
  );
}
