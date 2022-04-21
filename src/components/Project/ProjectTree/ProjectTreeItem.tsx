import { NodeModel } from "@minoru/react-dnd-treeview";
import { useNavigate, useParams } from "react-router-dom";
import {
  Document,
  iconSelect,
  treeItemDisplayDialog,
} from "../../../custom-types";
import { Icon } from "@iconify/react";
type Props = {
  docId: string;
  node: NodeModel<Document>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDocId: (docId: string) => void;
  setDisplayDialog: (displayDialog: treeItemDisplayDialog) => void;
  setIconSelect: (iconSelect: iconSelect) => void;
  cm: any;
};

export default function ProjectTreeItem({
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
  const { doc_id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className="text-lg hover:bg-blue-300 py-1"
      onClick={() => {
        setDocId(node.id as string);
        navigate(doc_id === undefined ? `./${node.id}` : `./${doc_id}`);
      }}
      onContextMenu={(e) => {
        cm.current.show(e);
        setDisplayDialog({
          id: node.id as string,
          title: node.text,
          show: false,
          folder: node.data?.folder || false,
        });
      }}
    >
      {node.droppable && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
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
        <Icon
          icon="bxs:folder"
          inline={true}
          className="mr-1"
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
      ) : (
        <Icon
          icon={node.data?.icon as string}
          inline={true}
          className="mr-1"
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
        className={`text-lg hover:bg-blue-300 Lato ${
          docId === node.id ? "text-primary" : ""
        }`}
      >
        {node.text}
      </span>
    </div>
  );
}
