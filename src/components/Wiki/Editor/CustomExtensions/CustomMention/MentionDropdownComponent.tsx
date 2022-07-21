import {
  MentionAtomPopupComponent,
  MentionState
} from "@remirror/react";
import { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { DocumentProps } from "../../../../../custom-types";
import { BoardProps } from "../../../../../types/BoardTypes";
import { MapProps } from "../../../../../types/MapTypes";

export default function MentionDropdownComponent() {
  const [mentionState, setMentionState] = useState<MentionState | null>();
  const queryClient = useQueryClient();
  const { project_id } = useParams();

  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }
    const query = mentionState.query.full.toLowerCase() ?? "";
    if (mentionState.name === "at") {
      const documents: DocumentProps[] | undefined = queryClient.getQueryData(
        `${project_id}-documents`
      );
      let only_documents =
        documents?.filter((doc) => !doc.folder && !doc.template) ?? [];
      let document_titles = only_documents.map((doc) => ({
        id: doc.id,
        label: doc.title,
      }));

      let alter_names = only_documents
        .filter((doc) => doc.alter_names)
        .map((doc) => {
          return doc.alter_names.map((name, index) => ({
            id: `alter-${index} ${doc.id}`,
            label: name,
          }));
        })
        .flat();
      const documentItems = [...document_titles, ...alter_names];

      return documentItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 5)
        .sort();
    } else if (mentionState.name === "hash") {
      const maps: MapProps[] | undefined = queryClient.getQueryData(
        `${project_id}-maps`
      );
      const mapItems = (maps?.filter((map) => !map.folder) ?? []).map(
        (map) => ({
          id: map.id,
          label: map.title,
        })
      );
      return mapItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 5)
        .sort();
    } else if (mentionState.name === "dollah") {
      const boards: BoardProps[] | undefined = queryClient.getQueryData(
        `${project_id}-boards`
      );

      const boardItems = (boards?.filter((board) => !board.folder) ?? []).map(
        (board) => ({
          id: board.id,
          label: board.title,
        })
      );

      return boardItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 5)
        .sort();
    } else {
      return [];
    }
  }, [mentionState]);
  return (
    <MentionAtomPopupComponent
      onChange={setMentionState}
      items={items}
      focusOnClick={false}
    />
  );
}
