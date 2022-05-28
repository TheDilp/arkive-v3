import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetImages } from "../../utils/customHooks";
import FilebrowserProvider, {
  FileBrowserContext,
} from "../Context/FileBrowserContext";
import LoadingScreen from "../Util/LoadingScreen";
import FileBrowserHeader from "./FileBrowserHeader";
import GridLayout from "./GridLayout";
import ListLayout from "./ListLayout";

export default function FileBrowser() {
  const { project_id } = useParams();
  const images = useGetImages(project_id as string);
  const { layout } = useContext(FileBrowserContext);
  return (
    <div
      className="w-full px-8 mt-2 overflow-y-auto"
      style={{
        height: "94.9vh",
      }}
    >
      {images?.isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="w-full flex flex-wrap justify-content-center align-content-start">
          <FileBrowserHeader />
          {layout === "list" && <ListLayout images={images?.data || []} />}
          {layout === "grid" && <GridLayout images={images?.data || []} />}
        </div>
      )}
    </div>
  );
}
