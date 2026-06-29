import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar"; 
import HomePage from "./components/HomePage";
import BusManagement from "./components/BusManagement";
import RouteManagement from "./components/RouteManagement";
import Bookings from "./components/Bookings";
import Feedback from "./components/Feedback";
import AdminProfile from "./components/AdminProfile";
import Login from "./components/Login";
import "./components/AdminProfile.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      {isAuthenticated ? (
          <div className="app-root"> 
            <div className="app-main">
              <Navbar onLogout={handleLogout} />

              <main className="app-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/buses" element={<BusManagement />} />
                  <Route path="/routes" element={<RouteManagement />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/profile" element={<AdminProfile />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;