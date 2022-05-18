import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useVirtual } from "react-virtual";
import { useGetImages } from "../../utils/customHooks";
import { FileObject } from "../../utils/utils";
import LoadingScreen from "../Util/LoadingScreen";
import FileBrowserHeader from "./FileBrowserHeader";
import ListItem from "./ListItem";

type Props = {};

export default function FileBrowser({}: Props) {
  const { project_id } = useParams();
  const [layout, setLayout] = useState("list");
  const images = useGetImages(project_id as string);
  const [filter, setFilter] = useState("");
  const parentRef = useRef() as any;

  const rowVirtualizer = useVirtual({
    size:
      images?.data.filter((image) => image.name.includes(filter)).length || 0,
    parentRef,
    estimateSize: useCallback(() => 75, []),
    overscan: 5,
  });

  const renderGridItem = (data: FileObject) => {
    return (
      <div className="col-2">
        <div className="flex flex-wrap justify-content-center align-items-bottom">
          <div className="w-full flex justify-content-center pt-2">
            <img
              loading="lazy"
              className="w-6"
              src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${project_id}/${data.name}`}
              alt="TEST"
            />
          </div>
          <div className="text-center text-2xl mb-2">{data.name}</div>
        </div>
      </div>
    );
  };
  const itemTemplate = (image: FileObject, layout: string) => {
    if (!image) {
      return;
    }

    if (layout === "list") return renderListItem(image);
    else if (layout === "grid") return renderGridItem(image);
  };

  return (
    <div className="w-full px-8 mt-2">
      {images?.isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="w-full h-full flex flex-wrap justify-content-center align-content-start">
          <FileBrowserHeader
            refetch={images?.refetch}
            filter={filter}
            setFilter={setFilter}
            layout={layout}
            setLayout={setLayout}
          />
          <div
            ref={parentRef}
            className="List w-10"
            style={{
              height: `85%`,
              overflow: "auto",
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.totalSize}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.virtualItems.map((virtualRow) => (
                <div
                  key={virtualRow.index}
                  className={`flex ${
                    virtualRow.index % 2
                      ? "FileBrowserListItemOdd"
                      : "FileBrowserListItemEven"
                  }`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <ListItem
                    name={
                      images?.data.filter((image) =>
                        image.name.includes(filter)
                      )[virtualRow.index].name || ""
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
