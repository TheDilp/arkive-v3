import { RemirrorJSON } from "remirror";

import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import StaticRender from "../../Editor/StaticRender";

type Props = {
  id: string;
};

export default function DocumentPreview({ id }: Props) {
  const { data, isFetching } = useGetItem<DocumentType>(id, "documents", { staleTime: 60 * 1000 });

  if (isFetching || !data) return null;

  return <StaticRender content={data.content as RemirrorJSON} />;
}
