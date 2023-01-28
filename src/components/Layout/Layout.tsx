import { useQueries } from "@tanstack/react-query";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { getItems } from "../../utils/CRUD/CRUDFunctions";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import LoadingScreen from "../Loading/LoadingScreen";
import Navbar from "../Nav/Navbar";
import SecondarySidebar from "../Sidebar/SecondarySidebar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const { project_id } = useParams();
  const user = useAuth();
  const results = useQueries({
    queries: [
      {
        queryKey: ["allItems", project_id, "documents"],
        queryFn: async () => getItems(project_id as string, "documents"),
        staleTime: 5 * 60 * 1000,
        enabled: !!user,
      },
      {
        queryKey: ["allItems", project_id, "maps"],
        queryFn: async () => getItems(project_id as string, "maps"),
        staleTime: 5 * 60 * 1000,
        enabled: !!user,
      },
      {
        queryKey: ["allItems", project_id, "boards"],
        queryFn: async () => getItems(project_id as string, "boards"),
        staleTime: 5 * 60 * 1000,
        enabled: !!user,
      },
      {
        queryKey: ["allItems", project_id, "screens"],
        queryFn: async () => getItems(project_id as string, "screens"),
        staleTime: 5 * 60 * 1000,
        enabled: !!user,
      },
    ],
  });
  const allFetched = results.every((res) => res.isSuccess);

  return (
    <div className="flex h-full max-w-full overflow-hidden">
      <ConfirmDialog />

      <DialogWrapper />
      <Sidebar />
      <SecondarySidebar isLoading={!allFetched} />
      <Drawer />

      <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <Navbar />
        {allFetched ? (
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
