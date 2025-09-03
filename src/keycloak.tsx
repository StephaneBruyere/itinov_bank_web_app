import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8081",       // serveur Keycloak
  realm: "bank-realm",                // realm
  clientId: "bank-app",               // lient React
});

export default keycloak;
