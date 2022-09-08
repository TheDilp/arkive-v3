import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { Link, useParams } from "react-router-dom";
import { TimelineType } from "../../../types/TimelineTypes";
import { useUpdateMap } from "../../../utils/customHooks";
type Props = {
  node: NodeModel<TimelineType>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  // setDisplayDialog: (displayDialog: MapItemDisplayDialogProps) => void;
  cm: any;
};

export default function TimelineTreeItem({
  node,
  // mapId,
  // setMapId,
  depth,
  isOpen,
  // setDisplayDialog,
  onToggle,
  cm,
}: Props) {
  const { project_id } = useParams();
  const updateMapMutation = useUpdateMap(project_id as string);
  return (
    <Link
      to={node.id as string}
      style={{ marginInlineStart: depth * 10 }}
      className="text-white text-md no-underline hover:bg-blue-700 py-1 cursor-pointer pl-2 flex align-items-center"
      onClick={() => {
        // if (!node.droppable) setMapId(node.id as string);
      }}
      onContextMenu={(e) => {
        cm.current.show(e);
        // setDisplayDialog({
        //   id: node.id as string,
        //   title: node.text,
        //   folder: node.data?.folder || false,
        //   map_image: node.data?.map_image || {
        //     id: "",
        //     title: "",
        //     link: "",
        //     type: "Image",
        //   },
        //   map_layers: node.data?.map_layers || [],
        //   parent: node.parent as string,
        //   depth,
        //   show: false,
        //   public: node.data?.public || false,
        // });
      }}
    >
      {node.droppable && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateMapMutation.mutate({
              id: node.id as string,
              expanded: !isOpen,
            });
            onToggle();
          }}
        >
          {isOpen ? (
            <Icon icon="akar-icons:chevron-down" />
          ) : (
            <Icon icon="akar-icons:chevron-right" />
          )}
        </span>
      )}
      {node.droppable ? (
        <Icon icon="bxs:folder" inline={true} className="mr-1" />
      ) : (
        <Icon icon={"mdi:chart-timeline-variant"} inline={true} className="mr-1" />
      )}
      <div
        className={`Lato w-10 ${"mapId" === node.id ? "text-primary" : ""}`}
        onClick={(e) => {
          if (node.droppable) {
            e.preventDefault();
            e.stopPropagation();
            updateMapMutation.mutate({
              id: node.id as string,
              expanded: !isOpen,
            });
            onToggle();
          }
        }}
      >
        <div className="w-full white-space-nowrap overflow-hidden text-overflow-ellipsis">
          {node.text}
        </div>
      </div>
    </Link>
  );
}
