import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);