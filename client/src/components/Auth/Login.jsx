import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
 
export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
   
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
 
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };
 
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
     
    if (errors[name] || errors.submit) {
      setErrors(prev => ({ ...prev, [name]: "", submit: "" }));
    }
  };
 
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
     
    if (name === "email") {
      const error = validateEmail(form.email);
      if (error) setErrors(prev => ({ ...prev, email: error }));
    } else if (name === "password") {
      const error = validatePassword(form.password);
      if (error) setErrors(prev => ({ ...prev, password: error }));
    }
  };
 
  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
   
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;
   
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;
   
    return newErrors;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
     
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouched({ email: true, password: true });
      return;
    }
 
    setLoading(true);
    setSuccess(false);
 
    try {
      const response = await axios.post("http://localhost:3939/api/auth/login", {
        email: form.email,
        password: form.password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
   
        window.dispatchEvent(new Event('storage'));  
        setSuccess(true);
        setForm({ email: "", password: "" });
        setRememberMe(false);
         
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        submit: err.response?.data?.message || "Invalid email or password" 
      }));
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="auth-container login-container">
      <div className="auth-wrapper">

        {/* ── Left: Branding ── */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">BR</div>
            <h1>Bus Reservation</h1>
            <p className="brand-tagline">Your Journey, Our Priority</p>

            <div className="brand-divider"></div>

            <div className="branding-features">
              <div className="feature-row">
                <div className="feature-label">Easy Booking</div>
                <div className="feature-desc">Reserve your seat in seconds</div>
              </div>
              <div className="feature-row">
                <div className="feature-label">Secure Payments</div>
                <div className="feature-desc">Encrypted &amp; safe transactions</div>
              </div>
              <div className="feature-row">
                <div className="feature-label">24/7 Support</div>
                <div className="feature-desc">Always here when you need us</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="auth-form-wrapper">
          <div className="form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue booking</p>
            </div>

            {success && (
              <div className="message success-message">
                <CheckCircle size={20} />
                <span>Login successful! Redirecting...</span>
              </div>
            )}

            {errors.submit && (
              <div className="message error-message">
                <AlertCircle size={20} />
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className={`input-wrapper ${errors.email && touched.email ? 'error' : ''} ${touched.email && !errors.email ? 'valid' : ''}`}>
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    className="form-input"
                    aria-label="Email address"
                    aria-describedby={errors.email ? "email-error" : ""}
                    disabled={loading}
                  />
                </div>
                {errors.email && touched.email && (
                  <span id="email-error" className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <div className="label-wrapper">
                  <label htmlFor="password" className="form-label">Password</label>
                </div>
                <div className={`input-wrapper password-wrapper ${errors.password && touched.password ? 'error' : ''} ${touched.password && !errors.password ? 'valid' : ''}`}>
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className="form-input"
                    aria-label="Password"
                    aria-describedby={errors.password ? "password-error" : ""}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <span id="password-error" className="error-text">{errors.password}</span>
                )}
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              <div className="remember-me">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                  disabled={loading}
                />
                <label htmlFor="remember" className="checkbox-label">
                  Remember me for 30 days
                </label>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <><span className="spinner"></span>Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="form-divider">
              <span>Don't have an account?</span>
            </div>
            <a href="/signup" className="auth-link">Create new account</a>

            <div className="auth-footer">
              <a href="/terms">Terms of Service</a>
              <span className="separator">•</span>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}