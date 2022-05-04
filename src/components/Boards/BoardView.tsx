import { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { CytoscapeNode } from "../../custom-types";
import { useGetBoardData } from "../../utils/customHooks";

export default function BoardView() {
  const { project_id, board_id } = useParams();
  const board = useGetBoardData(project_id as string, board_id as string);
  const [nodes, setNodes] = useState<CytoscapeNode[]>([]);
  useEffect(() => {
    if (board && board.nodes.length > 0) {
      let temp_nodes: CytoscapeNode[] = board.nodes.map((node) => ({
        data: { id: node.id, label: node.label },
        position: { x: node.x, y: node.y },
      }));

      setNodes(temp_nodes);
    }
  }, [board]);

  return (
    <div className="w-10 h-screen">
      <CytoscapeComponent
        elements={nodes}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
