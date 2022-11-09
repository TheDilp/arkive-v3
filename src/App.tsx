import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "primeicons/primeicons.css"; //icons
import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/arya-blue/theme.css"; //theme
import "./App.css";
import Navbar from "./components/Nav/Navbar";
import Layout from "./components/Layout/Layout";
import Wiki from "./pages/Wiki/Wiki";
import { DndProvider } from "react-dnd";
import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import Editor from "./components/Editor/Editor";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <main className="h-screen flex flex-col">
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:project_id/" element={<Layout />}>
              <Route path="wiki/*" element={<Wiki />}>
                <Route path="doc/:item_id" element={<Editor />}></Route>
              </Route>
            </Route>
          </Routes>
        </DndProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;
