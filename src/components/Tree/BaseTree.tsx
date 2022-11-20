import { DrawerAtom, SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { getDepth, handleDrop } from "../../utils/tree";
import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useCreateMutation, useDeleteMutation, useSortMutation, useUpdateMutation } from "../../CRUD/ItemsCRUD";
import { useLayoutEffect, useRef, useState } from "react";
import { SidebarTreeItemType, TreeDataType } from "../../types/treeTypes";
import { AvailableItemTypes } from "../../types/generalTypes";
import { DocumentType } from "../../types/documentTypes";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import ContextMenu from "../ContextMenu/ContextMenu";
import DragPreview from "../Sidebar/DragPreview";
import TreeItem from "./TreeItem";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useGetAllTags } from "../../CRUD/queries";
import { toaster } from "../../utils/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DefaultDrawer } from "../../utils/DefaultValues/DocumentDefaults";
import { MapType } from "../../types/mapTypes";

type Props = {
  data: (DocumentType | MapType)[];
  type: AvailableItemTypes;
};

export default function BaseTree({ data, type }: Props) {
  const createItemMutation = useCreateMutation(type);
  const updateItemMutation = useUpdateMutation(type);
  const deleteItemMutation = useDeleteMutation(type);
  const sortItemMutation = useSortMutation(type);
  const [drawer, setDrawer] = useAtom(DrawerAtom);

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
              type: "documents",
            });
        },
        icon: "pi pi-fw pi-pencil",
        label: "Edit Folder",
      },

      {
        command: () => {
          if (cmType.data?.id) {
            if (data.some((item) => item.parent === cmType.data?.id)) {
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
    if (cmType.type === "document") return docItems;
    if (cmType.type === "doc_folder") return folderItems;
    if (cmType.type === "template") return templateItems;
    return [];
  }

  const { project_id } = useParams();
  const [cmType] = useAtom(SidebarTreeContextAtom);
  const { data: tags } = useGetAllTags(project_id as string);

  const cm = useRef();
  const [treeData, setTreeData] = useState<NodeModel<TreeDataType>[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useLayoutEffect(() => {
    if (data) {
      if (filter || selectedTags.length > 0) {
        const timeout = setTimeout(() => {
          setTreeData(
            data
              .filter(
                (items: DocumentType | MapType) =>
                  items.title.toLowerCase().includes(filter.toLowerCase()) &&
                  selectedTags.every((tag) => items.tags.includes(tag)),
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
      } else {
        setTreeData(
          data
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
    }
  }, [data, filter, selectedTags]);

  return (
    <>
      <ConfirmDialog />
      <ContextMenu items={contextMenuItems(cmType)} cm={cm} />
      <InputText
        className="mt-1 p-1"
        placeholder="Filter by Title"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <MultiSelect
        value={selectedTags}
        options={tags ?? []}
        placeholder="Filter by Tags"
        className="w-full p-0"
        showClear={true}
        display="chip"
        filter
        onChange={(e) => {
          if (e.value === null) {
            setSelectedTags([]);
          } else {
            setSelectedTags(e.value);
          }
        }}
      />
      <Tree
        classes={{
          container: "list-none flex-1",
          listItem: "listitem",
          placeholder: "relative",
          root: "w-full mt-1 pl-0 overflow-y-auto flex flex-col flex-1",
        }}
        tree={treeData}
        rootId={"0"}
        sort={false}
        insertDroppableFirst={false}
        initialOpen={data?.filter((item) => item.expanded).map((doc) => doc.id) || false}
        render={(node: NodeModel<TreeDataType>, { depth, isOpen, onToggle }) => (
          <TreeItem node={node} depth={depth} isOpen={isOpen} onToggle={onToggle} type={type} cm={cm} />
        )}
        dragPreviewRender={(monitorProps) => (
          <DragPreview text={monitorProps.item.text} droppable={monitorProps.item.droppable} />
        )}
        placeholderRender={(_, { depth }) => (
          <div
            style={{
              backgroundColor: "#1967d2",
              height: "2px",
              left: depth * 24,
              position: "absolute",
              right: 0,
              top: 0,
              transform: "translateY(-50%)",
            }}></div>
        )}
        dropTargetOffset={10}
        canDrop={(tree, { dragSource, dropTargetId }) => {
          const depth = getDepth(tree, dropTargetId);
          // Don't allow nesting documents beyond this depth
          if (depth > 5) return false;
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        onDrop={(tree, options) => {
          const { dragSourceId, dropTargetId } = options;
          handleDrop(tree, setTreeData, dropTargetId as string, sortItemMutation);
          if (type === "documents")
            updateItemMutation?.mutate({
              id: dragSourceId as string,
              parent: dropTargetId === "0" ? null : (dropTargetId as string),
            });
        }}
      />
    </>
  );
}
