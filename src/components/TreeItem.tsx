import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dialogType, itemProps } from "../custom-types";
import { ProjectContext } from "./Context/ProjectContext";
type Props = {
  node: NodeModel<itemProps>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDisplayDialog: (displayDialog: dialogType) => void;
  updateMutation: any;
  //   setIconSelect: (iconSelect: iconSelectProps) => void;
  cm: any;
};

export default function TreeItem({
  node,
  depth,
  isOpen,
  onToggle,
  setDisplayDialog,
  updateMutation,
  //   setIconSelect,
  cm,
}: Props) {
  const { project_id } = useParams();
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
  const navigate = useNavigate();
  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className="text-md hover:bg-blue-700 py-1 cursor-pointer pl-2 flex align-items-center white-space-normal "
      onClick={() => {
        // Navigate if not a folder
        if (!node.droppable) {
          setDocId(node.id as string);
          navigate(`doc/${node.id}`);
        } else {
          setDocId(node.id as string);
          navigate(`folder/${node.id}`);
        }
      }}
      onContextMenu={(e) => {
        cm.current.show(e);
        setDisplayDialog({
          id: node.id as string,
          title: node.text,
          show: false,
          folder: node.data?.folder || false,
          depth,
          template:
            node.data && "template" in node?.data ? node.data?.template : false,
          parent: node.data?.parent?.id || null,
          type:
            (node.data &&
              ("template" in node.data
                ? "Document"
                : "map_image" in node.data
                ? "Map"
                : "Board")) ||
            "Document",
          public: node.data?.public || false,
          expanded: node.data?.expanded || false,
        });
      }}
    >
      {node.droppable && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateMutation.mutate({
              id: node.id as string,
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

      <span>
        {node.droppable ? (
          <Icon icon="bxs:folder" inline={true} className="mr-1" />
        ) : (
          <span></span>
          //   <Icon
          //     icon={node.data?.icon as string}
          //     inline={true}
          //     className="mr-1 hover:bg-blue-400 border-circle selectableIcon"
          //     onClick={(e) => {
          //       e.preventDefault();
          //       e.stopPropagation();

          //       //   setIconSelect({
          //       //     id: node.id as string,
          //       //     icon: "bxs:folder",
          //       //     show: true,
          //       //     top: e.clientY,
          //       //     left: e.clientX,
          //       //   });
          //     }}
          //   />
        )}
      </span>

      <div
        className={` Lato w-full  ${docId === node.id ? "text-primary" : ""}`}
      >
        <div className="w-full white-space-nowrap overflow-hidden text-overflow-ellipsis">
          {node.text}
        </div>
      </div>
    </div>
  );
}
