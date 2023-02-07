import { Navigate, useParams } from "react-router-dom";

import StaticRender from "../../components/Editor/StaticRender";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useGetItem } from "../../hooks/useGetItem";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { toaster } from "../../utils/toast";

export default function PublicDocumentView() {
  const { item_id, type } = useParams();
  const { data, isLoading } = useGetItem<AllItemsType>(
    item_id as string,
    type as AvailableItemTypes,
    { staleTime: 60 * 1000 },
    true,
  );

  if (isLoading) return <LoadingScreen />;
  if (!data?.isPublic && !isLoading) {
    toaster("warning", "That page is not public.");
    return <Navigate to="/" />;
  }
  return (
    <div className="min-h-full overflow-hidden px-[16.67%]">
      <h1 className="w-full pt-3 pb-2 text-center font-Merriweather text-4xl">{data?.title}</h1>
      <div className="max-h-full min-h-full overflow-y-auto bg-zinc-700 pb-24">
        {data && "content" in data && data?.content ? <StaticRender content={data.content} /> : null}
      </div>
    </div>
  );
}
