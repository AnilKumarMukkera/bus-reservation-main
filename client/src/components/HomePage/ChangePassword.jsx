import React, { useState } from 'react';
import './ChangePassword.css';
 
export default function ChangePassword() {
  const [form, setForm]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors]   = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
 
  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required.';
    if (!form.newPassword)      e.newPassword = 'New password is required.';
    else if (form.newPassword.length < 8) e.newPassword = 'Minimum 8 characters.';
    else if (!/[A-Z]/.test(form.newPassword)) e.newPassword = 'Must contain at least 1 uppercase letter.';
    else if (!/[0-9]/.test(form.newPassword)) e.newPassword = 'Must contain at least 1 number.';
    else if (!/[!@#$%^&*]/.test(form.newPassword)) e.newPassword = 'Must contain a special character (!@#$%^&*).';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm new password.';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };
 
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setMessage('');
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
 
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:3939/api/users/change-password', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword, confirmPassword: form.confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('✅ Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally { setLoading(false); }
  };
 
  return (
    <div className="chpwd-page">
      <div className="chpwd-card">
        <h2>🔒 Change Password</h2>
        <p className="chpwd-sub">Password must be 8+ chars with uppercase, number & special character.</p>
 
        {message && <div className="chpwd-success">{message}</div>}
        {errors.submit && <div className="chpwd-error">{errors.submit}</div>}
 
        <form onSubmit={handleSubmit} className="chpwd-form">
          {[
            { name: 'currentPassword', label: 'Current Password' },
            { name: 'newPassword',     label: 'New Password' },
            { name: 'confirmPassword', label: 'Confirm New Password' },
          ].map(({ name, label }) => (
            <div className="chpwd-field" key={name}>
              <label>{label}</label>
              <input
                type="password" name={name}
                value={form[name]} onChange={handleChange}
                placeholder={label} disabled={loading}
              />
              {errors[name] && <span className="chpwd-err-text">{errors[name]}</span>}
            </div>
          ))}
 
          <button type="submit" className="chpwd-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
 
 