import StaticRender from "../../components/Editor/StaticRender";
import { AllItemsType } from "../../types/generalTypes";

export default function PublicDocumentView({ data }: { data: AllItemsType }) {
  return (
    <div className="min-h-full px-[16.67%]">
      <h1 className="w-full pt-3 pb-2 text-center font-Merriweather text-4xl">{data?.title}</h1>
      <div className="max-h-full min-h-full overflow-y-auto bg-zinc-700">
        {"content" in data && data?.content ? <StaticRender content={data.content} /> : null}
      </div>
    </div>
  );
}
