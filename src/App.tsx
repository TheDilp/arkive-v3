import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-blue/theme.css";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DndProvider } from "react-dnd";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor/Editor";
import FolderView from "./pages/FolderView/FolderView";
import MapView from "./pages/MapView/MapView";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <ToastContainer autoClose={3000} newestOnTop pauseOnHover theme="dark" />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Routes>
            <Route element={<Dashboard />} path="/" />
            <Route element={<Layout />} path="/project/:project_id/">
              <Route path="wiki/*">
                <Route element={<Editor editable />} path="doc/:item_id" />
                <Route element={<FolderView />} path="folder" />
                <Route element={<FolderView />} path="folder/:item_id" />
              </Route>
              <Route path="maps/*">
                <Route element={<MapView />} path=":item_id" />
              </Route>
              <Route path="boards/*">
                <Route element={<div>BOARD</div>} path=":item_id" />
              </Route>
              <Route path="timelines/*">
                <Route element={<div>TIMELINE</div>} path=":item_id" />
              </Route>
              <Route element={<div>SETTINGS</div>} path="settings" />
            </Route>
          </Routes>
        </DndProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;
