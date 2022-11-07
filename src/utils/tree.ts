import { NodeModel } from "@minoru/react-dnd-treeview";
import { UseMutationResult } from "@tanstack/react-query";
import { TreeDataType } from "../types/treeTypes";

export const getDepth = (
  tree: NodeModel[],
  id: number | string,
  depth = 0
): number => {
  const target: NodeModel | undefined = tree.find((node) => node.id === id);

  if (target) {
    return getDepth(tree, target.parent, depth + 1);
  }

  return depth;
};

export const handleDrop = async (
  newTree: NodeModel<TreeDataType>[],
  setTreeData: (newTree: NodeModel<TreeDataType>[]) => void
) => {
  setTreeData(newTree);
  //   let indexes: SortIndexes = newTree
  //     .filter(
  //       (doc) =>
  //         doc.parent === dropTargetId ||
  //         (doc.parent === undefined &&
  //           dropTargetId === "0" &&
  //           // @ts-ignore
  //           (!doc.data?.template || true))
  //     )
  //     .map((doc, index) => {
  //       // doc.parent.toString() => Dnd Treeview allows for strings and numbers, we want only strings
  //       return {
  //         id: doc.id as string,
  //         sort: index,
  //         parent: doc.parent === "0" ? null : (doc.parent as string),
  //       };
  //     });
  //   sortChildrenMutation.mutate({
  // project_id: project_id as string,
  // type,
  // indexes: indexes || [],
  //   });
};
