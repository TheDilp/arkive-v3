import { NodeModel } from "@minoru/react-dnd-treeview";
import { UseMutationResult } from "@tanstack/react-query";
import { useSortMutation } from "../CRUD/ItemsCRUD";
import { SortIndexes, TreeDataType } from "../types/treeTypes";

export const getDepth = (tree: NodeModel[], id: number | string, depth = 0): number => {
  const target: NodeModel | undefined = tree.find((node) => node.id === id);

  if (target) {
    return getDepth(tree, target.parent, depth + 1);
  }

  return depth;
};

export const handleDrop = async (
  newTree: NodeModel<TreeDataType>[],
  setTreeData: (newTree: NodeModel<TreeDataType>[]) => void,
  dropTargetId: string,
  sortItemsMutation: UseMutationResult<Response, unknown, SortIndexes, unknown> | undefined,
) => {
  setTreeData(newTree);
  const indexes = newTree
    .filter(
      (doc) =>
        doc.parent === dropTargetId ||
        (doc.parent === undefined && dropTargetId === "0" && (!doc.data?.template || true)),
    )
    .map((doc, index) => {
      // doc.parent.toString() => Dnd Treeview allows for strings and numbers, we want only strings
      return {
        id: doc.id as string,
        parent: doc.parent === "0" ? null : (doc.parent as string),
        sort: index,
      };
    });

  sortItemsMutation?.mutate(indexes);
};
