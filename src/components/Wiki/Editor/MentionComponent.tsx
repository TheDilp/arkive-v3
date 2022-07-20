import {
  MentionAtomNodeAttributes,
  MentionAtomPopupComponent,
  MentionState,
} from "@remirror/react";
import { useMemo, useState } from "react";
import { DocumentProps } from "../../../custom-types";
import { BoardProps } from "../../../types/BoardTypes";
import { MapProps } from "../../../types/MapTypes";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

export default function MentionComponent() {
  const [mentionState, setMentionState] = useState<MentionState | null>();
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const documents: DocumentProps[] | undefined = queryClient.getQueryData(
    `${project_id}-documents`
  );
  const maps: MapProps[] | undefined = queryClient.getQueryData(
    `${project_id}-maps`
  );
  const boards: BoardProps[] | undefined = queryClient.getQueryData(
    `${project_id}-boards`
  );
  const documentItems = useMemo(
    () =>
      (documents?.filter((doc) => !doc.folder && !doc.template) ?? []).map(
        (doc) => ({
          id: doc.id,
          label: doc.title,
        })
      ),
    [documents]
  );
  const mapItems = useMemo(
    () =>
      (maps?.filter((map) => !map.folder) ?? []).map((map) => ({
        id: map.id,
        label: map.title,
      })),
    [maps]
  );
  const boardItems = useMemo(
    () =>
      (boards?.filter((board) => !board.folder) ?? []).map((board) => ({
        id: board.id,
        label: board.title,
      })),
    [boards]
  );
  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }
    const query = mentionState.query.full.toLowerCase() ?? "";
    if (mentionState.name === "at") {
      return documentItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 5)
        .sort();
    } else if (mentionState.name === "hash") {
      return mapItems
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 5)
        .sort();
    } else if (mentionState.name === "dollah") {
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
