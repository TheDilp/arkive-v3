import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetImages } from "../../utils/customHooks";
import LoadingScreen from "../Util/LoadingScreen";
import FileBrowserHeader from "./FileBrowserHeader";
import GridLayout from "./GridLayout";
import ListLayout from "./ListLayout";

export default function FileBrowser() {
  const { project_id } = useParams();
  const [layout, setLayout] = useState("list");
  const images = useGetImages(project_id as string);
  const [filter, setFilter] = useState("");
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
          {layout === "list" && (
            <ListLayout images={images?.data || []} filter={filter} />
          )}
          {layout === "grid" && (
            <GridLayout images={images?.data || []} filter={filter} />
          )}
        </div>
      )}
    </div>
  );
}
