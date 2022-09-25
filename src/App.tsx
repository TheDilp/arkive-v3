import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "primeicons/primeicons.css"; //icons
import "primereact/resources/themes/arya-blue/theme.css"; //theme
import "/node_modules/primeflex/primeflex.css";

import { lazy, Suspense } from "react";
import NotFound from "./components/Auth/NotFound";

// import Profile from "./components/Profile/Profile";

import { Helmet } from "react-helmet";
import LandingPage from "./components/LandingPage/LandingPage";
import LoadingScreen from "./components/Util/LoadingScreen";

const AppWrapper = lazy(() => import("./AppWrapper"));
const Auth = lazy(() => import("./components/Auth/Auth"));
const Project = lazy(() => import("./components/Project/Project"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const Help = lazy(() => import("./components/Help/Help"));
const Profile = lazy(() => import("./components/Profile/Profile"));
const PublicProject = lazy(
  () => import("./components/PublicView/PublicProject")
);
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <main className="App flex flex-wrap justify-content-center surface-0 overflow-y-hidden">
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
              <Route path="/" element={<AppWrapper />}>
                <Route path="home" element={<Dashboard />} />
                <Route path="auth" element={<Auth />} />
                <Route path="profile" element={<Profile />} />
                <Route path="help" element={<Help />} />
                <Route
                  path="project/:project_id/*"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Project />
                    </Suspense>
                  }
                />

                <Route
                  path="view/:project_id/*"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <PublicProject />
                    </Suspense>
                  }
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
