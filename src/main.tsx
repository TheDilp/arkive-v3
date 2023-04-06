import "./index.css";

import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// @ts-ignore

cytoscape.use(edgehandles);
gridguide(cytoscape);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
