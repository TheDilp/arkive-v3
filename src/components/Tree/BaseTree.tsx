import { DragLayerMonitorProps, NodeModel, PlaceholderRenderParams, Tree } from "@minoru/react-dnd-treeview";
import { useAtom } from "jotai";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { MutableRefObject, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllItems, useSortMutation, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { useTreeMenuItems } from "../../utils/contextMenus";
import { getDepth, handleDrop } from "../../utils/tree";
import ContextMenu from "../ContextMenu/ContextMenu";
import DragPreview from "../Sidebar/DragPreview";
import TreeItem from "./TreeItem";

type Props = {
  type: AvailableItemTypes;
  isTemplates?: boolean;
};

function DragPreviewComponent(monitorProps: DragLayerMonitorProps<AllItemsType>) {
  return <DragPreview monitorProps={monitorProps} />;
}
function Placeholder(args: PlaceholderRenderParams) {
  const { depth } = args;
  return (
    <div
      style={{
        backgroundColor: "#1967d2",
        height: "2px",
        left: (depth || 0) * 24,
        position: "absolute",
        right: 0,
        top: 0,
        transform: "translateY(-50%)",
      }}
    />
  );
}

export default function BaseTree({ isTemplates, type }: Props) {
  const { project_id } = useParams();
  const { data: items } = useGetAllItems(project_id as string, type);
  const updateItemMutation = useUpdateItem(type);
  const sortItemMutation = useSortMutation(project_id as string, type);

  const [contextMenu, setContextMenu] = useAtom(SidebarTreeContextAtom);
  const contextItems = useTreeMenuItems(contextMenu, type, project_id as string);

  const { data: tags } = useGetAllTags(project_id as string, type);

  const cm = useRef() as MutableRefObject<any>;
  const [treeData, setTreeData] = useState<NodeModel<AllItemsType>[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useLayoutEffect(() => {
    if (items) {
      if (filter || selectedTags.length > 0) {
        const timeout = setTimeout(() => {
          let tempItems = [...items];
          if (type === "documents" && isTemplates) tempItems = tempItems.filter((item) => "template" in item && item.template);
          else if (type === "documents" && !isTemplates)
            tempItems = tempItems.filter((item) => "template" in item && !item.template);

          setTreeData(
            tempItems
              .filter(
                (filterItems: AllItemsType) =>
                  filterItems.title.toLowerCase().includes(filter.toLowerCase()) &&
                  selectedTags.every((tag) => filterItems.tags.includes(tag)),
              )
              .map((doc: AllItemsType) => ({
                data: doc,
                droppable: doc.folder,
                id: doc.id,
                parent: "0",
                text: doc.title,
              })),
          );
        }, 300);
        return () => clearTimeout(timeout);
      }
      let tempItems = [...items];
      if (type === "documents") {
        tempItems = tempItems.filter((item) =>
          isTemplates ? "template" in item && item.template : "template" in item && !item.template,
        );
      }
      setTreeData(
        tempItems
          .map((item: AllItemsType) => ({
            data: item,
            droppable: item.folder,
            id: item.id,
            parent: item.parent || "0",
            text: item.title,
          }))
          .sort((a, b) => a.data.sort - b.data.sort),
      );
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, filter, selectedTags]);

  return (
    <div
      onContextMenu={(e) => {
        setContextMenu({ data: null, type, folder: false, template: true });
        cm?.current?.show(e);
      }}>
      <ContextMenu cm={cm} items={contextItems} />
      <InputText
        className="w-full p-1 mt-1"
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by Title"
        value={filter}
      />
      <MultiSelect
        className="w-full p-0"
        display="chip"
        filter
        onChange={(e) => {
          if (e.value === null) {
            setSelectedTags([]);
          } else {
            setSelectedTags(e.value);
          }
        }}
        options={tags ?? []}
        placeholder="Filter by Tags"
        showClear
        value={selectedTags}
      />
      <Tree
        canDrop={(tree, { dragSource, dropTargetId }) => {
          const depth = getDepth(tree, dropTargetId);
          if (dragSource?.id === dropTargetId) return false;
          // Don't allow nesting documents beyond this depth
          if (depth > 5) return false;
          return true;
        }}
        classes={{
          container: "list-none flex-1 flex flex-col",
          listItem: "w-full",
          placeholder: "relative",
          root: "w-full mt-1 pl-0 overflow-y-auto flex flex-col flex-1",
          dropTarget: "bg-zinc-800",
        }}
        dragPreviewRender={DragPreviewComponent}
        dropTargetOffset={10}
        initialOpen={items?.filter((item) => item.expanded).map((doc) => doc.id) || false}
        insertDroppableFirst={false}
        onDrop={(tree, options) => {
          const { dragSourceId, dropTargetId } = options;
          handleDrop(tree, setTreeData, dropTargetId as string, sortItemMutation);
          updateItemMutation?.mutate({
            id: dragSourceId as string,
            parent: dropTargetId === "0" ? null : (dropTargetId as string),
          });
        }}
        // @ts-ignore
        placeholderRender={Placeholder}
        render={(node: NodeModel<AllItemsType>, { depth, isOpen, onToggle }) => (
          <TreeItem cm={cm} depth={depth} isOpen={isOpen} node={node} onToggle={onToggle} type={type} />
        )}
        rootId="0"
        sort={false}
        tree={treeData}
      />
    </div>
  );
}
