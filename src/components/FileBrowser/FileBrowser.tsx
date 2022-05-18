import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useVirtual } from "react-virtual";
import { useGetImages } from "../../utils/customHooks";
import { uploadImage } from "../../utils/supabaseUtils";
import { FileObject } from "../../utils/utils";
import LoadingScreen from "../Util/LoadingScreen";
import ListItem from "./ListItem";

type Props = {};

export default function FileBrowser({}: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [layout, setLayout] = useState("list");
  const images = useGetImages(project_id as string);
  const [filter, setFilter] = useState("");
  const parentRef = useRef() as any;

  const rowVirtualizer = useVirtual({
    size: images?.data.length || 0,
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
  const header = (
    <div className="grid grid-nogutter">
      <div className="col-6 flex " style={{ textAlign: "left" }}>
        <FileUpload
          mode="basic"
          name="demo[]"
          accept="image/*"
          maxFileSize={1000000}
          auto
          customUpload
          uploadHandler={async (e) => {
            let file = e.files[0];
            await uploadImage(project_id as string, file);
            images?.refetch();
            e.options.clear();
          }}
        />
        <InputText
          placeholder="Search by title"
          className="ml-2"
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="col-6" style={{ textAlign: "right" }}>
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full px-8 mt-2 flex justify-content-center">
      {images?.isLoading ? (
        <LoadingScreen />
      ) : (
        <div
          ref={parentRef}
          className="List w-10"
          style={{
            height: `100%`,
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
                className={
                  virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ListItem name={images?.data[virtualRow.index].name || ""} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
