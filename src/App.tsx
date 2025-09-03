import React, { useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import keycloak from "./keycloak";

import Customers from "./components/Customers";
import Accounts from "./components/Accounts";
import AccountsChart from "./components/AccountsChart";

const App: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = keycloak.authenticated;

  // Rafraîchissement automatique du token Keycloak
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        keycloak.updateToken(30).catch(() => keycloak.logout());
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Détermine quelle route est active
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Bank App
          </Navbar.Brand>

          <Nav className="me-auto">
            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to="/accounts"
                active={isActive("/accounts")}
              >
                Accounts
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {!isAuthenticated ? (
              <Button variant="outline-light" onClick={() => keycloak.login()}>
                Login
              </Button>
            ) : (
              <>
                <Navbar.Text className="me-2">
                  Signed in as: {keycloak.tokenParsed?.preferred_username}
                </Navbar.Text>
                <Button
                  variant="outline-warning"
                  onClick={() => keycloak.logout()}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Container style={{ marginTop: "4em" }}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <AccountsChart /> : <Customers />} />
          {isAuthenticated && <Route path="/accounts" element={<Accounts />} />}
        </Routes>    
      </Container>
    </>
  );
};

export default App;
