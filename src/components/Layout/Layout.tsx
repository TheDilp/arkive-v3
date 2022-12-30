import { useQueries } from "@tanstack/react-query";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Outlet, useParams } from "react-router-dom";

import { getItems } from "../../utils/CRUD/CRUDFunctions";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const { project_id } = useParams();
  const results = useQueries({
    queries: [
      {
        queryKey: ["allItems", project_id, "documents"],
        queryFn: async () => getItems(project_id as string, "documents"),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["allItems", project_id, "maps"],
        queryFn: async () => getItems(project_id as string, "maps"),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["allItems", project_id, "boards"],
        queryFn: async () => getItems(project_id as string, "boards"),
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  if (!results.every((res) => res.isSuccess)) return <ProgressSpinner />;

  return (
    <div className="flex flex-1 flex-col">
      <ConfirmDialog />

      <DialogWrapper />
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex w-full flex-1">
        <Drawer />
        <div className="flex w-1/6 max-w-[20%] flex-col">
          <Sidebar />
        </div>
        <div className="flex h-full flex-1">
          <div className="flex flex-1 flex-col">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
