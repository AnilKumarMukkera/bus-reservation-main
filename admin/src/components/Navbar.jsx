import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Bus, MapPin, BookOpen, MessageSquare, User, LogOut } from "lucide-react";
import { Navbar as RBNavbar, Nav, Container, Button } from "react-bootstrap";
import "./Navbar.css";

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <RBNavbar expand="lg" className="admin-navbar" variant="dark" sticky="top">
      <Container fluid>
        <RBNavbar.Brand className="navbar-logo d-flex align-items-center" onClick={() => handleNav("/")}> 
          <Bus size={26} />
          <span>Bus Admin</span>
        </RBNavbar.Brand>

        <RBNavbar.Toggle aria-controls="admin-navbar-nav" />
        <RBNavbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto align-items-center">
            <Nav.Link as="button" onClick={() => handleNav("/")} className="nav-item">
              <Home size={18} /> Dashboard
            </Nav.Link>
            <Nav.Link as="button" onClick={() => handleNav("/buses")} className="nav-item">
              <Bus size={18} /> Buses
            </Nav.Link>
            <Nav.Link as="button" onClick={() => handleNav("/routes")} className="nav-item">
              <MapPin size={18} /> Routes
            </Nav.Link>
            <Nav.Link as="button" onClick={() => handleNav("/bookings")} className="nav-item">
              <BookOpen size={18} /> Bookings
            </Nav.Link>
            <Nav.Link as="button" onClick={() => handleNav("/feedback")} className="nav-item">
              <MessageSquare size={18} /> Feedback
            </Nav.Link>
           
          </Nav>

          <div className="navbar-admin d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
            <Nav.Link as="button" onClick={() => handleNav("/profile")} className="nav-item">
              <User size={18} /> Profile
            </Nav.Link>
            <Button variant="outline-light" className="logout-btn" onClick={() => onLogout()}>
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
}