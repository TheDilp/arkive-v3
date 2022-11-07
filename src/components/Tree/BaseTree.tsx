import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { TreeDataType } from "../../types/treeTypes";
import { getDepth, handleDrop } from "../../utils/tree";
import ContextMenu from "../ContextMenu/ContextMenu";
import DragPreview from "../Sidebar/DragPreview";
import TreeItem from "./TreeItem";

type Props = {
  type: "documents" | "maps" | "boards" | "timelines";
};

const docItems = [
  {
    label: "Edit Document",
    icon: "pi pi-fw pi-pencil",
    command: () => {},
  },

  {
    label: "Change Type",
    icon: "pi pi-fw pi-sync",
    items: [
      {
        label: "Document",
        icon: "pi pi-fw pi-file",
        command: () => {},
      },
      {
        label: "Folder",
        icon: "pi pi-fw pi-folder",
        command: () => {},
      },
    ],
  },
  {
    label: "Covert to Template",
    icon: "pi pi-fw pi-copy",
    command: () => {},
  },
  {
    label: "Export JSON",
    icon: "pi pi-fw pi-download",
    command: () => {},
  },
  { separator: true },
  {
    label: "View Public Document",
    icon: "pi pi-fw pi-external-link",
    command: () => {},
  },
  {
    label: "Copy Public URL",
    icon: "pi pi-fw pi-link",
    command: () => {},
  },
  {
    label: "Delete Document",
    icon: "pi pi-fw pi-trash",
  },
];

export default function BaseTree({ type }: Props) {
  const { project_id } = useParams();
  const cm = useRef();
  const [treeData, setTreeData] = useState<NodeModel<TreeDataType>[]>([]);
  const { isError, isLoading, data } = useGetSingleProject(
    project_id as string
  );
  console.log(data);
  useLayoutEffect(() => {
    if (data && data?.[type]) {
      setTreeData(
        data[type].map((item) => ({
          id: item.id,
          parent: item.parent || "0",
          text: item.title,
          droppable: item.folder,
          data: item,
        }))
      );
    }
  }, [data]);

  if (isError) return <span>ERROR!!!</span>;
  if (isLoading) return <span>LOADING</span>;

  return (
    <>
      <ContextMenu items={docItems} cm={cm} />
      <Tree
        classes={{
          root: "w-full projectTreeRoot pr-4 pl-0 h-screen overflow-y-auto",
          container: "list-none",
          placeholder: "relative",
          listItem: "listitem",
        }}
        tree={treeData}
        rootId={"0"}
        sort={false}
        insertDroppableFirst={false}
        initialOpen={
          data[type]?.filter((doc) => doc.expanded).map((doc) => doc.id) ||
          false
        }
        render={(
          node: NodeModel<TreeDataType>,
          { depth, isOpen, onToggle }
        ) => (
          <TreeItem
            // @ts-ignore
            node={node}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
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
          const depth = getDepth(data[type], dropTargetId);
          // Don't allow nesting documents beyond this depth
          if (depth > 3) return false;
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        // @ts-ignore
        onDrop={(tree, options) => handleDrop(tree, setTreeData)}
      />
    </>
  );
}
