import { MentionAtomPopupComponent, MentionAtomState } from "@remirror/react";
import React, { useMemo, useState } from "react";

interface MentionComponentProps {
  documents?: {
    id: string;
    label: string;
  }[];
}
export default function MentionComponent({ documents }: MentionComponentProps) {
  const [mentionState, setMentionState] = useState<MentionAtomState | null>();
  const documentItems = useMemo(
    () =>
      (documents ?? []).map((doc) => ({
        id: doc.id,
        label: `${doc.label}`,
        href: doc.id,
      })),
    [documents]
  );
  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }

    const query = mentionState.query.full.toLowerCase() ?? "";
    return documentItems
      .filter((item) => item.label.toLowerCase().includes(query))
      .sort();
  }, [mentionState, documentItems]);

  //   @ts-ignore
  return <MentionAtomPopupComponent onChange={setMentionState} items={items} />;
}
