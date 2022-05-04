import { ContextMenu } from "primereact/contextmenu";
import { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { CytoscapeNode } from "../../custom-types";
import { useGetBoardData } from "../../utils/customHooks";

export default function BoardView() {
  const { project_id, board_id } = useParams();
  const board = useGetBoardData(project_id as string, board_id as string);
  const [nodes, setNodes] = useState<CytoscapeNode[]>([]);
  useEffect(() => {
    if (board) {
      if (board.nodes.length > 0) {
        let temp_nodes: CytoscapeNode[] = board.nodes.map((node) => ({
          data: { id: node.id, label: node.label, type: node.type },
          position: { x: node.x, y: node.y },
        }));

        setNodes(temp_nodes);
      } else {
        setNodes([]);
      }
    }
  }, [board]);
  const cyRef = useRef() as any;
  const cm = useRef() as any;
  useEffect(() => {
    if (cyRef.current) {
      console.log(cyRef.current);
    }
  }, [cyRef]);

  return (
    <div className="w-10 h-screen" onContextMenu={(e) => cm.current.show(e)}>
      <ContextMenu
        model={[
          {
            label: "New Node",
            command: () =>
              setNodes((prev) => [
                ...prev,
                {
                  data: {
                    id: Math.random().toString(),
                    label: "",
                    type: "triangle",
                  },
                  position: { x: 657, y: 255 },
                },
              ]),
          },
        ]}
        ref={cm}
      ></ContextMenu>
      <CytoscapeComponent
        elements={nodes}
        style={{ width: "100%", height: "100%" }}
        cy={(cy: any) => (cyRef.current = cy)}
        stylesheet={[
          {
            selector: "node",
            style: {
              shape: "data(type)",
            },
          },
        ]}
      />
    </div>
  );
}
