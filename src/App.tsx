import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/arya-blue/theme.css"; //theme
import "primeicons/primeicons.css"; //icons
import "/node_modules/primeflex/primeflex.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "react-query/devtools";
import Register from "./components/Auth/Register";
import Profile from "./components/Profile/Profile";
import Help from "./components/Help/Help";

import FileBrowser from "./components/FileBrowser/FileBrowser";
import PublicProject from "./components/PublicView/Public Boards/PublicProject";
import PublicWiki from "./components/PublicView/Wiki/PublicWiki";
import PublicMaps from "./components/PublicView/PublicMaps/PublicMaps";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/Util/LoadingScreen";
import PublicBoardsContainer from "./components/PublicView/Public Boards/PublicBoardsContainer";
import { auth } from "./utils/supabaseUtils";
const Project = lazy(() => import("./components/Project/Project"));
const Wiki = lazy(() => import("./components/Wiki/Wiki"));
const Maps = lazy(() => import("./components/Maps/Maps"));
const Boards = lazy(() => import("./components/Boards/Boards"));
const ProjectSettings = lazy(
  () => import("./components/Project/ProjectSettings")
);
const Home = lazy(() => import("./components/Home/Home"));
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  auth.onAuthStateChange((event, session) => {
    console.log(event, session);
  });

  return (
    <main className="App flex flex-wrap justify-content-center surface-0  overflow-y-hidden">
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="help" element={<Help />} />
            <Route
              path="project/:project_id"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <Project />
                </Suspense>
              }
            >
              <Route
                path="wiki/*"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Wiki />
                  </Suspense>
                }
              />
              <Route
                path="maps/*"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Maps />
                  </Suspense>
                }
              />
              <Route
                path="boards/*"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Boards />
                  </Suspense>
                }
              />
              <Route path="filebrowser" element={<FileBrowser />} />
              <Route path="settings/:setting" element={<ProjectSettings />} />
            </Route>
            <Route path="view/:project_id" element={<PublicProject />}>
              <Route path="wiki/:doc_id" element={<PublicWiki />} />
              <Route path="maps/:map_id" element={<PublicMaps />} />
              <Route
                path="boards/:board_id"
                element={<PublicBoardsContainer />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </main>
  );
}

export default App;
