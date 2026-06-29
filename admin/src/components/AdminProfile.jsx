import React from "react";
import "./AdminProfile.css";

export default function AdminProfile() {
  const admin = {
    email: "admin@bustravel.com",
    // Display the admin password as requested
    password: "admin123",
  };

  return (
    <div className="profile-container">
      <div className="profile-page__header">
        <div>
          <p className="eyebrow">Admin Settings</p>
          <h1>Admin Profile</h1>
        </div>
      </div>

      <div className="profile-grid">
        <main className="profile-main">
          <section className="profile-panel" aria-labelledby="profile-info-title">
            <div className="panel-header">
              <div>
                <h2 id="profile-info-title">Profile information</h2>
              </div>
            </div>
            <div className="profile-form-grid">
              <div className="form-field">
                <label>Email address</label>
                <input type="email" value={admin.email} disabled readOnly />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input type="text" value={admin.password} disabled readOnly />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}