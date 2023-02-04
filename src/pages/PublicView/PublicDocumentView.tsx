import { ProgressSpinner } from "primereact/progressspinner";
import { useParams } from "react-router-dom";

import StaticRender from "../../components/Editor/StaticRender";
import { useGetItem } from "../../hooks/useGetItem";
import { AllItemsType } from "../../types/generalTypes";
import { toaster } from "../../utils/toast";

export default function PublicDocumentView() {
  const { item_id } = useParams();
  const { data, isLoading } = useGetItem<AllItemsType>(
    item_id as string,
    "documents",
    {
      staleTime: 5 * 60 * 1000,
    },
    true,
  );
  if (isLoading) return <ProgressSpinner />;
  if (!data?.isPublic && !isLoading) {
    toaster("warning", "That page is not public.");
    return null;
  }
  return (
    <div className="flex h-full w-full flex-col items-center overflow-hidden">
      <h1 className="w-full py-1 text-center font-Merriweather text-4xl">{data?.title}</h1>
      <div className=" w-4/5 flex-1 overflow-y-auto bg-zinc-700">
        {data && "content" in data && data?.content ? <StaticRender content={data.content} /> : null}
      </div>
    </div>
  );
}
