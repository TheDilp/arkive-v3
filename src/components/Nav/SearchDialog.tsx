import { Icon } from "@iconify/react";
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DocumentProps, MapMarkerProps, MapProps } from "../../custom-types";
import { BoardNodeProps, BoardProps } from "../../types/BoardTypes";
import {
  useGetBoards,
  useGetDocuments,
  useGetMaps,
} from "../../utils/customHooks";
type Props = {
  search: string | null;
  setSearch: (visible: string | null) => void;
};
export default function SearchDialog({ search, setSearch }: Props) {
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
            console.log(item);
            return <div>{item.title || item.label || item.text} </div>;
          }}
          onSelect={(e) => {
            const item = e.value;
            navigate(
              `./${
                item.content || item.content === null
                  ? "wiki/doc/"
                  : item.map_image
                  ? `maps/`
                  : item.map_id
                  ? `maps/${item.map_id}/`
                  : item.board_id
                  ? `boards/${item.board_id}/`
                  : "boards/"
              }${item.id}`
            );
          }}
          itemTemplate={(item) => (
            <div
              className="text-white text-lg"
              onClick={(e) => {
                setFilteredItems([]);
                setSearch(null);
              }}
            >
              {item.content || item.content === null ? (
                <Icon icon={item.icon} />
              ) : item.map_image ? (
                <Icon icon={"mdi:map"} />
              ) : item.map_id ? (
                <Icon icon="mdi:map-marker" />
              ) : item.board_id ? (
                <Icon icon={"mdi:vector-polyline"} />
              ) : (
                <Icon icon={"mdi:draw"} />
              )}

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
