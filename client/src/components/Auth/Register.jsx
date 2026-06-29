import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
 
const validators = {
  name: (value) => (!value ? "Name is required" : value.length < 2 ? "Name too short" : ""),
  email: (value) => (!value ? "Email is required" : !/\S+@\S+\.\S+/.test(value) ? "Invalid email" : ""),
  phone: (value) => (!value ? "Phone is required" : value.length !== 10 ? "Must be 10 digits" : ""),
  password: (value) => (!value ? "Password is required" : value.length < 8 ? "Must be at least 8 chars" : ""),
  confirmPassword: (value, form) => (!value ? "Confirm your password" : value !== form.password ? "Passwords do not match" : ""),
};
 
const fields = [
  { id: "name", label: "Full Name", type: "text", icon: <User size={18} />, placeholder: "John Doe" },
  { id: "email", label: "Email Address", type: "email", icon: <Mail size={18} />, placeholder: "you@example.com" },
  { id: "phone", label: "Phone Number", type: "tel", icon: <Phone size={18} />, placeholder: "9876543210" },
  { id: "password", label: "Password", type: "password", icon: <Lock size={18} />, placeholder: "Create a strong password" },
  { id: "confirmPassword", label: "Confirm Password", type: "password", icon: <Lock size={18} />, placeholder: "Re-enter your password" },
];
 
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  const validateField = (name, value) =>
    name === "confirmPassword" ? validators[name](value, form) : validators[name](value);
 
  const handleChange = (event) => {
    const { name, value } = event.target;
    const sanitized = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [name]: sanitized }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };
 
  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, form[name]);
    if (error) setErrors((prev) => ({ ...prev, [name]: error }));
  };
 
  const validateForm = () => {
    const result = {};
    fields.forEach(({ id }) => {
      const error = validateField(id, form[id]);
      if (error) result[id] = error;
    });
    return result;
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setServerError("");
    const formErrors = validateForm();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      setTouched(fields.reduce((acc, { id }) => ({ ...acc, [id]: true }), {}));
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3939/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone
      });
      
      if (response.data.success) {
        // Save token and user info so the new user is logged in immediately
        try {
          const userData = response.data.data;
          if (userData && userData.token) {
            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            window.dispatchEvent(new Event('storage'));
          }
        } catch (e) {
          console.warn('Could not persist login after register', e);
        }

        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  const fieldClass = (name) =>
    errors[name] && touched[name] ? "error" : touched[name] ? "valid" : "";
 
  return (
    <div className="auth-container register-container">
      <div className="auth-wrapper">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">BR</div>
            <h1>BusReserve</h1>
            <p className="brand-tagline">Book Your Journey Today</p>

            <div className="brand-divider"></div>

            <div className="branding-features">
              <div className="feature-row">
                <div className="feature-label">Quick Registration</div>
                <div className="feature-desc">Get started in under a minute</div>
              </div>
              <div className="feature-row">
                <div className="feature-label">Best Fare Guarantee</div>
                <div className="feature-desc">Lowest prices, always</div>
              </div>
              <div className="feature-row">
                <div className="feature-label">Instant Confirmation</div>
                <div className="feature-desc">Booking confirmed immediately</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-wrapper">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Join us to manage bookings and get instant confirmation.</p>
            </div>
            {success && (
              <div className="message success-message">
                <CheckCircle size={20} />
                <span>Registration successful! Redirecting to login...</span>
              </div>
            )}
            {serverError && (
              <div className="message error-message">
                <AlertCircle size={20} />
                <span>{serverError}</span>
              </div>
            )}
            {errors.terms && (
              <div className="message error-message">
                <AlertCircle size={20} />
                <span>{errors.terms}</span>
              </div>
            )}            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {fields.map(({ id, label, type, icon, placeholder }) => (
                <div key={id} className="form-group">
                  <label htmlFor={id} className="form-label">
                    {label}
                  </label>
                  <div className={`input-wrapper ${fieldClass(id)} ${id.includes("password") ? "password-wrapper" : ""}`}>
                    {icon}
                    <input
                      id={id}
                      name={id}
                      type={
                        id === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : id === "confirmPassword"
                          ? showConfirmPassword
                            ? "text"
                            : "password"
                          : type
                      }
                      value={form[id]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={placeholder}
                      className="form-input"
                      aria-describedby={errors[id] ? `${id}-error` : undefined}
                      disabled={loading}
                    />
                    {id === "password" && (
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                    {id === "confirmPassword" && (
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                  {errors[id] && touched[id] && (
                    <span id={`${id}-error`} className="error-text">
                      {errors[id]}
                    </span>
                  )}
                </div>
              ))}
              <p className="terms-notice">
                By creating an account you agree to our{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>.
              </p>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
            <div className="form-divider">
              <span>Already have an account?</span>
            </div>
            <a href="/login" className="auth-link">
              Sign in here
            </a>
          </div>
        </div>{/* end auth-form-wrapper */}
      </div>{/* end auth-wrapper */}
    </div>
  );
}