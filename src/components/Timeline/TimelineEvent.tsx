import { SetStateAction } from "jotai";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { EventType } from "../../types/ItemTypes/calendarTypes";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { DocumentMentionTooltip } from "../Mention/DocumentMention";
import { Tooltip } from "../Tooltip/Tooltip";

type Props = {
  event: EventType;
  setDrawer: (update: SetStateAction<DrawerAtomType>) => void;
};

export default function TimelineEvent({ event, setDrawer }: Props) {
  return (
    <Tooltip
      content={
        event?.documentsId ? (
          <DocumentMentionTooltip id={event?.documentsId} />
        ) : (
          <div className="max-h-56 max-w-xs overflow-auto break-words rounded bg-black p-2">{event?.description}</div>
        )
      }
      customOffset={{
        mainAxis: 5,
      }}
      disabled={!event?.documentsId && !event?.description}>
      <div
        className="max-h-fit max-w-fit rounded px-2 transition-all duration-100 hover:brightness-125"
        onClick={() =>
          setDrawer({
            ...DefaultDrawer,
            show: true,
            type: "events",
            data: event,
            drawerSize: "sm",
          })
        }
        onKeyDown={() => {}}
        role="button"
        style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
        tabIndex={-1}>
        {event.title}
      </div>
    </Tooltip>
  );
}