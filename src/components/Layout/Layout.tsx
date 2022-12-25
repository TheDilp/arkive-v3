import { useQueries } from "@tanstack/react-query";
import { ConfirmDialog } from "primereact/confirmdialog";
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
      { queryKey: ["allItems", project_id, "boards"], queryFn: () => getItems(project_id as string, "boards") },
      { queryKey: ["allTags", project_id, "documents"], queryFn: () => getTags(project_id as string, "documents") },
      { queryKey: ["allTags", project_id, "maps"], queryFn: () => getTags(project_id as string, "maps") },
    ],
  });

  if (results.some((query) => !query.isFetched)) return <ProgressSpinner />;
  return (
    <div className="flex flex-col flex-1">
      <ConfirmDialog />

      <DialogWrapper />
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex flex-1 w-full">
        <Drawer />
        <div className="flex w-1/6 max-w-[20%] flex-col">
          <Sidebar />
        </div>
        <div className="flex flex-1 h-full">
          <div className="flex flex-col flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
