import { UseMutationResult } from "@tanstack/react-query";
import cytoscape from "cytoscape";

import { AllItemsType, AllSubItemsType } from "../types/generalTypes";

export function changeLockState(
  boardContext: cytoscape.Core,
  locked: boolean,
  updateManyNodesLockState: UseMutationResult<
    Response | null,
    unknown,
    {
      ids: string[];
      data: Partial<AllItemsType | AllSubItemsType>;
    },
    unknown
  >,
) {
  const selected = boardContext.nodes(":selected");
  if (locked) {
    selected.lock();
  } else {
    selected.unlock();
  }
  const ids = selected.map((node: any) => node.data().id);
  updateManyNodesLockState.mutate({ ids, data: { locked } });
}

export const edgehandlesSettings = {
  canConnect(sourceNode: any, targetNode: any) {
    return !sourceNode.outgoers().includes(targetNode) && !sourceNode.same(targetNode);
    // whether an edge can be created between source and target
    // e.g. disallow loops
  },
  edgeParams(sourceNode: any, targetNode: any) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    return {
      class: "eh-ghost-edge",
      data: {
        source: sourceNode.id(),
        target: targetNode.id(),
        curveStyle: "straight",
        lineStyle: "solid",
        lineColor: "#1e1e1e",
      },
    };
  },
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
};
