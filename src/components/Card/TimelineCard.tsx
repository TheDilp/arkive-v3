import { RemirrorJSON } from "remirror";

import StaticRender from "../Editor/StaticRender";

type Props = {
  isHorizontal: boolean;
  size: number;
  title: string;
  content: RemirrorJSON | undefined;
  description: string | undefined;
};

export default function TimelineCard({ isHorizontal, size, title, content, description }: Props) {
  return (
    <div
      className="p-card absolute top-[22.5%] h-72 w-72 max-w-[288px]"
      style={{
        left: isHorizontal ? "0" : "22.5%",
        width: isHorizontal ? `${size}px` : "",
      }}>
      <h3 className="p-card-title text-center ">{title}</h3>
      <div className="p-card-body h-[calc(100%-1.85rem)] overflow-hidden">
        <div className=" h-full w-full overflow-auto">
          {content ? (
            // @ts-ignore
            <StaticRender content={content} />
          ) : (
            <p>{description || ""}</p>
          )}
        </div>
      </div>
    </div>
  );
}
