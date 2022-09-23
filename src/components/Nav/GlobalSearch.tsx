import { Icon } from "@iconify/react";
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentProps as DocumentType } from "../../custom-types";
import {
  BoardNodeProps as BoardNodeType,
  BoardProps as BoardType,
} from "../../types/BoardTypes";
import {
  MapMarkerProps as MapMarkerType,
  MapProps as MapType,
} from "../../types/MapTypes";
import { TimelineEventType } from "../../types/TimelineEventTypes";
import { TimelineType } from "../../types/TimelineTypes";
import {
  useGetBoards,
  useGetDocuments,
  useGetMaps,
  useGetTimelines,
} from "../../utils/customHooks";
type Props = {
  search: string | null;
  setSearch: (visible: string | null) => void;
};
export default function GlobalSearch({ search, setSearch }: Props) {
  const { project_id } = useParams();
  const { data: documents } = useGetDocuments(project_id as string);
  const { data: maps } = useGetMaps(project_id as string);
  const { data: boards } = useGetBoards(project_id as string);
  const { data: timelines } = useGetTimelines(project_id as string);
  const [filteredItems, setFilteredItems] = useState<
    {
      category: string;
      items: (
        | DocumentType
        | MapType
        | BoardType
        | BoardNodeType
        | MapMarkerType
        | TimelineType
        | TimelineEventType
      )[];
    }[]
  >([]);
  const [categories, setCategories] = useState([
    "Docs",
    "Maps",
    "Markers",
    "Boards",
    "Nodes",
    "Timelines",
    "Events",
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      documents &&
      maps &&
      boards &&
      timelines &&
      search &&
      search.length >= 3
    ) {
      const timeout = setTimeout(async () => {
        let filteredDocs: DocumentType[] = [];
        let filteredMaps: MapType[] = [];
        let filteredMarkers: MapMarkerType[] = [];
        let filteredBoards: BoardType[] = [];
        let filteredNodes: BoardNodeType[] = [];
        let filteredTimelines: TimelineType[] = [];
        let filteredTimelineEvents: TimelineEventType[] = [];
        if (categories.includes("Docs")) {
          filteredDocs = documents.filter(
            (doc) => !doc.folder && !doc.template
          );
        }
        if (categories.includes("Maps")) {
          filteredMaps = maps.filter((map) => !map.folder);
        }
        if (categories.includes("Markers")) {
          // If maps have been already filtered save on performance
          // Unfiltered maps have folders removed which would be skipped anyway
          if (filteredMaps.length > 0) {
            filteredMarkers = filteredMaps.map((map) => map.markers).flat();
          } else {
            filteredMarkers = maps.map((map) => map.markers).flat();
          }
        }
        if (categories.includes("Boards")) {
          filteredBoards = boards.filter((board) => !board.folder);
        }
        if (categories.includes("Nodes")) {
          // If boards have been already filtered save on performance
          // Unfiltered boards have folders removed which would be skipped anyway
          if (filteredBoards.length > 0) {
            filteredNodes = filteredBoards.map((board) => board.nodes).flat();
          } else {
            filteredNodes = boards.map((board) => board.nodes).flat();
          }
        }
        if (categories.includes("Timelines")) {
          filteredTimelines = timelines.filter((timeline) => !timeline.folder);
        }
        if (categories.includes("Events")) {
          // If timelines have been already filtered save on performance
          // Unfiltered timelines have folders removed which would be skipped anyway
          if (filteredTimelines.length > 0) {
            filteredTimelineEvents = filteredTimelines
              .map((timeline) => timeline.timeline_events)
              .flat();
          } else {
            filteredTimelineEvents = timelines
              .map((timeline) => timeline.timeline_events)
              .flat();
          }
        }

        let initialData: {
          category: string;
          items: (
            | DocumentType
            | MapType
            | BoardType
            | BoardNodeType
            | MapMarkerType
            | TimelineType
            | TimelineEventType
          )[];
        }[] = [];
        initialData.push({
          category: "Documents",
          items: filteredDocs.filter((doc) => {
            return (
              JSON.stringify(doc.content)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              doc.title.toLowerCase().includes(search.toLowerCase()) ||
              doc.alter_names?.some((name) =>
                name.toLowerCase().includes(search.toLowerCase())
              )
            );
          }),
        });
        initialData.push({
          category: "Maps",
          items: filteredMaps.filter((map) => {
            return map.title?.toLowerCase().includes(search.toLowerCase());
          }),
        });
        initialData.push({
          category: "Markers",
          items: filteredMarkers.filter((marker) => {
            return marker.text?.toLowerCase().includes(search.toLowerCase());
          }),
        });
        initialData.push({
          category: "Boards",
          items: filteredBoards.filter((board) => {
            return board.title?.toLowerCase().includes(search.toLowerCase());
          }),
        });
        initialData.push({
          category: "Nodes",
          items: filteredNodes.filter((node) => {
            return node.label?.toLowerCase().includes(search.toLowerCase());
          }),
        });
        initialData.push({
          category: "Timelines",
          items: filteredTimelines.filter((timeline) => {
            return timeline.title?.toLowerCase().includes(search.toLowerCase());
          }),
        });
        initialData.push({
          category: "Events",
          items: filteredTimelineEvents.filter((event) => {
            return event.title?.toLowerCase().includes(search.toLowerCase());
          }),
        });

        if (initialData) setFilteredItems(initialData);
        else setFilteredItems([]);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [search]);

  // Determine where to navigate based on the type of item
  function navigateTo(item: any) {
    // Document
    if (item.content || item.content === null) {
      navigate(`./wiki/doc/${item.id}`);
    }
    // Map
    else if (item.map_image) {
      navigate(`./maps/${item.id}`);
    }
    // Map marker -> goes to map that's linked to it
    else if (item.map_id) {
      navigate(`./maps/${item.map_id}/${item.id}`);
    } else if (item.board_id) {
      navigate(`./boards/${item.board_id}/${item.id}`);
    } else if (item.defaultNodeColor) {
      navigate(`./boards/${item.id}`);
    } else if (item.timeline_id) {
      navigate(`./timelines/${item.timeline_id}/${item.id}`);
    } else {
      navigate(`./timelines/${item.id}`);
    }
  }

  // Display Icon based on the item
  function displayIcon(item: any) {
    // Document
    if (item.content || item.content === null) {
      return <Icon icon={item.icon} />;
    }
    // Map
    else if (item.map_image) {
      return <Icon icon={"mdi:map"} />;
    }
    // Map marker
    else if (item.map_id) {
      return <Icon icon="mdi:map-marker" />;
    }
    // Board node
    else if (item.board_id) {
      return <Icon icon={"mdi:vector-polyline"} />;
    }
    // Board
    else if (item.defaultNodeColor) {
      return <Icon icon={"mdi:draw"} />;
    }
    // Timeline Event
    else if (item.timeline_id) {
      return <Icon icon={item.icon} />;
    }
    // Timeline
    else {
      return <Icon icon="mdi:chart-timeline-variant" />;
    }
  }

  // Display map, board or timeline in parenthesese if it's a marker, node or timeline
  function displayMapBoardTimeline(item: any) {
    if (item.map_id) {
      const map = maps?.find((map) => map.id === item.map_id);
      if (map) return map.title;
    } else if (item.board_id) {
      const board = boards?.find((board) => board.id === item.board_id);
      if (board) return board.title;
    } else if (item.timeline_id) {
      const timeline = timelines?.find(
        (timeline) => timeline.id === item.timeline_id
      );
      if (timeline) return timeline.title;
    } else {
      return "";
    }
  }

  return (
    <Dialog
      visible={typeof search === "string"}
      onHide={() => {
        setFilteredItems([]);
        setSearch(null);
      }}
      style={{
        width: "28rem",
        height: "18rem",
      }}
      position="top-right"
      modal={false}
      header={
        <div>
          Global Search <i className="pi pi-search"></i>
        </div>
      }
    >
      <div className="w-full">
        <SelectButton
          className="w-full flex flex-wrap justify-content-center"
          options={[
            "Docs",
            "Maps",
            "Markers",
            "Boards",
            "Nodes",
            "Timelines",
            "Events",
          ]}
          multiple
          value={categories}
          onChange={(e) => setCategories(e.value)}
        />
        <AutoComplete
          className="w-full mt-2"
          inputClassName="w-full"
          placeholder="Enter at least 3 characters"
          optionGroupLabel="category"
          optionGroupChildren="items"
          optionGroupTemplate={(item) => (
            <div className="py-1 border-bottom-1">{item.category}</div>
          )}
          suggestions={filteredItems}
          value={search}
          selectedItemTemplate={(item) => {
            return <div>{item.title || item.label || item.text} </div>;
          }}
          onSelect={(e) => {
            const item = e.value;
            navigateTo(item);
          }}
          itemTemplate={(item) => (
            <div
              className="text-white text-lg white-space-nowrap overflow-hidden text-overflow-ellipsis w-20rem"
              onClick={(e) => {
                setFilteredItems([]);
                setSearch(null);
              }}
            >
              {displayIcon(item)}
              {item.title || item.label || item.text}{" "}
              {(item.map_id || item.board_id || item.timeline_id) &&
                `(${displayMapBoardTimeline(item)})`}
            </div>
          )}
          completeMethod={(e) => {
            setSearch(e.query);
          }}
        />
      </div>
    </Dialog>
  );
}
