import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-blue/theme.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { ClerkProvider, RedirectToSignIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import { DndProvider } from "react-dnd";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout/Layout";
import LoadingScreen from "./components/Loading/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import ProjectView from "./pages/ProjectView/ProjectView";

const ContentView = lazy(() => import("./pages/ContentView/ContentView"));
const SettingsContentView = lazy(() => import("./pages/ContentView/SettingsContentView"));
const FolderView = lazy(() => import("./pages/FolderView/FolderView"));
const PublicWrapper = lazy(() => import("./pages/PublicView/PublicWrapper"));
const Profile = lazy(() => import("./pages/Profile/Profile"));

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

function App() {
  const navigate = useNavigate();
  return (
    <main className="flex h-screen w-screen flex-col">
      <ToastContainer autoClose={1500} newestOnTop pauseOnHover theme="dark" />

      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
        navigate={(to) => navigate(to)}
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <QueryClientProvider client={queryClient}>
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <Suspense fallback={<LoadingScreen />}>
              <ReactQueryDevtools position="bottom-right" />
              <Routes>
                <Route element={<SignUp />} path="sign-up/*" />
                <Route element={<SignIn />} path="sign-in/*" />
                <Route element={<Dashboard />} path="/" />
                <Route element={<Profile />} path="user/:user_id" />

                <Route element={<Layout />} path="/project/:project_id/*">
                  <Route element={<ProjectView />} path="" />
                  <Route path=":type/*">
                    <Route element={<FolderView />} path="" />
                    <Route element={<FolderView />} path="folder/:item_id" />
                    <Route element={<ContentView />} path=":item_id" />
                    <Route element={<ContentView />} path=":item_id/:subitem_id" />
                  </Route>

                  <Route element={<SettingsContentView />} path="settings/:type" />
                </Route>

                <Route element={<PublicWrapper />} path="view/:type/:item_id/*" />
              </Routes>
            </Suspense>
          </DndProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </main>
  );
}

export default App;
