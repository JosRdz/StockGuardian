import { createRoot } from "react-dom/client";

import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";

import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <>
    <App />

    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "16px",
          padding: "14px",
        },

        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#000",
          },
        },
      }}
    />
  </>
);