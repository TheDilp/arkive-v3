import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import {
  useContext, useLayoutEffect,
  useRef,
  useState
} from "react";
import { useParams } from "react-router-dom";
import { SortIndexes } from "../../../custom-types";
import { MapItemDisplayDialogProps, MapProps } from "../../../types/MapTypes";
import { useGetMaps, useSortChildren } from "../../../utils/customHooks";
import { MapDialogDefault } from "../../../utils/defaultValues";
import { getDepth, handleDrop, TreeSortFunc } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import TreeSidebar from "../../Util/TreeSidebar";
import DragPreview from "../../Wiki/DocumentTree/DragPreview";
import MapCreateDialog from "./MapDialogs/MapCreateDialog";
import MapLayersDialog from "./MapDialogs/MapLayersDialog";
import MapUpdateDialog from "./MapDialogs/MapUpdateDialog";
import MapsFilter from "./MapsFilter";
import MapTreeItem from "./MapTreeItem";
import MapTreeItemContext from "./MapTreeItemContext";

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
  const sortChildrenMutation = useSortChildren();

  useLayoutEffect(() => {
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
          maps.sort((a, b) => TreeSortFunc(a.sort, b.sort)).map((m) => ({
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


  return (
    <div
      className={` text-white pt-2 px-2 ${isTabletOrMobile ? "surface-0 hidden" : "surface-50 w-2"
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
          sort={false}
          insertDroppableFirst={false}
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
          onDrop={(tree, options) => handleDrop(tree, options, setTreeData, sortChildrenMutation, project_id as string, "maps")}

        />
      </TreeSidebar>
    </div>
  );
}
