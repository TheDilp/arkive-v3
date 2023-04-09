import { ClerkProvider, RedirectToSignIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import { DndProvider } from "react-dnd";
import { Route, Routes, useNavigate } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import LoadingScreen from "../components/Loading/LoadingScreen";
import useIsLocal from "../hooks/useIsLocal";
import Dashboard from "./Dashboard";

const ContentView = lazy(() => import("./ContentView/ContentView"));
const SettingsContentView = lazy(() => import("./ContentView/SettingsContentView"));
const FolderView = lazy(() => import("./FolderView/FolderView"));
const PublicWrapper = lazy(() => import("./PublicView/PublicWrapper"));

const Profile = lazy(() => import("./Profile/Profile"));
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

function ClerkWrapper({ children }: { children: JSX.Element | JSX.Element[] }) {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      navigate={(to) => navigate(to)}
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      {children}
    </ClerkProvider>
  );
}
function MainContent() {
  const isLocal = useIsLocal();

  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Suspense fallback={<LoadingScreen />}>
          <ReactQueryDevtools position="bottom-right" />
          <Routes>
            {isLocal ? null : (
              <>
                <Route element={<SignUp />} path="sign-up/*" />
                <Route element={<SignIn />} path="sign-in/*" />
              </>
            )}
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
  );
}
export default function Content() {
  const isLocal = useIsLocal();
  if (isLocal) return <MainContent />;

  return (
    <ClerkWrapper>
      <MainContent />
    </ClerkWrapper>
  );
}
