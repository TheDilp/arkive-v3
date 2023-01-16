import { useQueries } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Outlet, useParams } from "react-router-dom";

import { SidebarCollapseAtom } from "../../utils/Atoms/atoms";
import { getItems } from "../../utils/CRUD/CRUDFunctions";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const { project_id } = useParams();
  const [sidebarToggle] = useAtom(SidebarCollapseAtom);

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
    <div className="flex h-screen flex-col overflow-hidden">
      <ConfirmDialog />

      <DialogWrapper />
      <div className="w-full">
        <Navbar />
      </div>
      <div className="relative flex h-full w-full">
        <Drawer />

        <div
          className={`flex ${
            sidebarToggle ? "w-1/6 opacity-100" : "w-0 opacity-0"
          }  max-w-[20%] flex-col overflow-hidden bg-zinc-800 transition-all`}>
          {sidebarToggle ? <Sidebar /> : null}
        </div>
        <div className="flex h-full flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
