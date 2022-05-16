import { MentionAtomPopupComponent, MentionState } from "@remirror/react";
import { useMemo, useState } from "react";
import { DocumentProps, MapProps, BoardProps } from "../../custom-types";
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
    return mentionState.name === "at"
      ? documentItems
          .filter((item) => item.label.toLowerCase().includes(query))
          .sort()
      : mentionState.name === "hash"
      ? mapItems
          .filter((item) => item.label.toLowerCase().includes(query))
          .sort()
      : boardItems
          .filter((item) => item.label.toLowerCase().includes(query))
          .sort();
  }, [mentionState]);

  //   @ts-ignore
  return (
    <MentionAtomPopupComponent
      onChange={setMentionState}
      items={items}
      ignoreMatchesOnDismiss={true}
    />
  );
}
