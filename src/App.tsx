import "primereact/resources/themes/arya-blue/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "/node_modules/primeflex/primeflex.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import Project from "./components/Project/Project";
import Navbar from "./components/Nav/Navbar";
function App() {
  const queryClient = new QueryClient();
  return (
    <main className="App flex flex-wrap align-content-start justify-content-center h-screen surface-0 ">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/project/:project_id/wiki/*" element={<Project />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </main>
  );
}

export default App;
