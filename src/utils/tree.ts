import { NodeModel } from "@minoru/react-dnd-treeview";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";

import { AllItemsType } from "../types/generalTypes";

export const getDepth = (tree: NodeModel[], id: number | string, depth = 0): number => {
  const target: NodeModel | undefined = tree.find((node) => node.id === id);

  if (target) {
    return getDepth(tree, target.parent, depth + 1);
  }

  return depth;
};

export const handleDrop = async (
  newTree: NodeModel<AllItemsType>[],
  setTreeData: Dispatch<SetStateAction<NodeModel<AllItemsType>[]>>,
  dropTargetId: string,
  sortItemsMutation: any,
) => {
  // setTreeData(newTree);
  const indexes = newTree
    .filter(
      (doc) =>
        doc.parent === dropTargetId ||
        (doc.parent === undefined &&
          dropTargetId === "0" &&
          ((doc?.data && "template" in doc.data && !doc.data?.template) || true)),
    )
    .map((doc, index) => {
      return {
        id: doc.id as string,
        parent: doc.parent === "0" ? null : (doc.parent as string),
        sort: index,
      };
    });

  sortItemsMutation?.mutate(indexes);
};
