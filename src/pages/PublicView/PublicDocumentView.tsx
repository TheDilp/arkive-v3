import { useParams } from "react-router-dom";

import StaticRender from "../../components/Editor/StaticRender";
import { useGetItem } from "../../hooks/useGetItem";
import { DocumentType } from "../../types/documentTypes";

export default function PublicDocumentView() {
  const { item_id } = useParams();
  const { data: documentData } = useGetItem(item_id as string, "documents") as { data: DocumentType };

  return (
    <div className="min-h-full px-[16.67%]">
      <h1 className="w-full pt-3 pb-2 text-center font-Merriweather text-4xl">{documentData?.title}</h1>
      <div className="max-h-full min-h-full overflow-y-auto bg-zinc-700">
        {documentData?.content ? <StaticRender content={documentData.content} /> : null}
      </div>
    </div>
  );
}
