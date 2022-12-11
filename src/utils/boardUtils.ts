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
