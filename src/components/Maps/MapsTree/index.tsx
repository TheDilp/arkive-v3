import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Map } from "../../../custom-types";
import { useGetMaps } from "../../../utils/customHooks";

type Props = {};

export default function MapsTree({}: Props) {
  const { project_id } = useParams();
  const maps = useGetMaps(project_id as string);
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
  console.log(maps);
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
    <div className="w-2 bg-gray-800">
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
        onDrop={handleDrop}
        render={(node: NodeModel<Map>, { depth, isOpen, onToggle }) => (
          <div>{node.text}</div>
          // <ProjectTreeItem
          //   // @ts-ignore
          //   node={node}
          //   depth={depth}
          //   isOpen={isOpen}
          //   onToggle={onToggle}
          //   docId={docId}
          //   setDocId={setDocId}
          //   setDisplayDialog={setDisplayDialog}
          //   setIconSelect={setIconSelect}
          //   cm={cm}
          // />
        )}
      />
    </div>
  );
}
