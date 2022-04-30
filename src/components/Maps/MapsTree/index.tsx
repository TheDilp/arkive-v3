import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { Button } from "primereact/button";
import { useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Map, mapItemDisplayDialog } from "../../../custom-types";
import { useCreateMap, useUpdateMap } from "../../../utils/customHooks";
import MapCreateDialog from "./MapCreateDialog";
import MapTreeItem from "./MapTreeItem";
import { v4 as uuid } from "uuid";
import DragPreview from "../../Project/DocumentTree/DragPreview";
import { getDepth } from "../../../utils/utils";
import MapTreeItemContext from "./MapTreeItemContext";
import MapUpdateDialog from "./MapUpdateDialog";

export default function MapsTree({
  mapId,
  setMapId,
}: {
  mapId: string;
  setMapId: (mapId: string) => void;
}) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const cm = useRef() as any;
  const maps: Map[] | undefined = queryClient.getQueryData(
    `${project_id}-maps`
  );
  const [treeData, setTreeData] = useState<NodeModel<Map>[]>([]);
  const [createMapDialog, setCreateMapDialog] = useState(false);
  const [updateMapDialog, setUpdateMapDialog] = useState<mapItemDisplayDialog>({
    id: "",
    title: "",
    map_image: "",
    parent: "",
    show: false,
    folder: false,
    depth: 0,
  });
  const createMapMutation = useCreateMap();
  const updateMapMutation = useUpdateMap(project_id as string);
  useLayoutEffect(() => {
    if (maps && maps.length > 0) {
      let temp = maps.map((m) => ({
        id: m.id,
        parent: m.parent || "0",
        text: m.title,
        droppable: m.folder,
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
    updateMapMutation.mutate({ id: dragSourceId, parent: dropTargetId });
  };

  return (
    <div
      className="w-2 bg-gray-800 text-white pt-2 px-2"
      style={{
        height: "96vh",
      }}
    >
      <MapTreeItemContext
        cm={cm}
        mapId={mapId}
        displayDialog={updateMapDialog}
        setDisplayDialog={setUpdateMapDialog}
      />
      <MapCreateDialog
        visible={createMapDialog}
        setVisible={() => setCreateMapDialog(false)}
      />
      {updateMapDialog.show && (
        <MapUpdateDialog
          visible={updateMapDialog}
          setVisible={() =>
            setUpdateMapDialog({
              id: "",
              title: "",
              map_image: "",
              parent: "",
              show: false,
              folder: false,
              depth: 0,
            })
          }
        />
      )}
      <div className="w-full py-1 flex justify-content-between">
        <Button
          label="New Folder"
          icon="pi pi-fw pi-folder"
          iconPos="right"
          className="p-button-outlined"
          onClick={() => {
            let id = uuid();
            createMapMutation.mutate({
              id,
              project_id: project_id as string,
              title: "New Folder",
              map_image: "",
              folder: true,
            });
          }}
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
            setDisplayDialog={setUpdateMapDialog}
            cm={cm}
          />
        )}
        dragPreviewRender={(monitorProps) => (
          <DragPreview
            text={monitorProps.item.text}
            droppable={monitorProps.item.droppable}
          />
        )}
        placeholderRender={(node, { depth }) => (
          <div
            style={{
              top: 0,
              right: 0,
              left: depth * 24,
              backgroundColor: "#1967d2",
              height: "2px",
              position: "absolute",
              transform: "translateY(-50%)",
            }}
          ></div>
        )}
        dropTargetOffset={10}
        canDrop={(tree, { dragSource, dropTargetId }) => {
          const depth = getDepth(treeData, dropTargetId);
          // Don't allow nesting documents beyond this depth
          if (depth > 3) return false;
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        //@ts-ignore
        onDrop={handleDrop}
      />
    </div>
  );
}
