import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useLayoutEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Map } from "../../../custom-types";
import MapTreeItem from "./MapTreeItem";

type Props = {};

export default function MapsTree({}: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const maps: Map[] | undefined = queryClient.getQueryData(
    `${project_id}-maps`
  );
  const [treeData, setTreeData] = useState<NodeModel<Map>[]>([]);
  useLayoutEffect(() => {
    if (maps && maps.length > 0) {
      let temp = maps.map((m) => ({
        id: m.id,
        parent: "0",
        text: m.title,
        data: {
          ...m,
        },
      }));
      setTreeData(temp);
    }
  }, [maps]);
  const handleDrop = (
    newTree: NodeModel<Map>[],
    {
      dragSourceId,
      dropTargetId,
    }: { dragSourceId: string; dropTargetId: string }
  ) => {
    // Set the user's current view to the new tree
    setTreeData(newTree);
  };

  return (
    <div
      className="w-2 bg-gray-800 text-white"
      style={{
        height: "96vh",
      }}
    >
      <Tree
        classes={{
          root: "w-full overflow-y-auto projectTreeRoot",
          container: "list-none",
          placeholder: "relative",
        }}
        tree={treeData}
        rootId={"0"}
        sort={false}
        initialOpen={false}
        render={(node: NodeModel<Map>, { depth, isOpen, onToggle }) => (
          <MapTreeItem
            node={node}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        )}
        //@ts-ignore
        onDrop={handleDrop}
      />
    </div>
  );
}
