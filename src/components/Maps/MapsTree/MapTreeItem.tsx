import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useNavigate, useParams } from "react-router-dom";
import { MapProps, mapItemDisplayDialogProps } from "../../../custom-types";
import { useUpdateMap } from "../../../utils/customHooks";
type Props = {
  mapId: string;
  setMapId: (mapId: string) => void;
  node: NodeModel<MapProps>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDisplayDialog: (displayDialog: mapItemDisplayDialogProps) => void;
  cm: any;
};

export default function MapTreeItem({
  node,
  mapId,
  setMapId,
  depth,
  isOpen,
  setDisplayDialog,
  onToggle,
  cm,
}: Props) {
  const { project_id } = useParams();
  const updateMapMutation = useUpdateMap(project_id as string);
  const navigate = useNavigate();
  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className="text-lg hover:bg-blue-700 py-1 cursor-pointer pl-2 flex"
      onClick={() => {
        if (!node.droppable) setMapId(node.id as string);
      }}
      onContextMenu={(e) => {
        cm.current.show(e);
        setDisplayDialog({
          id: node.id as string,
          title: node.text,
          folder: node.data?.folder || false,
          map_image: node.data?.map_image || {
            id: "",
            title: "",
            link: "",
            type: "Image",
          },
          parent: node.parent as string,
          depth,
          show: false,
        });
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
        <Icon icon={"mdi:map"} inline={true} className="mr-1" />
      )}
      <div
        className={`text-lg Lato w-10 ${
          mapId === node.id ? "text-primary" : ""
        }`}
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
        <div className="w-full  white-space-nowrap overflow-hidden text-overflow-ellipsis">
          {node.text}
        </div>
      </div>
    </div>
  );
}
