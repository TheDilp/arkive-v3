import StaticRender from "../../components/Editor/StaticRender";
import { AllItemsType } from "../../types/generalTypes";

export default function PublicDocumentView({ data }: { data: AllItemsType }) {
  return (
    <div className="flex h-full w-full flex-col items-center overflow-hidden">
      <h1 className="w-full text-center font-Merriweather text-4xl">{data?.title}</h1>
      <div className=" w-4/5 flex-1 overflow-y-auto bg-zinc-700">
        {"content" in data && data?.content ? <StaticRender content={data.content} /> : null}
      </div>
    </div>
  );
}
