import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { Button } from "primereact/button";
import { useLayoutEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Map } from "../../../custom-types";
import MapCreateDialog from "./MapCreateDialog";
import MapTreeItem from "./MapTreeItem";
type Props = {};

export default function MapsTree({}: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const maps: Map[] | undefined = queryClient.getQueryData(
    `${project_id}-maps`
  );
  const [treeData, setTreeData] = useState<NodeModel<Map>[]>([]);
  const [createMapDialog, setCreateMapDialog] = useState(false);
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
      className="w-2 bg-gray-800 text-white pt-2 px-2"
      style={{
        height: "96vh",
      }}
    >
      <MapCreateDialog
        visible={createMapDialog}
        setVisible={() => setCreateMapDialog(false)}
      />
      <div className="w-full py-1 flex justify-content-between">
        <Button
          label="New Folder"
          icon="pi pi-fw pi-folder"
          iconPos="right"
          className="p-button-outlined"
        />
        <Button
          label="New Map"
          icon="pi pi-fw pi-map"
          iconPos="right"
          className="p-button-outlined"
          onClick={() => setCreateMapDialog(true)}
        />
      </div>
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
