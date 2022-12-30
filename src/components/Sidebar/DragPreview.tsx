import { Icon } from "@iconify/react";
import { DragLayerMonitorProps } from "@minoru/react-dnd-treeview";

import { AllItemsType } from "../../types/generalTypes";

type Props = {
  monitorProps?: DragLayerMonitorProps<AllItemsType>;
};

export default function DragPreview({ monitorProps }: Props) {
  if (!monitorProps) return null;
  return (
    <div className="border-round relative flex h-4 w-40 items-center justify-center truncate bg-blue-500 py-3 font-Lato">
      <Icon icon={`mdi:${monitorProps.item.droppable ? "folder" : "file"}`} />
      {monitorProps.item.text}
    </div>
  );
}
