import { Card } from "primereact/card";

import { TimelineDisplayEventType, TimelineViewSettings } from "../../types/ItemTypes/timelineTypes";
import StaticRender from "../Editor/StaticRender";

export default function TimelineCard(
  { year, month, day, title, document, description }: TimelineDisplayEventType,
  viewSettings: TimelineViewSettings,
) {
  const date = `${day} ${month.title} ${year}`;
  const {
    view: { value: viewMode },
    mode: { value: mode },
  } = viewSettings;

  if (mode === "Simple") return title;

  return (
    <Card className={`${viewMode === "Horizontal" ? "min-w-[36rem]" : "min-w-[20rem]"}`} subTitle={date} title={title}>
      <div className="h-56 overflow-auto">
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
