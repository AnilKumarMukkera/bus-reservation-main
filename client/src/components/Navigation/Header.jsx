import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaUser, FaWallet } from "react-icons/fa"; // Added FaWallet here
import Button from "react-bootstrap/Button";
 
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('token'))
  );
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };
 
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
    const checkLogin = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('token')));
    };
    window.addEventListener('storage', checkLogin);
    return () => {
      window.removeEventListener('storage', checkLogin);
    };
  }, [location]);
 
  return (
    <Navbar collapseOnSelect expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/">BusBooking</Navbar.Brand>
 
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/bookings">Bookings</Nav.Link>
            <Nav.Link href="/about">About Us</Nav.Link>
            <Nav.Link href="/subscribe">Subscriptions</Nav.Link>
          </Nav>
 
          {isLoggedIn ? (
            <>
              {/* Cleaned up Wallet link structure */}
              <Nav.Link href="/wallet" className="user-icon">
                <FaWallet size={18} /> Wallet
              </Nav.Link>
             
              <Nav.Link href="/profile" className="user-icon">
                <FaUser size={18} /> Account
              </Nav.Link>
 
              <Button
                variant="outline-light"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="auth-buttons">
              <Button className="login-btn" href="/login">
                Login
              </Button>
              <Button className="signup-btn" href="/signup">
                Sign Up
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
 
export default Header;
 