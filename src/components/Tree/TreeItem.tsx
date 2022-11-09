import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useAtom } from "jotai";
import { MutableRefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarTreeContextAtom } from "../../utils/atoms";
import { TreeDataType } from "../../types/treeTypes";
import { useUpdateMutation } from "../../CRUD/DocumentCRUD";
import { AvailableItemTypes } from "../../types/generalTypes";
type Props = {
  node: NodeModel<TreeDataType>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  cm: MutableRefObject<any>;
  type: AvailableItemTypes;
};

export default function TreeItem({
  node,
  depth,
  isOpen,
  onToggle,
  cm,
  type,
}: Props) {
  const { item_id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useAtom(SidebarTreeContextAtom);
  const updateMutation = useUpdateMutation(type);
  return (
    <div
      style={{ marginInlineStart: depth }}
      className="flex items-center py-1 cursor-pointer max-w-20rem text-md hover:bg-sky-700 gap-x-1 "
      onClick={() => {
        // Navigate if not a folder
        if (!node.droppable) {
          //   setDocId(node.id as string);
          navigate(`./wiki/doc/${node.id}`);
        } else {
          //   setDocId(node.id as string);
          navigate(`folder/${node.id}`);
        }
      }}
      onContextMenu={(e) => {
        if (node.droppable)
          setText({ id: node.id as string, type: "doc_folder" });
        else if (node.data?.template)
          setText({ id: node.id as string, type: "template" });
        else setText({ id: node.id as string, type: "document" });
        cm.current.show(e);
        // setDisplayDialog({
        //   id: node.id as string,
        //   title: node.text,
        //   show: false,
        //   folder: node.data?.folder || false,
        //   depth,
        //   template: node.data?.template || false,
        //   parent: node.data?.parent?.id || node.data?.parent || null,
        // });
      }}
    >
      {node.droppable && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(updateMutation, type);
            updateMutation?.mutate({
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
          <Icon
            icon={node.data?.icon as string}
            inline={true}
            className="rounded-full hover:bg-sky-400 selectableIcon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              //   setIconSelect({
              //     id: node.id as string,
              //     icon: "bxs:folder",
              //     show: true,
              //     top: e.clientY,
              //     left: e.clientX,
              //   });
            }}
          />
        )}
      </span>

      <div className={` Lato w-full ${node.id === item_id && "text-blue-400"}`}>
        <div className="w-full overflow-hidden white-space-nowrap text-overflow-ellipsis">
          {node.text}
        </div>
      </div>
    </div>
  );
}
