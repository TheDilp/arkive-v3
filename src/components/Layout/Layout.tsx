import { useQueries } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { Outlet, useParams } from "react-router-dom";

import { getItems, getTags } from "../../utils/CRUD/CRUDFunctions";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const { project_id } = useParams();

  const results = useQueries({
    queries: [
      { queryKey: ["allItems", project_id, "documents"], queryFn: () => getItems(project_id as string, "documents") },
      { queryKey: ["allItems", project_id, "maps"], queryFn: () => getItems(project_id as string, "maps") },
      { queryKey: ["allTags", project_id, "documents"], queryFn: () => getTags(project_id as string, "documents") },
      { queryKey: ["allTags", project_id, "maps"], queryFn: () => getTags(project_id as string, "maps") },
    ],
  });

  if (results.some((query) => !query.isFetched)) return <ProgressSpinner />;
  return (
    <div className="flex flex-1 flex-col">
      <DialogWrapper />
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex w-full flex-1">
        <Drawer />
        <div className="flex w-1/6 max-w-[20%] flex-col">
          <Sidebar />
        </div>
        {/* <div className="w-5/6 outletWrapper"> */}
        <div className="flex h-full flex-1">
          <div className="flex flex-1 flex-col">
            <Outlet />
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
