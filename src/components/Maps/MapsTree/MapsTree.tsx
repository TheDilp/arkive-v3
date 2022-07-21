import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { MapItemDisplayDialogProps, MapProps } from "../../../types/MapTypes";
import { useGetMaps, useUpdateMap } from "../../../utils/customHooks";
import { MapDialogDefault } from "../../../utils/defaultDisplayValues";
import { sortMapsChildren } from "../../../utils/supabaseUtils";
import { getDepth } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import TreeSidebar from "../../Util/TreeSidebar";
import DragPreview from "../../Wiki/DocumentTree/DragPreview";
import MapCreateDialog from "./MapDialogs/MapCreateDialog";
import MapsFilter from "./MapsFilter";
import MapTreeItem from "./MapTreeItem";
import MapTreeItemContext from "./MapTreeItemContext";
import MapUpdateDialog from "./MapDialogs/MapUpdateDialog";
import MapLayersDialog from "./MapDialogs/MapLayersDialog";

export default function MapsTree({
  mapId,
  setMapId,
}: {
  mapId: string;
  setMapId: (mapId: string) => void;
}) {
  const { project_id } = useParams();
  const cm = useRef() as any;
  const { data: maps }: { data: MapProps[] | undefined } = useGetMaps(
    project_id as string
  );
  const { isTabletOrMobile } = useContext(MediaQueryContext);
  const [filter, setFilter] = useState("");
  const [treeData, setTreeData] = useState<NodeModel<MapProps>[]>([]);
  const [createMapDialog, setCreateMapDialog] = useState(false);
  const [updateMapDialog, setUpdateMapDialog] =
    useState<MapItemDisplayDialogProps>(MapDialogDefault);
  const [updateMapLayers, setUpdateMapLayers] = useState({
    map_id: "",
    show: false,
  });
  const updateMapMutation = useUpdateMap(project_id as string);

  useEffect(() => {
    if (maps) {
      if (filter) {
        const timeout = setTimeout(() => {
          setTreeData(
            maps
              .filter(
                (map) =>
                  !map.folder &&
                  map.title.toLowerCase().includes(filter.toLowerCase())
              )
              .map((m) => ({
                id: m.id,
                parent: "0",
                text: m.title,
                droppable: m.folder,
                data: m,
              }))
          );
        }, 300);
        return () => clearTimeout(timeout);
      } else {
        setTreeData(
          maps.map((m) => ({
            id: m.id,
            parent: m.parent?.id || "0",
            text: m.title,
            droppable: m.folder,
            data: m,
          }))
        );
      }
    } else {
      setTreeData([]);
    }
  }, [maps, filter]);

  const handleDrop = async (
    newTree: NodeModel<MapProps>[],
    {
      dragSourceId,
      dragSource,
      dropTargetId,
    }: {
      dragSourceId: string;
      dragSource: NodeModel<MapProps>;
      dropTargetId: string;
    }
  ) => {
    // Set the user's current view to the new tree
    setTreeData(newTree);

    let indexes = newTree
      .filter(
        (map) =>
          map.data?.parent?.id === dropTargetId ||
          (map.data?.parent?.id === undefined && dropTargetId === "0")
      )
      .map((map, index) => {
        return { id: map.id as string, sort: index };
      });
    // SAFEGUARD: If parent is the same, avoid unneccesary update
    if (dragSource.data?.parent?.id !== dropTargetId)
      await updateMapMutation.mutateAsync({
        id: dragSourceId,
        parent: dropTargetId === "0" ? null : dropTargetId,
      });
    sortMapsChildren(indexes);
  };

  return (
    <div
      className={` text-white pt-2 px-2 ${
        isTabletOrMobile ? "surface-0 hidden" : "surface-50 w-2"
      }`}
      style={{
        height: "96vh",
      }}
    >
      <MapTreeItemContext
        cm={cm}
        mapId={mapId}
        displayDialog={updateMapDialog}
        setDisplayDialog={setUpdateMapDialog}
        setUpdateMapLayers={setUpdateMapLayers}
      />
      <MapCreateDialog
        mapData={createMapDialog}
        setMapData={() => setCreateMapDialog(false)}
      />

      <MapUpdateDialog
        mapData={updateMapDialog}
        setMapData={setUpdateMapDialog}
      />
      <MapLayersDialog
        visible={updateMapLayers}
        setVisible={setUpdateMapLayers}
      />
      <TreeSidebar>
        <MapsFilter
          setCreateMapDialog={setCreateMapDialog}
          filter={filter}
          setFilter={setFilter}
        />
        <Tree
          classes={{
            root: "w-full overflow-y-auto projectTreeRoot p-0",
            container: "list-none",
            placeholder: "relative",
          }}
          tree={treeData}
          rootId={"0"}
          sort={true}
          insertDroppableFirst={true}
          initialOpen={
            maps?.filter((map) => map.expanded).map((map) => map.id) || false
          }
          render={(node: NodeModel<MapProps>, { depth, isOpen, onToggle }) => (
            <MapTreeItem
              node={node}
              mapId={mapId}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
              setDisplayDialog={setUpdateMapDialog}
              setMapId={setMapId}
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
      </TreeSidebar>
    </div>
  );
}
