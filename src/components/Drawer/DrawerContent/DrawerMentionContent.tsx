import { useAtom } from "jotai";

import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { MentionContextAtom } from "../../../utils/Atoms/atoms";
import StaticRender from "../../Editor/StaticRender";

export default function DrawerMentionContent() {
  const [mention] = useAtom(MentionContextAtom);

  const { data, isLoading } = useGetItem<DocumentType>(mention?.data?.id as string, "documents");
  if (data?.content && !isLoading) return <StaticRender content={data.content} />;
  return null;
}
