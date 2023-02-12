/* eslint-disable react/jsx-sort-props */
import { useAtom } from "jotai";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { capitalCase } from "remirror";

import { useUpdateManySubItems } from "../../../CRUD/ItemsCRUD";
import { EdgeType } from "../../../types/ItemTypes/boardTypes";
import { BoardReferenceAtom } from "../../../utils/Atoms/atoms";
import { edgeArrowTypes } from "../../../utils/boardUtils";
import { DefaultEdge } from "../../../utils/DefaultValues/BoardDefaults";
import { toaster } from "../../../utils/toast";
import EdgeArrowSection from "../EdgeArrowSection";

export default function DrawerManyArrowsContent() {
  const { item_id } = useParams();
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [localItem, setLocalItem] = useState(DefaultEdge);

  const handleChange = ({ name, value }: { name: string; value: any }) => {
    setLocalItem((prev) => ({ ...prev, [name]: value }));
  };
  const { mutate: manyEdgesMutation, isLoading } = useUpdateManySubItems(item_id as string, "edges");

  const updateManyEdges = (value: Partial<EdgeType>) => {
    const edges = boardRef?.edges(":selected");
    if (edges?.length)
      manyEdgesMutation(
        { ids: edges.map((edge) => edge.id()) || [], data: value },
        {
          onSuccess: () => toaster("success", "Edges updated successfully."),
        },
      );
  };
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-x-1 gap-y-4 pb-2 font-Lato">
        {edgeArrowTypes.map((type) => (
          <EdgeArrowSection
            // @ts-ignore
            arrowFill={localItem[`${type}ArrowFill`]}
            // @ts-ignore
            arrowShape={localItem[`${type}ArrowShape`]}
            isUpdating={isLoading}
            key={type}
            // @ts-ignore
            arrowColor={localItem[`${type}ArrowColor`]}
            handleChange={handleChange}
            arrowName={type}
            title={capitalCase(type)}
            updateManyEdges={updateManyEdges}
          />
        ))}
      </div>
    </div>
  );
}
