import { MentionAtomPopupComponent, MentionAtomState } from "@remirror/react";
import { useMemo, useState } from "react";

interface MentionComponentProps {
  documents?: {
    id: string;
    title: string;
  }[];
  maps?: {
    id: string;
    title: string;
  }[];
}
export default function MentionComponent({
  documents,
  maps,
}: MentionComponentProps) {
  const [mentionState, setMentionState] = useState<MentionAtomState | null>();
  const documentItems = useMemo(
    () =>
      (documents ?? []).map((doc) => ({
        id: doc.id,
        label: `${doc.title}`,
      })),
    [documents]
  );
  const mapsItems = useMemo(
    () => (maps ?? []).map((map) => ({ id: map.id, label: map.title })),
    [maps]
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
      : mapsItems
          .filter((item) => item.label.toLowerCase().includes(query))
          .sort();
  }, [mentionState, documentItems]);
  //   @ts-ignore
  return <MentionAtomPopupComponent onChange={setMentionState} items={items} />;
}
