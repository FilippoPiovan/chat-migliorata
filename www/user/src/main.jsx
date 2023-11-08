import React from "react";
import ReactDOM from "react-dom/client";
import User from "./User.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <User />
    </NextUIProvider>
  </React.StrictMode>
);
