import RemirrorContext from "./components/Editor/RemirrorContext";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";

function App() {
  return (
    <main className="App" style={{ display: "flex", justifyContent: "center" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/editor" element={<RemirrorContext />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
