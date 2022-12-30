import { MentionAtomPopupComponent, MentionState } from "@remirror/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { BoardType } from "../../types/boardTypes";
import { DocumentType } from "../../types/documentTypes";
import { MapType } from "../../types/mapTypes";

export default function MentionDropdownComponent() {
  const [mentionState, setMentionState] = useState<MentionState | null>();
  const queryClient = useQueryClient();
  const { project_id } = useParams();

  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }
    const query = mentionState.query.full.toLowerCase() ?? "";
    if (mentionState.name === "documents") {
      const documents: DocumentType[] | undefined = queryClient.getQueryData(["allItems", project_id, "documents"]);
      const only_documents = documents?.filter((doc) => !doc.folder && !doc.template) ?? [];
      const document_titles = only_documents.map((doc) => ({
        id: doc.id,
        label: doc.title,
      }));

      const alter_names = only_documents
        .filter((doc) => doc.alter_names)
        .map((doc) => {
          return doc.alter_names.map((name, index) => ({
            id: `alter-${index} ${doc.id}`,
            label: name,
            test: "TEST",
          }));
        })
        .flat();
      const documentItems = [...document_titles, ...alter_names];

      return documentItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 5)
        .sort();
    }
    if (mentionState.name === "maps") {
      const maps: MapType[] | undefined = queryClient.getQueryData(["allItems", project_id, "maps"]);
      const mapItems = (maps?.filter((map) => !map.folder) ?? []).map((map) => ({
        id: map.id,
        label: map.title,
      }));
      return mapItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 5)
        .sort();
    }
    if (mentionState.name === "boards") {
      const boards: BoardType[] | undefined = queryClient.getQueryData(["allItems", project_id, "boards"]);

      const boardItems = (boards?.filter((board) => !board.folder) ?? []).map((board) => ({
        id: board.id,
        label: board.title,
      }));

      return boardItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 5)
        .sort();
    }

    return [];
  }, [mentionState]);
  return <MentionAtomPopupComponent focusOnClick={false} items={items} onChange={setMentionState} />;
}
