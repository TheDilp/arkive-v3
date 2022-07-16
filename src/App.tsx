import "primeicons/primeicons.css"; //icons
import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/arya-blue/theme.css"; //theme
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./components/Auth/Login";
import Help from "./components/Help/Help";
import Profile from "./components/Profile/Profile";
import "/node_modules/primeflex/primeflex.css";

import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
import { lazy, Suspense, useEffect } from "react";
import FileBrowser from "./components/FileBrowser/FileBrowser";
import PublicBoardsContainer from "./components/PublicView/Public Boards/PublicBoardsContainer";
import PublicProject from "./components/PublicView/Public Boards/PublicProject";
import PublicMaps from "./components/PublicView/PublicMaps/PublicMaps";
import PublicWiki from "./components/PublicView/Wiki/PublicWiki";
import LoadingScreen from "./components/Util/LoadingScreen";
import NotFound from "./components/Auth/NotFound";
import Timelines from "./components/Timelines/TImelines";
import LandingPage from "./components/Auth/LandingPage";
import Register from "./components/Auth/Register";
import Project from "./components/Project/Project";
import { Helmet } from "react-helmet";
const Wiki = lazy(() => import("./components/Wiki/Wiki"));
const Maps = lazy(() => import("./components/Maps/Maps"));
const Boards = lazy(() => import("./components/Boards/Boards"));
const ProjectSettings = lazy(
  () => import("./components/Project/ProjectSettings/ProjectSettingsIndex")
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

  useEffect(() => {
    cytoscape.use(edgehandles);
    cytoscape.use(gridguide);
  }, []);
  return (
    <main className="App flex flex-wrap justify-content-center surface-0  overflow-y-hidden">
      <Helmet>
        <title>The Arkive</title>
        <meta
          name="description"
          content="Discover your world with custom wikis, maps, graphs and more."
        />
      </Helmet>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              {/* <Route path="profile" element={<Profile />} /> */}
              <Route path="help" element={<Help />} />
              <Route path="project/:project_id" element={<Project />}>
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
                <Route
                  path="timelines/*"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Timelines />
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
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </main>
  );
}

export default App;
