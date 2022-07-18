import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DndProvider } from "react-dnd";
import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <DndProvider backend={MultiBackend} options={getBackendOptions()}>
    <App />
  </DndProvider>
);
