import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import "./Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "admin@bustravel.com",
    password: "admin123",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Min 8 characters required";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific and submit-level errors when user edits inputs
    setErrors(prev => ({ ...prev, [name]: "", submit: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    // Restrict login to the fixed admin credentials
    const allowedEmail = "admin@bustravel.com";
    const allowedPassword = "admin123";

    if (formData.email !== allowedEmail || formData.password !== allowedPassword) {
      setErrors({ submit: 'Invalid admin credentials' });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      localStorage.setItem("adminToken", "mock_token_" + Date.now());
      localStorage.setItem("adminUser", JSON.stringify({
        email: formData.email,
        role: "Super Admin",
      }));
      if (typeof onLogin === "function") onLogin();
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Login Card */}
        <div className="login-card">
          <div className="header">
            <h1>Bus Admin</h1>
            <p>Enterprise Administration System</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="field">
              <label htmlFor="email">Admin Email</label>
              <div className={`input-group ${errors.email ? "error" : ""}`}>
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@bustravel.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <div id="email-error" className="error">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className={`input-group ${errors.password ? "error" : ""}`}>
                <Lock size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div id="password-error" className="error">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {errors.submit && (
              <div className="error submit-error" role="alert" style={{ marginBottom: 12 }}>
                <AlertCircle size={14} />
                <span style={{ marginLeft: 8 }}>{errors.submit}</span>
              </div>
            )}
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="footer">🔒 Secure admin area - Password protected</p>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          <h2>Administrator Portal</h2>
          <p>Welcome to the Bus Reservation System Administration Dashboard. This area is restricted to authorized administrators only.</p>
          <ul>
            <li>Manage bus fleet and schedules</li>
            <li>Monitor booking operations</li>
            <li>Handle customer feedback</li>
            <li>View system analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
