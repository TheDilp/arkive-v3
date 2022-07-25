import "primeicons/primeicons.css"; //icons
import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/arya-blue/theme.css"; //theme
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "/node_modules/primeflex/primeflex.css";

import { lazy, Suspense } from "react";
import NotFound from "./components/Auth/NotFound";

// import Profile from "./components/Profile/Profile";

import { Helmet } from "react-helmet";
import LandingPage from "./components/LandingPage/LandingPage";
import Profile from "./components/Profile/Profile";
import LoadingScreen from "./components/Util/LoadingScreen";

const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));
const Project = lazy(() => import("./components/Project/Project"));
const Home = lazy(() => import("./components/Home/Home"));
const Help = lazy(() => import("./components/Help/Help"));
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

              <Route path="home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
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
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </main>
  );
}

export default App;
