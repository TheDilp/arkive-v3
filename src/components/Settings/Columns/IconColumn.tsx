import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../../types/generalTypes";
import { IconSelect } from "../../IconSelect/IconSelect";

export default function IconColumn<ItemType extends { id: string; icon: string; folder: boolean; iconColor?: string }>({
  id,
  icon,
  iconColor,
  folder,
  type,
}: ItemType & { type: AvailableItemTypes }) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const updateItemMutation = useUpdateItem<AllItemsType>(type, project_id as string);
  return (
    <div className="flex justify-center">
      <IconSelect
        disabled={folder}
        iconTypes={["general", "weather"]}
        setIcon={(newIcon) => {
          updateItemMutation?.mutate(
            { id, icon: newIcon },
            {
              onSuccess: () => queryClient.refetchQueries({ queryKey: ["allItems", project_id, type] }),
            },
          );
        }}>
        <Icon
          className={`rounded-full ${folder ? "" : "cursor-pointer hover:bg-sky-400"}`}
          color={iconColor || "#ffffff"}
          fontSize={24}
          icon={folder ? "mdi:folder" : icon || "mdi:file"}
          inline
        />
      </IconSelect>
    </div>
  );
}
