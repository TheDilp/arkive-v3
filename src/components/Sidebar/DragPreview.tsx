import { Icon } from "@iconify/react";

type Props = {
  text: string;
  droppable?: boolean;
};

export default function DragPreview({ text, droppable }: Props) {
  return (
    <div className="w-40 h-4 flex items-center justify-center py-3 relative truncate bg-blue-500 font-Lato border-round">
      <Icon icon={`mdi:${droppable ? "folder" : "file"}`} />
      {text}
    </div>
  );
}
