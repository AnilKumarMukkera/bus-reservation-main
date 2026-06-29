import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import "./RouteManagement.css";

const API_BASE_URL_ROUTES = "http://localhost:3939/api/admin/routes";
const API_BASE_URL_BUSES = "http://localhost:3939/api/admin/buses";

const busLocations = [
  'Hyderabad', 'Secunderabad', 'Nizamabad', 'Karimnagar', 'Warangal',
  'Khammam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Chennai',
  'Bangalore', 'Mysore', 'Coimbatore', 'Madurai', 'Pune', 'Mumbai',
  'Nagpur', 'Aurangabad', 'Delhi', 'Agra', 'Jaipur', 'Ahmedabad',
  'Surat', 'Rajkot', 'Indore', 'Bhopal', 'Kolkata', 'Patna', 'Ranchi',
  'Bhubaneswar', 'Cuttack', 'Lucknow', 'Kanpur', 'Varanasi', 'Goa',
];

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    busId: "",
    source: "",
    destination: "",
    duration: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    startDate: "",
    endDate: "",
  });

  // Fetch buses and routes on component mount
  useEffect(() => {
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get(API_BASE_URL_BUSES);
      if (response.data.success) {
        setBuses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching buses:", err);
      setError("Failed to fetch buses");
    }
  };

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL_ROUTES);
      if (response.data.success) {
        setRoutes(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching routes:", err);
      const msg = err.response?.data?.message || "Error connecting to server";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    if (["startDate", "duration", "departureTime"].includes(name)) {
      const { startDate, duration, departureTime } = newForm;
      if (startDate && duration && departureTime) {
        let h = 0, m = 0;
        const hMatch = duration.match(/(\d+)\s*h/i);
        const mMatch = duration.match(/(\d+)\s*m/i);
        
        if (hMatch) h = parseInt(hMatch[1], 10);
        if (mMatch) m = parseInt(mMatch[1], 10);
        
        if (!hMatch && !mMatch) {
          const val = parseFloat(duration);
          if (!isNaN(val)) {
            h = Math.floor(val);
            m = Math.round((val - h) * 60);
          }
        }

        if (h > 0 || m > 0) {
          const startDT = new Date(`${startDate}T${departureTime}`);
          if (!isNaN(startDT.getTime())) {
            startDT.setHours(startDT.getHours() + h);
            startDT.setMinutes(startDT.getMinutes() + m);
            
            const eY = startDT.getFullYear();
            const eM = String(startDT.getMonth() + 1).padStart(2, '0');
            const eD = String(startDT.getDate()).padStart(2, '0');
            const eH = String(startDT.getHours()).padStart(2, '0');
            const eMin = String(startDT.getMinutes()).padStart(2, '0');
            
            newForm.endDate = `${eY}-${eM}-${eD}`;
            newForm.arrivalTime = `${eH}:${eMin}`;
          }
        }
      }
    }

    setForm(newForm);
  };

  const resetForm = () => {
    setForm({
      busId: "",
      source: "",
      destination: "",
      duration: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (
      !form.busId ||
      !form.source ||
      !form.destination ||
      !form.duration ||
      !form.departureTime ||
      !form.arrivalTime ||
      !form.price ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = editingId ? `${API_BASE_URL_ROUTES}/${editingId}` : API_BASE_URL_ROUTES;
      const method = editingId ? "PUT" : "POST";

      let res;
      if (method === "POST") {
        res = await axios.post(url, form);
      } else {
        res = await axios.put(url, form);
      }

      const data = res.data;

      if (data.success) {
        alert(editingId ? "Route updated successfully" : "Route created successfully");
        resetForm();
        fetchRoutes();
      } else {
        setError(data.message || "Failed to save route");
        alert(data.message);
      }
    } catch (err) {
      console.error("Error saving route:", err);
      const msg = err.response?.data?.message || "Error connecting to server";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route) => {
    setForm({
      busId: route.busId._id,
      source: route.source,
      destination: route.destination,
      duration: route.duration,
      departureTime: route.departureTime || "",
      arrivalTime: route.arrivalTime || "",
      price: route.price,
      startDate: route.startDate.split("T")[0], // Convert to YYYY-MM-DD format
      endDate: route.endDate.split("T")[0],
      
    });
    setEditingId(route._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.delete(`${API_BASE_URL_ROUTES}/${id}`);
      const data = res.data;

      if (data.success) {
        alert("Route deleted successfully");
        fetchRoutes();
      } else {
        setError(data.message || "Failed to delete route");
        alert(data.message);
      }
    } catch (err) {
      console.error("Error deleting route:", err);
      const msg = err.response?.data?.message || "Error connecting to server";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Compute available buses
  const routeBusIds = routes.map(route => route.busId?._id || route.busId);

  const availableBuses = buses.filter(bus => {
    if (editingId) {
      const currentRoute = routes.find(r => r._id === editingId);
      if (currentRoute && (currentRoute.busId?._id === bus._id || currentRoute.busId === bus._id)) {
        return true;
      }
    }
    return !routeBusIds.includes(bus._id);
  });

  // Today's date in local YYYY-MM-DD format for input `min` attributes
  const today = new Date();
  const minSelectableDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="route-container">
      <div className="route-header">
        <div>
          <h2>Route Management</h2>
          <p>Create and manage bus routes with detailed information</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="route-form">
        <h3>{editingId ? "Edit Route" : "Create New Route"}</h3>

        {/* startDate/endDate inputs are constrained to not allow selecting past dates */}

        <div className="form-grid">
          {/* datalist shared by source/destination inputs */}
          <datalist id="bus-locations">
            {busLocations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
          <div className="form-flex wide">
            <label>Bus *</label>
            <select
              name="busId"
              value={form.busId}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">-- Select Bus --</option>
              {availableBuses.map((bus) => (
                <option key={bus._id} value={bus._id}>
                  {bus.busName} ({bus.busNumber}) - {bus.busType}
                </option>
              ))}
            </select>
          </div>

          <div className="form-flex">
            <label>Source *</label>
            <input
              name="source"
              placeholder="Source City"
              value={form.source}
              onChange={handleChange}
              list="bus-locations"
              className="form-input"
            />
          </div>

          <div className="form-flex">
            <label>Destination *</label>
            <input
              name="destination"
              placeholder="Destination City"
              value={form.destination}
              onChange={handleChange}
              list="bus-locations"
              className="form-input"
            />
          </div>

          <div className="form-flex">
            <label>Start Date *</label>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              min={minSelectableDate}
              className="form-input"
            />
          </div>

          <div className="form-flex">
            <label>Duration *</label>
            <input
              name="duration"
              placeholder="e.g., 5h 30m"
              value={form.duration}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-flex">
            <label>Departure Time *</label>
            <input
              name="departureTime"
              type="time"
              value={form.departureTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          

          <div className="form-flex">
            <label>Price (₹) *</label>
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          

          <div className="form-flex">
            <label>Arrival Time *</label>
            <input
              name="arrivalTime"
              type="time"
              value={form.arrivalTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          

          <div className="form-flex">
            <label>End Date *</label>
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              min={form.startDate || minSelectableDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            <Plus size={18} />
            {loading ? "Saving..." : editingId ? "Update Route" : "Create Route"}
          </button>
          {editingId && (
            <button className="btn-secondary" onClick={resetForm} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="route-table-wrapper">
        <h3>All Routes</h3>

        {loading && routes.length === 0 ? (
          <p className="loading-text">Loading routes...</p>
        ) : routes.length === 0 ? (
          <p className="empty-text">No routes created yet.</p>
        ) : (
          <table className="route-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Dep. Time</th>
                <th>Arr. Time</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Seats</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {routes.map((route) => (
                <tr key={route._id}>
                  <td className="bus-name">
                    {route.busId.busName}
                    <br />
                    <small>({route.busId.busNumber})</small>
                  </td>
                  <td>{route.source}</td>
                  <td>{route.destination}</td>
                  <td>{route.departureTime}</td>
                  <td>{route.arrivalTime}</td>
                  <td>{route.duration}</td>
                  <td>₹{route.price}</td>
                  <td>{route.availableSeats}</td>
                  <td>{new Date(route.startDate).toLocaleDateString()}</td>
                  <td>{new Date(route.endDate).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(route)}
                      title="Edit"
                      disabled={loading}
                    >
                      <Edit2  />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(route._id)}
                      title="Delete"
                      disabled={loading}
                    >
                      <Trash2  />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
