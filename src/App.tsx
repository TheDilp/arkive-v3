import { useEffect } from "react";
import "./App.css";
import { createFunction, getFunction } from "./utils/CRUD";
import { createURLS, getURLS } from "./types/enums";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();
function App() {
  useEffect(() => {
    getFunction(getURLS.getAllProjects);
    // createFunction(createURLS.createProject, { title: "TEK it up" });
  }, []);
  return (
    <main className="App">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </QueryClientProvider>
    </main>
  );
}

export default App;
