import "bootstrap/dist/css/bootstrap.min.css";

import { Container, Nav, Navbar } from "react-bootstrap";
import { IoTicket } from "react-icons/io5";
import { Link, Route, Routes } from "react-router-dom";

import AuthButtons from "@auth/components/AuthButtons";
import DarkModeToggle from "@components/DarkModeToggle";
import routes from "@routes";

export default function App() {
  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary rounded mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <IoTicket /> Ticket System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/tickets">
                Tickets
              </Nav.Link>
              <Nav.Link as={Link} to="/events">
                Events
              </Nav.Link>
              <Nav.Link as={Link} to="/venues">
                Venues
              </Nav.Link>
              <Nav.Link as={Link} to="/persons">
                Persons
              </Nav.Link>
              <Nav.Link as={Link} to="/locations">
                Locations
              </Nav.Link>
              <Nav.Link as={Link} to="/coordinates">
                Coordinates
              </Nav.Link>
            </Nav>
            <Nav className="d-flex align-items-center">
              <div className="me-3">
                <DarkModeToggle />
              </div>
              <AuthButtons />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Routes>
    </Container>
  );
}
