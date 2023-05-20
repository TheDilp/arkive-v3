import { Card } from "primereact/card";

import { TimelineDisplayEventType, TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import StaticRender from "../Editor/StaticRender";

function TimelineCardHeader({
  title,
  subTitle,
  backgroundImage,
}: {
  title: string;
  subTitle: string;
  backgroundImage?: string;
}) {
  return (
    <div className="relative px-4 pt-4">
      {backgroundImage ? (
        <img alt={title} className="absolute top-0 left-0 z-0 h-full w-full object-cover brightness-75" src={backgroundImage} />
      ) : null}
      <h2 className="relative z-10 text-2xl font-bold">{title}</h2>
      <p className="relative z-10 text-lg font-semibold text-zinc-300">{subTitle}</p>
    </div>
  );
}

export default function TimelineCard(
  { year, month, day, title, document, description, backgroundImage }: TimelineDisplayEventType,
  viewSettings: TimelineViewSettings,
) {
  const date = `${day} ${month.title} ${year}`;
  const {
    view: { value: viewMode },
    mode: { value: mode },
  } = viewSettings;

  if (mode === "Simple") return title;

  return (
    <Card
      className={`max-h-full overflow-y-auto ${viewMode === "Horizontal" ? "min-w-[36rem]" : "min-w-[20rem]"}`}
      header={() => TimelineCardHeader({ title, subTitle: date, backgroundImage })}>
      <div className=" ">
        {document?.content ? (
          // @ts-ignore
          <StaticRender content={document.content} />
        ) : (
          <p>{description || ""}</p>
        )}
      </div>
    </Card>
  );
}
