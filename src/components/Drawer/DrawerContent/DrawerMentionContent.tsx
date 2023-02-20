import { useAtom } from "jotai";

import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { OtherContextMenuAtom } from "../../../utils/Atoms/atoms";
import StaticRender from "../../Editor/StaticRender";

export default function DrawerMentionContent() {
  const [mention] = useAtom(OtherContextMenuAtom);

  const { data, isLoading } = useGetItem<DocumentType>(mention?.data?.id as string, "documents");
  if (data?.content && !isLoading)
    return (
      <div>
        <h2 className="text-center font-Merriweather text-3xl">{data.title}</h2>
        <StaticRender content={data.content} />
      </div>
    );
  return null;
}
