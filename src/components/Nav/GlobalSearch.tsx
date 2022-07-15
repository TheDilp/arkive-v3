import { Icon } from "@iconify/react";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentProps } from "../../custom-types";
import { BoardNodeProps, BoardProps } from "../../types/BoardTypes";
import { MapMarkerProps, MapProps } from "../../types/MapTypes";
import {
  useGetBoards,
  useGetDocuments,
  useGetMaps,
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
  const [filteredItems, setFilteredItems] = useState<
    Array<
      DocumentProps | MapProps | BoardProps | BoardNodeProps | MapMarkerProps
    >
  >([]);
  const [categories, setCategories] = useState([
    "Docs",
    "Maps",
    "Markers",
    "Boards",
    "Nodes",
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    if (documents && maps && boards && search && search.length >= 3) {
      const timeout = setTimeout(async () => {
        const initialData: Array<
          | DocumentProps
          | MapProps
          | BoardProps
          | BoardNodeProps
          | MapMarkerProps
        > = [
          ...(categories.includes("Docs")
            ? documents.filter((doc) => !doc.folder && !doc.template)
            : []),
          ...(categories.includes("Maps")
            ? maps.filter((map) => !map.folder)
            : []),
          ...(categories.includes("Markers")
            ? maps.map((map) => map.markers).flat()
            : []),
          ...(categories.includes("Boards")
            ? boards.filter((board) => !board.folder)
            : []),
          ...(categories.includes("Nodes")
            ? boards.map((board) => board.nodes).flat()
            : []),
        ];
        let data = initialData.filter((item) => {
          if (!item) return false;
          if ("content" in item) {
            return (
              JSON.stringify(item.content)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              item.title.toLowerCase().includes(search.toLowerCase())
            );
          } else {
            if ("title" in item) {
              return item.title?.toLowerCase().includes(search.toLowerCase());
            } else if ("label" in item) {
              return item.label?.toLowerCase().includes(search.toLowerCase());
            } else if ("text" in item) {
              return item.text?.toLowerCase().includes(search.toLowerCase());
            }
          }
        });
        if (data) setFilteredItems(data);
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
    } else {
      navigate(`./boards/${item.id}`);
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
    else {
      return <Icon icon={"mdi:draw"} />;
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
          className="w-full"
          options={["Docs", "Maps", "Markers", "Boards", "Nodes"]}
          multiple
          value={categories}
          onChange={(e) => setCategories(e.value)}
        />
        <AutoComplete
          className="w-full mt-2"
          inputClassName="w-full"
          placeholder="Enter at least 3 characters"
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
              className="text-white text-lg"
              onClick={(e) => {
                setFilteredItems([]);
                setSearch(null);
              }}
            >
              {displayIcon(item)}

              {item.title || item.label || item.text}
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
