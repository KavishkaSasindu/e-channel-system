import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-app-polyfill/stable";
import { AuthProvider } from "./pages/common/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";

window.global = window;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </StrictMode>
);
