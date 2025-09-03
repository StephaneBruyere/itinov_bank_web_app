import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import keycloak from "./keycloak";

import "./index.css";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";


keycloak
  .init({ onLoad: "check-sso", pkceMethod: "S256", silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html" })
  .then(() => {
    createRoot(document.getElementById("root") as HTMLElement).render(
      <StrictMode>
        <BrowserRouter>
        <App /></BrowserRouter>
      
      </StrictMode>
    );
  })
  .catch((err) => console.error("Keycloak init error", err));
