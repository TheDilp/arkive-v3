import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";

import "primeicons/primeicons.css"; //icons
import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/arya-blue/theme.css"; //theme
import "primeflex/primeflex.css"; //theme
import { useState } from "react";
import { trpc } from "./utils/trpcClient";
import { httpBatchLink } from "@trpc/client";
import Navbar from "./components/Nav/Navbar";
import Layout from "./components/Layout/Layout";
import Wiki from "./pages/Wiki/Wiki";

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:8080/trpc",
          // optional
          headers() {
            return {};
          },
        }),
      ],
    })
  );
  return (
    <main className="App h-screen">
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:project_id/" element={<Layout />}>
              <Route path="wiki" element={<Wiki />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </trpc.Provider>
    </main>
  );
}

export default App;
