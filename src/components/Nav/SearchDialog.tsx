import { Icon } from "@iconify/react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { MarkerProps } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import {
  BoardNodeProps,
  BoardProps,
  DocumentProps,
  MapMarkerProps,
  MapProps,
} from "../../custom-types";
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
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (search && search.length >= 3) setLoading(true);
    else setLoading(false);
    const timeout = setTimeout(async () => {
      if (documents && maps && boards && search && search.length >= 3) {
        const initialData: Array<
          | DocumentProps
          | MapProps
          | BoardProps
          | BoardNodeProps
          | MapMarkerProps
        > = [
          ...documents.filter((doc) => !doc.folder && !doc.template),
          ...maps.filter((map) => !map.folder),
          ...maps.map((map) => map.markers).flat(),
          ...boards.filter((board) => !board.folder),
          ...boards.map((board) => board.nodes).flat(),
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
        setLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);
  return (
    <Dialog
      visible={typeof search === "string"}
      onHide={() => {
        setFilteredItems([]);
        setSearch(null);
      }}
      style={{
        width: "20rem",
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
        <span className="p-input-icon-right w-full mb-2">
          {loading && <i className="pi pi-spin pi-spinner text-white" />}
          <InputText
            placeholder="Enter at least 3 characters"
            className="w-full"
            value={search || ""}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            autoFocus={true}
          />
        </span>

        {filteredItems.map((item) => (
          <div className="my-1">
            <Link
              className="text-white no-underline text-lg"
              to={`./${
                item.content
                  ? "wiki/doc/"
                  : item.map_image
                  ? `maps/`
                  : item.map_id
                  ? `maps/${item.map_id}/`
                  : item.board_id
                  ? `boards/${item.board_id}/`
                  : "boards/"
              }${item.id}`}
              onClick={() => {
                setFilteredItems([]);
                setSearch(null);
              }}
            >
              <div>
                {item.content ? (
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
            </Link>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
