import { RemirrorJSON } from "remirror";

import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import StaticRender from "../../Editor/StaticRender";

type Props = {
  id: string;
  isReadOnly?: boolean;
};

export default function DocumentPreview({ id, isReadOnly }: Props) {
  const { data, isFetching } = useGetItem<DocumentType>(id, "documents", { staleTime: 60 * 1000 }, isReadOnly);
  if (isFetching) return null;
  if (!data) return <span>This document is not public.</span>;

  return <StaticRender content={data.content as RemirrorJSON} isReadOnly={isReadOnly} />;
}
