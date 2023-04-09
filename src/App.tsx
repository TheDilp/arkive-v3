import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-blue/theme.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { ToastContainer } from "react-toastify";

import Content from "./pages/Main";

function App() {
  return (
    <main className="flex h-screen w-screen flex-col">
      <ToastContainer autoClose={1500} newestOnTop pauseOnHover theme="dark" />
      <Content />
    </main>
  );
}

export default App;
