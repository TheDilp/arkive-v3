import { useQueries } from "@tanstack/react-query";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Outlet, useParams } from "react-router-dom";

import { getItems } from "../../utils/CRUD/CRUDFunctions";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const { project_id } = useParams();
  useQueries({
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
