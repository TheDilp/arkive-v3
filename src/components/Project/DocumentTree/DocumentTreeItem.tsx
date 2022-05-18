import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useParams } from "react-router-dom";
import {
  docItemDisplayDialogProps, DocumentProps,
  iconSelectProps
} from "../../../custom-types";
import { useUpdateDocument } from "../../../utils/customHooks";
type Props = {
  docId: string;
  node: NodeModel<DocumentProps>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDocId: (docId: string) => void;
  setDisplayDialog: (displayDialog: docItemDisplayDialogProps) => void;
  setIconSelect: (iconSelect: iconSelectProps) => void;
  cm: any;
};

export default function DocumentTreeItem({
  node,
  docId,
  depth,
  isOpen,
  onToggle,
  setDocId,
  setDisplayDialog,
  setIconSelect,
  cm,
}: Props) {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className="text-lg hover:bg-blue-700 py-1 cursor-pointer pl-2"
      onClick={() => {
        if (!node.droppable) setDocId(node.id as string);
      }}
      onContextMenu={(e) => {
        cm.current.show(e);
        setDisplayDialog({
          id: node.id as string,
          title: node.text,
          show: false,
          folder: node.data?.folder || false,
          depth,
          template: node.data?.template || false,
        });
      }}
    >
      {node.droppable && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateDocumentMutation.mutate({
              doc_id: node.id as string,
              expanded: !isOpen,
            });
            onToggle();
          }}
        >
          {isOpen ? (
            <Icon icon="akar-icons:chevron-down" />
          ) : (
            <Icon icon="akar-icons:chevron-right" />
          )}
        </span>
      )}
      {node.droppable ? (
        <Icon icon="bxs:folder" inline={true} className="mr-1" />
      ) : (
        <Icon
          icon={node.data?.icon as string}
          inline={true}
          className="mr-1 hover:bg-blue-400 border-circle selectableIcon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setIconSelect({
              doc_id: node.id as string,
              icon: "bxs:folder",
              show: true,
              top: e.clientY,
              left: e.clientX,
            });
          }}
        />
      )}
      <span
        className={`text-lg Lato ${docId === node.id ? "text-primary" : ""}`}
        onClick={(e) => {
          if (node.droppable) {
            e.preventDefault();
            e.stopPropagation();
            updateDocumentMutation.mutate({
              doc_id: node.id as string,
              expanded: !isOpen,
            });
            onToggle();
          }
        }}
      >
        {node.text}
      </span>
    </div>
  );
}
