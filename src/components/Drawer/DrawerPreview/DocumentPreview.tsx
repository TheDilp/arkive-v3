import { RemirrorJSON } from "remirror";

import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import StaticRender from "../../Editor/StaticRender";
import LoadingScreen from "../../Loading/LoadingScreen";

type Props = {
  id: string;
  isReadOnly?: boolean;
};

export default function DocumentPreview({ id, isReadOnly }: Props) {
  const { data, isFetching } = useGetItem<DocumentType>(id, "documents", { staleTime: 60 * 1000 }, isReadOnly);
  if (isFetching) return <LoadingScreen />;
  if (!data) return <span>This document is not public.</span>;

  return (
    <div className="flex h-full flex-col gap-y-2 font-Lato">
      <h2 className="text-center text-4xl">
        <div className="flex items-center justify-center">{data?.title}</div>
      </h2>
      <StaticRender content={data.content as RemirrorJSON} isReadOnly={isReadOnly} />
    </div>
  );
}
