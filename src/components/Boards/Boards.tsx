import React from "react";
import CytoscapeComponent from "react-cytoscapejs";
type Props = {};

export default function Boards({}: Props) {
  const elements = [
    { data: { id: "one", label: "Node 1" }, position: { x: 0, y: 0 } },
    { data: { id: "two", label: "Node 2" }, position: { x: 100, y: 0 } },
    {
      data: { source: "one", target: "two", label: "Edge from Node1 to Node2" },
    },
  ];
  return (
    <div className="w-full h-screen flex flex-nowrap">
      <div className="w-2 h-full bg-green-200">asd</div>
      <div className="w-10 h-full relative">
        <CytoscapeComponent
          elements={elements}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
