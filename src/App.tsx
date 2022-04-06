import RemirrorContext from "./components/Editor/RemirrorContext";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import { QueryClient, QueryClientProvider } from "react-query";
function App() {
  const queryClient = new QueryClient();
  return (
    <main className="App" style={{ display: "flex", justifyContent: "center" }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/editor" element={<RemirrorContext />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </main>
  );
}

export default App;
