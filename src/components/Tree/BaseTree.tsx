import { DialogAtom, SidebarTreeContextAtom } from "../../utils/atoms";
import { getDepth, handleDrop } from "../../utils/tree";
import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import {
  useCreateMutation,
  useDeleteDocument,
  useUpdateMutation,
} from "../../CRUD/DocumentCRUD";
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

type Props = {
  data: DocumentType[];
  type: AvailableItemTypes;
  templates?: boolean;
};

export default function BaseTree({ data, type, templates }: Props) {
  const createDocumentMutation = useCreateMutation(type);
  const updateDocumentMutation = useUpdateMutation(type);
  const deleteDocumentMutation = useDeleteDocument();
  const [dialog, setDialog] = useAtom(DialogAtom);

  const rootItems = [
    {
      command: () => {},
      icon: "pi pi-fw pi-file",
      label: "New Document",
    },
    {
      command: () => {},
      icon: "pi pi-fw pi-folder",
      label: "New Folder",
    },
  ];

  function contextMenuItems(cmType: SidebarTreeItemType) {
    const docItems = [
      {
        label: "Edit Document",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDialog({ id: cmType.data.id, type: "documents" });
        },
      },

      {
        label: "Change To Folder",
        icon: "pi pi-fw pi-folder",
        command: () => {
          if (cmType.data?.id)
            updateDocumentMutation?.mutate({
              id: cmType.data.id,
              folder: true,
            });
        },
      },
      {
        label: "Covert to Template",
        icon: "pi pi-fw pi-copy",
        command: () => {
          if (cmType.data) {
            createDocumentMutation?.mutate({
              ...cmType.data,
              project_id: project_id as string,
              id: uuid(),
              template: true,
            });
          }
        },
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
        command: () =>
          cmType.data?.id && deleteDocumentMutation.mutate(cmType.data.id),
      },
    ];
    const folderItems = [
      {
        label: "Edit Folder",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDialog({ id: cmType.data.id, type: "documents" });
        },
      },

      {
        label: "Change To File",
        icon: "pi pi-fw, pi-file",
        command: () => {
          if (cmType.data?.id)
            updateDocumentMutation?.mutate({
              id: cmType.data.id,
              folder: false,
            });
        },
      },
      {
        label: "Insert Into Folder",
        icon: "pi pi-fw pi-plus",
        items: [
          {
            label: "Insert Document",
            icon: "pi pi-fw pi-file",
            command: () => {},
          },
          {
            label: "Insert Folder",
            icon: "pi pi-fw pi-folder",
            command: () => {},
          },
        ],
      },
      { separator: true },
      {
        label: "Delete Folder",
        icon: "pi pi-fw pi-trash",
        command: () =>
          cmType.data?.id && deleteDocumentMutation.mutate(cmType.data.id),
      },
    ];
    const templateItems = [
      {
        label: "Edit Document",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          if (cmType.data?.id)
            setDialog({ id: cmType.data.id, type: "documents" });
        },
      },

      {
        label: "Create Doc From Template",
        icon: "pi pi-fw pi-copy",
        command: () => {},
      },
      { separator: true },
      {
        label: "Delete Document",
        icon: "pi pi-fw pi-trash",
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
  const cm = useRef();
  const [treeData, setTreeData] = useState<NodeModel<TreeDataType>[]>([]);

  useLayoutEffect(() => {
    if (data) {
      setTreeData(
        data
          .filter((item) => (templates ? item?.template : !item?.template))
          .map((item) => ({
            data: item,
            droppable: item.folder,
            id: item.id,
            parent: item.parent || "0",
            text: item.title,
          })),
      );
    }
  }, [data]);

  return (
    <>
      <ContextMenu items={contextMenuItems(cmType)} cm={cm} />
      <Tree
        classes={{
          container: "list-none",
          listItem: "listitem",
          placeholder: "relative",
          root: "w-full mt-1 pl-0 overflow-y-auto",
        }}
        tree={treeData}
        rootId={"0"}
        sort={false}
        insertDroppableFirst={false}
        initialOpen={
          data?.filter((item) => item.expanded).map((doc) => doc.id) || false
        }
        render={(
          node: NodeModel<TreeDataType>,
          { depth, isOpen, onToggle },
        ) => (
          <TreeItem
            node={node}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
            type={type}
            cm={cm}
          />
        )}
        dragPreviewRender={(monitorProps) => (
          <DragPreview
            text={monitorProps.item.text}
            droppable={monitorProps.item.droppable}
          />
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
          if (depth > 3) return false;
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        onDrop={(tree, options) => {
          handleDrop(tree, setTreeData);
          const { dragSourceId, dropTargetId } = options;
          if (type === "documents")
            updateDocumentMutation?.mutate({
              id: dragSourceId as string,
              parent: dropTargetId as string,
            });
        }}
      />
    </>
  );
}
