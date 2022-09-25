import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TimelineEventType } from "../../types/TimelineEventTypes";
import { useGetTimelineData } from "../../utils/customHooks";
import { TimelineEventCreateDefault } from "../../utils/defaultValues";
import { virtualScrollerSettings } from "../../utils/utils";
import { TimelineEventContext } from "../Context/TimelineEventContext";

type Props = {
  view: {
    details: "detailed" | "simple";
    horizontal: "horizontal" | "vertical";
  };
  setView: Dispatch<
    SetStateAction<{
      details: "detailed" | "simple";
      horizontal: "horizontal" | "vertical";
    }>
  >;
};

export default function TimelineQuickBar({ view, setView }: Props) {
  const { project_id, timeline_id, event_id } = useParams();
  const navigate = useNavigate();
  const { setShowDialog, setEventData } = useContext(TimelineEventContext);
  const timeline = useGetTimelineData(
    project_id as string,
    timeline_id as string
  );
  const [searchDialog, setSearchDialog] = useState(false);
  const [search, setSearch] = useState("");

  const [filteredNodes, setFilteredNodes] = useState<TimelineEventType[]>(
    timeline?.timeline_events || []
  );

  return (
    <div
      className="w-2 absolute border-round surface-50 text-white h-3rem flex align-items-center justify-content-around shadow-5"
      style={{
        top: "95.6vh",
        left: "50%",
        zIndex: 5,
      }}
    >
      <Dialog
        visible={searchDialog}
        onHide={() => {
          setSearchDialog(false);
          setSearch("");
          setFilteredNodes(timeline?.timeline_events || []);
        }}
        modal={false}
        header="Search Events"
        className="w-20rem"
        position={"center"}
      >
        <AutoComplete
          autoFocus
          className="ml-2 w-15rem"
          placeholder="Search Events"
          value={search}
          field="title"
          suggestions={filteredNodes}
          virtualScrollerOptions={virtualScrollerSettings}
          onSelect={(e) => navigate(`../${e.value.id}`)}
          completeMethod={(e) =>
            setFilteredNodes(
              timeline?.timeline_events.filter((timeline_event) =>
                timeline_event.title
                  ?.toLowerCase()
                  .includes(e.query.toLowerCase())
              ) || []
            )
          }
          itemTemplate={(item: TimelineEventType) => <span>{item.title}</span>}
          onChange={(e) => setSearch(e.value)}
        />
      </Dialog>

      <Button
        className={`p-button-text w-3rem h-3rem ${
          view.details === "detailed" && "p-button-secondary"
        }`}
        icon="pi pi-circle"
        tooltip="Simple View"
        tooltipOptions={{ position: "top" }}
        onClick={() => setView((prev) => ({ ...prev, details: "simple" }))}
      />
      <Button
        className={`p-button-text w-3rem h-3rem ${
          view.details === "simple" && "p-button-secondary"
        }`}
        icon="pi pi-id-card"
        tooltip="Detailed View"
        tooltipOptions={{ position: "top" }}
        onClick={() => setView((prev) => ({ ...prev, details: "detailed" }))}
      />
      <Button
        className="p-button-text w-3rem h-3rem"
        icon="pi pi-plus"
        tooltip="New Event"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          setShowDialog(true);
          setEventData(TimelineEventCreateDefault);
        }}
      />
      <Button
        className="p-button-text w-3rem h-3rem"
        icon="pi pi-search"
        tooltip="Search Event"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          setSearchDialog(true);
        }}
      />
      <Button
        className={`p-button-text w-3rem h-3rem ${
          view.horizontal === "vertical" && "p-button-secondary"
        }`}
        icon="pi pi-arrows-h"
        tooltip="Horizontal View"
        tooltipOptions={{ position: "top" }}
        onClick={() =>
          setView((prev) => ({ ...prev, horizontal: "horizontal" }))
        }
      />
      <Button
        className={`p-button-text w-3rem h-3rem ${
          view.horizontal === "horizontal" && "p-button-secondary"
        }`}
        icon="pi pi-arrows-v"
        tooltip="Vertical View"
        tooltipOptions={{ position: "top" }}
        onClick={() => setView((prev) => ({ ...prev, horizontal: "vertical" }))}
      />
    </div>
  );
}
