import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-blue/theme.css";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { AuthorizerProvider } from "@authorizerdev/authorizer-react";
import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DndProvider } from "react-dnd";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout/Layout";
import AuthLayout from "./pages/Auth/AuthLayout";
import Signin from "./pages/Auth/Signin";
import Signup from "./pages/Auth/Signup";
import BoardView from "./pages/BoardView/BoardView";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor/Editor";
import FolderView from "./pages/FolderView/FolderView";
import MapView from "./pages/MapView/MapView";
import PublicWrapper from "./pages/PublicView/PublicWrapper";
import AssetSettings from "./pages/Settings/Assets/AssetSettings";
import BoardSettings from "./pages/Settings/BoardSettings";
import DocumentSettings from "./pages/Settings/DocumentSettings";
import MapSettings from "./pages/Settings/MapSettings";
import ProjectSettings from "./pages/Settings/ProjectSettings";
import TagsSettings from "./pages/Settings/TagsSettings";

function App() {
  const navigate = useNavigate();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        networkMode: "always",
        retry: (failureCount) => {
          if (failureCount >= 1) return false;
          return true;
        },
      },
    },
  });

  return (
    <main className="flex h-screen flex-col">
      <ToastContainer autoClose={1500} newestOnTop pauseOnHover theme="dark" />
      <AuthorizerProvider
        config={{
          authorizerURL: "https://authorizer-production-ad3e.up.railway.app/",
          redirectURL: window.location.origin,
          clientID: import.meta.env.VITE_AUTH_ID, // obtain your client id from authorizer dashboard
        }}
        onStateChangeCallback={async (res) => {
          if (res.user) navigate("/");
        }}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <Routes>
              <Route element={<AuthLayout />} path="auth/*">
                <Route element={<Signup />} path="signup" />
                <Route element={<Signin />} path="signin" />
              </Route>
              <Route element={<Dashboard />} path="/" />
              <Route element={<Layout />} path="/project/:project_id/*">
                <Route path="documents/*">
                  <Route element={<FolderView />} path="" />
                  <Route element={<FolderView />} path="folder/:item_id" />
                  <Route element={<Editor editable />} path=":item_id" />
                </Route>
                <Route path="maps/*">
                  <Route element={<FolderView />} path="" />
                  <Route element={<FolderView />} path="folder/:item_id" />
                  <Route element={<MapView />} path=":item_id" />
                  <Route element={<MapView />} path=":item_id/:subitem_id" />
                </Route>
                <Route path="boards/*">
                  <Route element={<FolderView />} path="" />
                  <Route element={<FolderView />} path="folder/:item_id" />
                  <Route element={<BoardView />} path=":item_id" />
                  <Route element={<BoardView />} path=":item_id/:subitem_id" />
                </Route>
                <Route element={<FolderView />} path=":type/folder/:item_id" />

                <Route path="settings/*">
                  <Route element={<ProjectSettings />} path="project-settings" />
                  <Route element={<DocumentSettings />} path="document-settings" />
                  <Route element={<MapSettings />} path="map-settings" />
                  <Route element={<BoardSettings />} path="board-settings" />
                  <Route element={<TagsSettings />} path="tags-settings" />
                  <Route element={<AssetSettings />} path="assets-settings/*" />
                </Route>
              </Route>

              <Route element={<PublicWrapper />} path="view/*">
                <Route path="documents/:item_id" />
                <Route path="maps/:item_id" />
                <Route path="boards/:item_id" />
              </Route>
            </Routes>
          </DndProvider>
        </QueryClientProvider>
      </AuthorizerProvider>
    </main>
  );
}

export default App;
