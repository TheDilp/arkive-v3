import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/arya-blue/theme.css"; //theme
import "primeicons/primeicons.css"; //icons
import "/node_modules/primeflex/primeflex.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import Project from "./components/Project/Project";
import ProjectSettings from "./components/Project/ProjectSettings";
import Wiki from "./components/Project/Wiki/Wiki";
import { ReactQueryDevtools } from "react-query/devtools";
import Register from "./components/Auth/Register";
import Profile from "./components/Profile/Profile";
import InviteRoute from "./components/Auth/InviteRoute";
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <main className="App flex flex-wrap align-content-start justify-content-center h-screen surface-0 overflow-y-hidden">
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="invite/:project_id" element={<InviteRoute />} />
            <Route path="project/:project_id" element={<Project />}>
              <Route path="wiki/*" element={<Wiki />} />
              <Route path="settings/:setting" element={<ProjectSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </main>
  );
}

export default App;
