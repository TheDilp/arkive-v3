import { useQueries } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { SidebarCollapseAtom } from "../../utils/Atoms/atoms";
import { getItems } from "../../utils/CRUD/CRUDFunctions";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import SecondarySidebar from "../Sidebar/SecondarySidebar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const { project_id } = useParams();
  const [sidebarToggle] = useAtom(SidebarCollapseAtom);
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
    ],
  });
  const allFetched = results.every((res) => res.isSuccess);

  return (
    <div className="flex h-full overflow-hidden">
      <ConfirmDialog />

      <DialogWrapper />
      <Sidebar />

      <div
        className={`flex ${
          sidebarToggle ? "w-[25rem]  opacity-100" : "w-0 opacity-0"
        } max-w-[25rem] flex-col overflow-hidden bg-zinc-900 transition-all`}>
        <SecondarySidebar isLoading={!allFetched} />
      </div>
      <div className="relative flex h-full w-full flex-col">
        <div className="">
          <Navbar />
          <Drawer />
        </div>

        <div className="flex h-full w-full flex-1">
          <div className="flex h-full w-full flex-1 flex-col">
            {allFetched ? (
              <Suspense fallback={<ProgressSpinner />}>
                <Outlet />
              </Suspense>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
