import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";

import "bootstrap";
import "./styles.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
