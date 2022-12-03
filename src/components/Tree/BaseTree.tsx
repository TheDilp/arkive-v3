import { DragLayerMonitorProps, NodeModel, PlaceholderRenderParams, Tree } from "@minoru/react-dnd-treeview";
import { useAtom } from "jotai";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { useCreateItem, useDeleteMutation, useGetAllItems, useSortMutation, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/queries";
import { DocumentType } from "../../types/documentTypes";
import { AvailableItemTypes } from "../../types/generalTypes";
import { MapType } from "../../types/mapTypes";
import { SidebarTreeItemType, TreeDataType } from "../../types/treeTypes";
import { DialogAtom, DrawerAtom, SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";
import { getDepth, handleDrop } from "../../utils/tree";
import ContextMenu from "../ContextMenu/ContextMenu";
import DragPreview from "../Sidebar/DragPreview";
import TreeItem from "./TreeItem";

type Props = {
  type: AvailableItemTypes;
  isTemplates?: boolean;
};

function DragPreviewComponent(monitorProps: DragLayerMonitorProps<TreeDataType>) {
  return <DragPreview monitorProps={monitorProps} />;
}
function Placeholder(args: PlaceholderRenderParams) {
  const { depth } = args;
  return (
    <div
      style={{
        backgroundColor: "#1967d2",
        height: "2px",
        left: depth * 24,
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
  const { data: items, isLoading, error } = useGetAllItems(project_id as string, type);
  const createItemMutation = useCreateItem(type);
  const updateItemMutation = useUpdateItem(type);
  const deleteItemMutation = useDeleteMutation(type);
  const sortItemMutation = useSortMutation(type);
  const [, setDrawer] = useAtom(DrawerAtom);
  const [, setDialog] = useAtom(DialogAtom);

  const rootItems = [
    {
      // command: () => {},
      icon: "pi pi-fw pi-file",
      label: "New Document",
    },
    {
      // command: () => {},
      icon: "pi pi-fw pi-folder",
      label: "New Folder",
    },
  ];
  function contextMenuItems(cmType: SidebarTreeItemType) {
    const docItems = [
      {
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "documents",
            });
        },
        icon: "pi pi-fw pi-pencil",
        label: "Edit Document",
      },

      {
        command: () => {
          if (cmType.data?.id) {
            updateItemMutation?.mutate({
              folder: true,
              id: cmType.data.id,
            });
          }
        },
        icon: "pi pi-fw pi-folder",
        label: "Change To Folder",
      },
      {
        command: () => {
          if (cmType.data) {
            createItemMutation?.mutate({
              ...cmType.data,
              id: uuid(),
              parent: null,
              project_id: project_id as string,
              template: true,
            });
          }
        },
        icon: "pi pi-fw pi-copy",
        label: "Covert to Template",
      },
      {
        icon: "pi pi-fw pi-download",
        label: "Export JSON",
        // command: () => {},
      },
      { separator: true },
      {
        icon: "pi pi-fw pi-external-link",
        label: "View Public Document",
        // command: () => {},
      },
      {
        icon: "pi pi-fw pi-link",
        label: "Copy Public URL",
        // command: () => {},
      },
      {
        command: () => cmType.data?.id && deleteItemMutation?.mutate(cmType.data.id),
        icon: "pi pi-fw pi-trash",
        label: "Delete Document",
      },
    ];
    const folderItems = [
      {
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              exceptions: {},
              id: cmType.data.id,
              position: "right",
              show: true,
              type: cmType?.type,
            });
        },
        icon: "pi pi-fw pi-pencil",
        label: "Edit Folder",
      },

      {
        command: () => {
          if (cmType.data?.id) {
            if (items?.some((item) => item.parent === cmType.data?.id)) {
              toaster("error", "Cannot convert to file if folder contains files.");
              return;
            }
            updateItemMutation?.mutate({
              folder: false,
              id: cmType.data.id,
            });
          }
        },
        icon: "pi pi-fw, pi-file",
        label: "Change To File",
      },
      {
        icon: "pi pi-fw pi-plus",
        items: [
          {
            // command: () => {},
            icon: "pi pi-fw pi-file",
            label: "Insert Document",
          },
          {
            // command: () => {},
            icon: "pi pi-fw pi-folder",
            label: "Insert Folder",
          },
        ],
        label: "Insert Into Folder",
      },
      { separator: true },
      {
        command: () => cmType.data?.id && deleteItemMutation?.mutate(cmType.data.id),
        icon: "pi pi-fw pi-trash",
        label: "Delete Folder",
      },
    ];
    const templateItems = [
      {
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              exceptions: {},
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "documents",
            });
        },
        icon: "pi pi-fw pi-pencil",
        label: "Edit Document",
      },

      {
        icon: "pi pi-fw pi-copy",
        label: "Create Doc From Template",
        // command: () => {},
      },
      { separator: true },
      {
        icon: "pi pi-fw pi-trash",
        label: "Delete Document",
        // command: confirmdelete,
      },
    ];
    const mapItems = [
      {
        label: "Update Map",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDrawer({
              ...DefaultDrawer,
              id: cmType.data.id,
              position: "right",
              show: true,
              type: "maps",
            });
        },
      },
      {
        label: "Toggle Public",
        icon: `pi pi-fw ${"2" ? "pi-eye" : "pi-eye-slash"}`,
      },
      {
        label: "Manage Layers",
        icon: "pi pi-clone",
        command: () =>
          setDialog((prev) => ({ ...prev, position: "top-left", data: cmType?.data, show: true, type: "map_layer" })),
      },
      { separator: true },
      {
        label: "View Public Map",
        icon: "pi pi-fw pi-external-link",
      },
      {
        label: "Copy Public URL",
        icon: "pi pi-fw pi-link",
      },
      {
        label: "Delete Map",
        icon: "pi pi-fw pi-trash",
        command: () => cmType.data?.id && deleteItemMutation?.mutate(cmType.data.id),
      },
    ];
    if (cmType.folder) return folderItems;
    if (cmType.template) return templateItems;
    if (cmType.type === "documents") return docItems;
    if (cmType.type === "maps") return mapItems;
    return rootItems;
  }

  const [contextMenu] = useAtom(SidebarTreeContextAtom);
  const { data: tags } = useGetAllTags(project_id as string, type);

  const cm = useRef();
  const [treeData, setTreeData] = useState<NodeModel<TreeDataType>[]>([]);
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
                (filterItems: DocumentType | MapType) =>
                  filterItems.title.toLowerCase().includes(filter.toLowerCase()) &&
                  selectedTags.every((tag) => filterItems.tags.includes(tag)),
              )
              .map((doc: DocumentType | MapType) => ({
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
          .map((item: DocumentType | MapType) => ({
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error </div>;

  return (
    <>
      <ConfirmDialog />
      <ContextMenu cm={cm} items={contextMenuItems(contextMenu)} />
      <InputText
        className="p-1 mt-1"
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
          // Don't allow nesting documents beyond this depth
          if (depth > 5) return false;
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
          return false;
        }}
        classes={{
          container: "list-none flex-1 flex flex-col",
          listItem: "w-full",
          placeholder: "relative",
          root: "w-full mt-1 pl-0 overflow-y-auto flex flex-col flex-1",
        }}
        dragPreviewRender={DragPreviewComponent}
        dropTargetOffset={10}
        initialOpen={items?.filter((item) => item.expanded).map((doc) => doc.id) || false}
        insertDroppableFirst={false}
        onDrop={(tree, options) => {
          const { dragSourceId, dropTargetId } = options;
          handleDrop(tree, setTreeData, dropTargetId as string, sortItemMutation);
          if (type === "documents")
            updateItemMutation?.mutate({
              id: dragSourceId as string,
              parent: dropTargetId === "0" ? null : (dropTargetId as string),
            });
        }}
        // @ts-ignore
        placeholderRender={Placeholder}
        render={(node: NodeModel<TreeDataType>, { depth, isOpen, onToggle }) => (
          <TreeItem cm={cm} depth={depth} isOpen={isOpen} node={node} onToggle={onToggle} type={type} />
        )}
        rootId="0"
        sort={false}
        tree={treeData}
      />
    </>
  );
}
