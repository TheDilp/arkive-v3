import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getDocuments } from "../../utils/supabaseUtils";
import { Tree, NodeModel } from "@minoru/react-dnd-treeview";
import { useState } from "react";
import "../../styles/Project.css";
export default function Project() {
  const { project_id } = useParams();
  const SampleData = [
    {
      id: 1,
      parent: 0,
      text: "Folder",
      droppable: true,
    },
    { id: 2, parent: 1, text: "File" },
    { id: 3, parent: 1, text: "File" },
    {
      id: 4,
      parent: 0,
      text: "Folder 2",
      droppable: true,
    },
  ];
  const [treeData, setTreeData] = useState<NodeModel[]>(SampleData);
  const handleDrop = (newTree: NodeModel[]) => setTreeData(newTree);
  const {
    data: documents,
    error,
    isLoading,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id as string)
  );

  if (isLoading || error) return <div>TEST</div>;

  return (
    <div style={{ width: "100%" }}>
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { depth, isOpen, onToggle }) => (
          <div style={{ marginInlineStart: depth * 10 }} className="treeNode">
            {node.droppable && (
              <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
            )}
            {node.text}
          </div>
        )}
        dragPreviewRender={(monitorProps) => (
          <div>{monitorProps.item.text}</div>
        )}
        onDrop={handleDrop}
      />
    </div>
  );
}
