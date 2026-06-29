import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bus, MapPin, BookOpen, FileText, Settings, Users, DollarSign, PlusCircle } from "lucide-react";
import axios from "axios";
import "./HomePage.css";
 
export default function HomePage() {
  const [totalBuses, setTotalBuses] = useState(0);
  const [totalRoutes, setTotalRoutes] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch each stat independently so one failure doesn't zero out everything
      const safeGet = (url) => axios.get(url).catch(() => ({ data: { success: false } }));

      const [busesRes, routesRes, bookingsRes, feedbackRes] = await Promise.all([
        safeGet("http://localhost:3939/api/admin/buses"),
        safeGet("http://localhost:3939/api/admin/routes"),
        safeGet("http://localhost:3939/api/admin/bookings"),
        safeGet("http://localhost:3939/api/feedback?limit=1"),
      ]);
        
      if (busesRes.data.success && Array.isArray(busesRes.data.data)) {
        setTotalBuses(busesRes.data.data.length);
      }
      if (routesRes.data.success && Array.isArray(routesRes.data.data)) {
        setTotalRoutes(routesRes.data.data.length);
      }
      if (bookingsRes.data.success && Array.isArray(bookingsRes.data.bookings)) {
        setTotalBookings(bookingsRes.data.bookings.length);
        setRecentBookings(bookingsRes.data.bookings.slice(0, 5));
      }
      if (feedbackRes.data.success) {
        setTotalFeedback(feedbackRes.data.total ?? feedbackRes.data.count ?? 0);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
 
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overall system overview and recent activity</p>
      </header> 

      <section className="stats-grid">
        <StatsCard title="Total Buses"      value={totalBuses}    accent="#2563eb" />
        <StatsCard title="Total Routes"     value={totalRoutes}   accent="#7c3aed" />
        <StatsCard title="Total Bookings"   value={totalBookings} accent="#059669" />
        <StatsCard title="Feedback Received" value={totalFeedback} accent="#d97706" />
      </section>
 
      <section className="dashboard-grid">
        <div className="dashboard-column">
          <DashboardCard title="Recent Bookings">
            <RecentBookings bookings={recentBookings} />
          </DashboardCard>
          <DashboardCard title="System Status">
            <SystemStatus />
          </DashboardCard>
        </div> 
        <div className="dashboard-column">
          <DashboardCard title="Quick Admin Actions">
            <QuickActions />
          </DashboardCard>
          <DashboardCard title="Admin Information">
            <AdminInfo />
          </DashboardCard>
        </div>
      </section>
    </div>
  );
}
 
function DashboardCard({ title, children }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <div className="card-content">{children}</div>
    </div>
  );
}
 
function StatsCard({ title, value, accent }) {
  return (
    <div className="stats-card" style={{ borderLeftColor: accent }}>
      <span className="stats-title">{title}</span>
      <span className="stats-value">{value}</span>
    </div>
  );
}
 
function RecentBookings({ bookings = [] }) {
  if (bookings.length === 0) {
    return <p className="empty-msg">No recent bookings.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>User</th>
          <th>Bus</th>
          <th>Seats</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b, i) => {
          // Resolve user name: stored userName → first passengerDetail name → guest email → dash
          const userName =
            b.userName ||
            (b.passengerDetails && b.passengerDetails[0] && b.passengerDetails[0].fullName) ||
            b.guestEmail ||
            "—";

          // Resolve seat count: seatsCount field → seats array length → passengers → dash
          const seatCount =
            b.seatsCount != null && b.seatsCount > 0
              ? b.seatsCount
              : Array.isArray(b.seats) && b.seats.length > 0
              ? b.seats.length
              : b.passengers || "—";

          return (
            <tr key={i}>
              <td>{userName}</td>
              <td>{b.busName || "—"}</td>
              <td>{seatCount}</td>
              <td>
                <span className={`status-badge ${(b.status || "").toLowerCase()}`}>
                  {b.status || "—"}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
 
function SystemStatus() {
  return (
    <ul className="status-list">
      <li className="ok">Booking System — Active</li>
      <li className="ok">Payment Gateway — Connected</li>
      <li className="ok">Notification Service — Running</li>
    
    </ul>
  );
}
 
function QuickActions() {
  return ( 
    <ul className="quick-actions">
      <li><Link to="/buses"><PlusCircle size={15} />Add New Bus</Link></li>
      <li><Link to="/buses"><MapPin size={15} />Create New Route</Link></li>
      <li><Link to="/bookings"><FileText size={15} />View Booking Reports</Link></li>
      <li><Link to="/profile"><Settings size={15} />System Settings</Link></li>
      
    </ul>
  );
}
 
function AdminInfo() {
  return (
    <>
      <p><strong>Name:</strong> Admin Traveller</p>
      <p><strong>Role:</strong> Super Admin</p>
      
    </>
  );
}
