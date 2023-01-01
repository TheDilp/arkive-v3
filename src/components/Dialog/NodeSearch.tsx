import { useAtom } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetItem } from "../../hooks/useGetItem";
import { BoardType, NodeType } from "../../types/boardTypes";
import { BoardReferenceAtom, DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function NodeSearch() {
  const { item_id } = useParams();
  const [, setDialog] = useAtom(DialogAtom);
  const [boardRef] = useAtom(BoardReferenceAtom);
  const { data: board } = useGetItem<BoardType>(item_id as string, "boards");
  const [search, setSearch] = useState("");
  const [filteredNodes, setFilteredNodes] = useState<NodeType[]>(board?.nodes.filter((node) => node.label) || []);
  if (!board) return null;
  return (
    <div className="flex flex-col justify-center">
      <AutoComplete
        autoFocus
        className="w-15rem ml-2"
        completeMethod={(e) =>
          setFilteredNodes(board?.nodes.filter((node) => node.label?.toLowerCase().includes(e.query.toLowerCase())) || [])
        }
        field="label"
        onChange={(e) => setSearch(e.value)}
        onSelect={(e) => {
          if (!boardRef) return;
          if (e.value) {
            const foundNode = boardRef.getElementById(e.value.id);
            boardRef.animate(
              {
                center: {
                  eles: foundNode,
                },
                zoom: 1,
              },
              {
                duration: 1250,
              },
            );
            setDialog((prev) => ({ ...DefaultDialog, position: prev.position }));
          }
        }}
        placeholder="Search Nodes"
        suggestions={filteredNodes}
        value={search}
      />
    </div>
  );
}
