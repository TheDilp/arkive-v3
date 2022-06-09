import {
  DndProvider,
  getBackendOptions,
  MultiBackend,
  NodeModel,
  Tree,
} from "@minoru/react-dnd-treeview";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BoardProps,
  dialogType,
  DocumentProps,
  iconSelectProps,
  itemProps,
  MapProps,
} from "../custom-types";
import { useUpdateDocument } from "../utils/customHooks";
import { getDepth } from "../utils/utils";
import { MediaQueryContext } from "./Context/MediaQueryContext";
import ItemContextMenu from "./ItemContextMenu";
import ItemUpdateDialog from "./ItemUpdateDialog";
import TreeItem from "./TreeItem";
import TreeSidebar from "./Util/TreeSidebar";
import DragPreview from "./Wiki/DocumentTree/DragPreview";

type Props = {
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  updateMutation: any;
  deleteMutation: any;
  data: (DocumentProps | MapProps | BoardProps)[] | null;
  dialogDefault: dialogType;
};
export default function ItemTree({
  id,
  setId,
  updateMutation,
  deleteMutation,
  data,
  dialogDefault,
}: Props) {
  const { project_id } = useParams();
  const cm = useRef(null) as any;
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const [filter, setFilter] = useState<string>("");
  const [treeData, setTreeData] = useState<NodeModel<itemProps>[]>([]);
  const [displayDialog, setDisplayDialog] = useState(dialogDefault);
  const [iconSelect, setIconSelect] = useState<iconSelectProps>({
    id: "",
    icon: "",
    top: 0,
    left: 0,
    show: false,
  });

  const handleDrop = async (
    newTree: NodeModel<itemProps>[],
    {
      dragSourceId,
      dragSource,
      dropTargetId,
    }: {
      dragSourceId: string;
      dragSource: NodeModel<itemProps>;
      dropTargetId: string;
    }
  ) => {
    setTreeData(newTree);
    if (dragSource.data?.parent?.id !== dropTargetId) {
      // Update the document's parent
      // setTreeData(newTree);
      await updateMutation.mutateAsync({
        id: dragSourceId,
        parent: dropTargetId === "0" ? null : dropTargetId,
      });
      // return;
    }
  };
  useEffect(() => {
    if (data) {
      const treeData = data
        .filter((item) => {
          if ("template" in item) {
            return !item.template;
          } else {
            return true;
          }
        })
        .map((item) => ({
          id: item.id,
          text: item.title,
          droppable: item.folder,
          parent: item.parent ? (item.parent.id as string) : "0",
          data: item,
        }));
      setTreeData(treeData);
    }
  }, [data]);

  return (
    <div
      className={`text-white ${
        isTabletOrMobile ? "hidden" : isLaptop ? "w-3" : "w-2"
      } flex flex-wrap ${isTabletOrMobile ? "surface-0" : "surface-50"}`}
    >
      <ItemContextMenu
        id={id}
        setId={setId}
        displayDialog={displayDialog}
        setDisplayDialog={setDisplayDialog}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
        cm={cm}
      />
      {displayDialog && (
        <ItemUpdateDialog
          data={data}
          dialogDefault={dialogDefault}
          updateMutation={updateMutation}
          displayDialog={displayDialog}
          setDisplayDialog={setDisplayDialog}
        />
      )}
      <TreeSidebar>
        {/* <MapsFilter
          setCreateMapDialog={setCreateMapDialog}
          filter={filter}
          setFilter={setFilter}
        /> */}
        {!filter && (
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
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
                data?.filter((item) => item.expanded).map((map) => map.id) ||
                false
              }
              render={(
                node: NodeModel<itemProps>,
                { depth, isOpen, onToggle }
              ) => (
                <TreeItem
                  node={node}
                  updateMutation={updateMutation}
                  cm={cm}
                  setDisplayDialog={setDisplayDialog}
                  depth={depth}
                  isOpen={isOpen}
                  onToggle={onToggle}
                />
                // <MapTreeItem
                //   node={node}
                //   mapId={mapId}
                //   depth={depth}
                //   isOpen={isOpen}
                //   onToggle={onToggle}
                //   setDisplayDialog={setUpdateMapDialog}
                //   setMapId={setMapId}
                //   cm={cm}
                // />
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
          </DndProvider>
        )}
        {/* {filter && (
          <MapsFilterList
            filteredTree={treeData.filter(
              (node) =>
                node.text.toLowerCase().includes(filter.toLowerCase()) &&
                !node.droppable
            )}
            setMapId={setMapId}
          />
        )} */}
      </TreeSidebar>
    </div>
  );
}
