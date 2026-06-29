import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import "./BusManagement.css";
import SeatLayout from "./SeatLayout";

const API_BASE_URL = "http://localhost:3939/api/admin/buses";

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSeatEditor, setShowSeatEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    busName: "",
    busNumber: "",
    busType: "",
    coach: "",
  });
  const [busNumberError, setBusNumberError] = useState("");

  // Fetch all buses on component mount
  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL);
      const data = response.data;

      if (data.success) {
        setBuses(data.data);
      } else {
        setError(data.message || "Failed to fetch buses");
      }
    } catch (err) {
      console.error("Error fetching buses:", err);
      const msg = err.response?.data?.message || err.message || "Error connecting to server";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // normalize busNumber to uppercase and trim spaces
    if (name === 'busNumber') {
      const v = String(value).toUpperCase();
      setForm({ ...form, [name]: v });
      setBusNumberError('');
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      busName: "",
      busNumber: "",
      busType: "",
      coach: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.busName || !form.busNumber || !form.busType || !form.coach) {
      alert("Please fill all required fields");
      return;
    }

    // Validate bus number pattern: e.g. GJ 03 AY 1097
    const busNoPattern = /^[A-Z]{2}[ \-]?[0-9]{2}[ \-]?[A-Z]{1,2}[ \-]?[0-9]{4}$/;
    if (!busNoPattern.test((form.busNumber || '').trim())) {
      setBusNumberError('Invalid bus number format. Example: GJ 03 AY 1097');
      alert('Invalid bus number format. Expected like: GJ 03 AY 1097');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
      const method = editingId ? "PUT" : "POST";

      let res;
      if (method === "POST") {
        res = await axios.post(url, form);
      } else {
        res = await axios.put(url, form);
      }
      const data = res.data;

      if (data.success) {
        alert(editingId ? "Bus updated successfully" : "Bus added successfully");
        resetForm();
        fetchBuses(); // Refresh bus list
        setShowSeatEditor(false);
      } else {
        setError(data.message || "Failed to save bus");
        alert(data.message);
      }
    } catch (err) {
      console.error("Error saving bus:", err);
      const msg = err.response?.data?.message || "Error connecting to server";
      setError(msg);
      if (err.response?.status === 400 && err.response?.data?.message === "Bus with this number already exists") {
        alert("There is an already existing bus with the given number");
      } else {
        alert("Error saving bus. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setForm(bus);
    setEditingId(bus._id);
    // Prevent editing seat layout when editing an existing bus
    setShowSeatEditor(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.delete(`${API_BASE_URL}/${id}`);
      const data = res.data;

      if (data.success) {
        alert("Bus deleted successfully");
        fetchBuses(); // Refresh bus list
      } else {
        setError(data.message || "Failed to delete bus");
        alert(data.message);
      }
    } catch (err) {
      console.error("Error deleting bus:", err);
      setError("Error connecting to server");
      alert("Error deleting bus. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bus-container">
      <div className="bus-header">
        <div className="header-top">
          <div>
            <h2>Bus Management</h2>
            <p>Register, update, and manage all buses with seat configurations</p>
          </div>
          {!editingId && (
            <button
              className="seat-editor-toggle"
              onClick={() => setShowSeatEditor(!showSeatEditor)}
            >
              {showSeatEditor ? "Hide" : "Show"} Seat Layout
            </button>
          )}
        </div>
        {showSeatEditor && <SeatLayout selectedBusType={form.busType} />}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="bus-form">
        <h3>{editingId ? "Edit Bus" : "Register New Bus"}</h3>

        <div className="form-grid">

          <div className="form-flex">
          <label>Bus Name</label>
          <input
            name="busName"
            placeholder="Bus Name"
            value={form.busName}
            onChange={handleChange}
            className="form-input"
          />
          </div>
          
          <div className="form-flex">
          <label>Bus Number</label>
          <input
            name="busNumber"
            placeholder="Bus Number"
            value={form.busNumber}
            onChange={handleChange}
            className="form-input"
          />
          {busNumberError && <div className="input-error">{busNumberError}</div>}
          </div>



          <div className="form-flex">
          <label>Bus Type</label>
          <select
            name="busType"
            value={form.busType}
            onChange={handleChange}
            disabled={!!editingId}
            className="form-select"
          >
            <option value="">--select--</option>
            <option value="2+2 Seater">2+2 Seater</option>
            <option value="2+1 Sleeper">2+1 Sleeper</option>
            <option value="2+1 Mixed">2+1 Mixed</option> 
          </select>
          </div>

          <div className="form-flex">
          <label>Coach</label>
            <select
            name="coach"
            value={form.coach}
            onChange={handleChange}
            disabled={!!editingId}
            className="form-select"
          >
            <option value="">--select--</option>
            <option value="AC">AC</option>
            <option value="NON-AC">NON-AC</option> 
          </select>
          </div>


        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            <Plus size={18} />
            {loading ? "Saving..." : editingId ? "Update Bus" : "Add Bus"}
          </button>
          <button className="btn-secondary" onClick={resetForm} disabled={loading}>
            {editingId ? "Cancel" : "Clear"}
          </button>
        </div>
      </div>

      <div className="bus-table-wrapper">
        <h3>Registered Buses</h3>

        {loading && buses.length === 0 ? (
          <p className="loading-text">Loading buses...</p>
        ) : buses.length === 0 ? (
          <p className="empty-text">No buses registered yet.</p>
        ) : (
          <table className="bus-table">
            <thead>
              <tr>
                <th>Bus Name</th>
                <th>Bus Number</th>
                <th>Type</th>
                <th>Coach</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {buses.map((bus) => (
                <tr key={bus._id}>
                  <td className="bus-name">{bus.busName}</td>
                  <td>{bus.busNumber}</td>
                  <td>{bus.busType}</td>
                  <td>{bus.coach}</td>
                  <td className="actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(bus)}
                      title="Edit"
                      disabled={loading}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(bus._id)}
                      title="Delete"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
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
