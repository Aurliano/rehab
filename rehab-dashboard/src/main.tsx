import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { PatientProvider } from "./contexts/PatientContext";
import './index.css';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <PatientProvider>
        <App />
      </PatientProvider>
    </HashRouter>
  </React.StrictMode>
);
