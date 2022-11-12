import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-blue/theme.css";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { DndProvider } from "react-dnd";
import Editor from "./components/Editor/Editor";
import Layout from "./components/Layout/Layout";
import Wiki from "./pages/Wiki/Wiki";
import { ToastContainer } from "react-toastify";

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
      <ToastContainer autoClose={3000} newestOnTop pauseOnHover theme="dark" />
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
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
