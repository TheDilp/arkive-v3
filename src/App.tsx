import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-blue/theme.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { lazy, Suspense, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout/Layout";
import LoadingScreen from "./components/Loading/LoadingScreen";
import AuthLayout from "./pages/Auth/AuthLayout";
import SettingsContentView from "./pages/ContentView/SettingsContentView";
import Dashboard from "./pages/Dashboard";

const Signin = lazy(() => import("./pages/Auth/Signin"));
const ContentView = lazy(() => import("./pages/ContentView/ContentView"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
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
  const { pathname } = useLocation();
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "the-arkive-v3.firebaseapp.com",
    projectId: "the-arkive-v3",
    messagingSenderId: "427542209724",
    appId: "1:427542209724:web:762016985ceab84cf49cb9",
  };
  // Initialize Firebase

  const navigate = useNavigate();
  initializeApp(firebaseConfig);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) user?.getIdToken();
      if (!user && !pathname.includes("view")) navigate("/auth/signin");
    });
  }, []);
  return (
    <main className="flex h-screen w-screen flex-col">
      <ToastContainer autoClose={1500} newestOnTop pauseOnHover theme="dark" />
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Suspense fallback={<LoadingScreen />}>
            <ReactQueryDevtools position="bottom-right" />
            <Routes>
              <Route element={<AuthLayout />} path="auth/*">
                <Route element={<Signup />} path="signup" />
                <Route element={<Signin />} path="signin" />
              </Route>

              <Route element={<Dashboard />} path="/" />
              <Route element={<Profile />} path="user/:user_id" />

              <Route element={<Layout />} path="/project/:project_id/*">
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
    </main>
  );
}

export default App;
