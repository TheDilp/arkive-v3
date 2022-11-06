import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";

import "primeicons/primeicons.css"; //icons
import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/arya-blue/theme.css"; //theme
import "primeflex/primeflex.css"; //theme

const queryClient = new QueryClient();
function App() {
  return (
    <main className="App h-screen">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </QueryClientProvider>
    </main>
  );
}

export default App;
