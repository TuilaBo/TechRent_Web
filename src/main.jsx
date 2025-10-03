
import "antd/dist/reset.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>      {/* <- PHẢI có */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
