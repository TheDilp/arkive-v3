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
    <main className="h-screen flex flex-col overflow-hidden">
      <ToastContainer autoClose={3000} newestOnTop pauseOnHover theme="dark" />
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:project_id/" element={<Layout />}>
              <Route path="wiki/*">
                <Route path="doc/:item_id" element={<Editor editable={true} />}></Route>
              </Route>
              <Route path="maps/*">
                <Route path=":id" element={<div>MAP</div>}></Route>
              </Route>
              <Route path="boards/*">
                <Route path=":id" element={<div>BOARD</div>}></Route>
              </Route>
              <Route path="timelines/*">
                <Route path=":id" element={<div>TIMELINE</div>}></Route>
              </Route>
              <Route path="settings" element={<div>SETTINGS</div>}></Route>
            </Route>
          </Routes>
        </DndProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;
