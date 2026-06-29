import React, { useState, useEffect } from "react";
import userImg from '../../assets/user.jpg';
import { Container, Card, Button, ListGroup, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";
function Account() {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    name: '', birthdate: '', gender: 'male', mobile: '', email: '',
  });
  const [saveMsg, setSaveMsg] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
 
  // Load profile from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch('http://localhost:3939/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const u = data.user;
          setDetails({
            name: u.name || '',
            birthdate: u.birthdate || '',
            gender: u.gender || 'male',
            mobile: u.phone || '',
            email: u.email || '',
          });
          // profileImage handling removed
        }
      })
      .catch(() => {});
  }, [navigate]);
 
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
 
  // Profile image upload feature removed per request
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
 
  return (
    <Container className="mt-3 account-container">
      <Card className="profile-card shadow-sm mb-4">
        <Card.Body className="profile-body">
          <div className="profile-header">
            <img src={userImg} alt="User Profile" className="profile-pic" />
            <div>
              <h2>{details.name}</h2>
              <p className="profile-subtitle">Registered Mobile: {details.mobile}</p>
              {/* profile image editing removed */}
            </div>
          </div>
 
          <Form className="profile-form">
            <Form.Group className="form-field">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={details.name}
                onChange={handleChange}
                placeholder="Full name"
              />
            </Form.Group>
 
            <div className="form-row">
              <Form.Group className="form-field">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={details.birthdate}
                  onChange={handleChange}
                />
              </Form.Group>
 
              <Form.Group className="form-field">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={details.gender}
                  onChange={handleChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </div>
 
            <Form.Group className="form-field">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={details.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
            </Form.Group>
 
            <Form.Group className="form-field">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={details.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </Form.Group>

            <hr style={{ margin: '1.25rem 0' }} />
            <h5 style={{ marginBottom: '0.75rem' }}>Change Password</h5>
            <Form.Group className="form-field">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </Form.Group>

            <Form.Group className="form-field">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                placeholder="Enter new password (min 8 chars)"
              />
            </Form.Group>

            <Form.Group className="form-field">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </Form.Group>

            {pwMsg && <p style={{ color: pwMsg.includes('successfully') ? 'green' : 'red', marginBottom: '0.5rem' }}>{pwMsg}</p>}
            <div style={{ marginBottom: '1rem' }}>
              <Button type="button" variant="outline-secondary" className="save-button" onClick={async () => {
                // client-side validation
                setPwMsg('');
                if (!pwForm.currentPassword) { setPwMsg('Current password is required.'); return; }
                if (!pwForm.newPassword || pwForm.newPassword.length < 8) { setPwMsg('New password must be at least 8 characters.'); return; }
                if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg('New passwords do not match.'); return; }

                setPwLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const res = await fetch('http://localhost:3939/api/users/change-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    setPwMsg('Password changed successfully');
                    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  } else {
                    setPwMsg(data.message || 'Failed to change password');
                  }
                } catch (err) {
                  setPwMsg('Error changing password. Please try again.');
                } finally {
                  setPwLoading(false);
                  setTimeout(() => setPwMsg(''), 4000);
                }
              }} disabled={pwLoading}>
                {pwLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </div>
 
            {saveMsg && <p style={{ color: saveMsg.includes('✅') ? 'green' : 'red', marginBottom: '0.5rem' }}>{saveMsg}</p>}
            <Button type="button" variant="primary" className="save-button" onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3939/api/users/profile', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({
                    name: details.name,
                    phone: details.mobile,
                    gender: details.gender.toLowerCase(),
                    birthdate: details.birthdate,
                  }),
                });
                const data = await res.json();
                if (data.success) {
                  const u = data.user;
                  // Refresh displayed details from server response
                  setDetails({
                    name: u.name || '',
                    birthdate: u.birthdate || '',
                    gender: u.gender || 'male',
                    mobile: u.phone || '',
                    email: u.email || '',
                  });
                  localStorage.setItem('user', JSON.stringify(u));
                  setSaveMsg('✅ Profile saved successfully!');
                } else {
                  setSaveMsg('❌ ' + (data.message || 'Failed to save.'));
                }
              } catch {
                setSaveMsg('❌ Failed to save. Please try again.');
              }
              setTimeout(() => setSaveMsg(''), 3000);
            }}>
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
 
 
      <Card className="shadow-sm menu-card">
        <Card.Body>
          <h3 className="menu-title">Quick Actions</h3>
          <ListGroup variant="flush" className="menu-list">
            <ListGroup.Item as={Link} to="/bookings" className="menu-item">
              My Bookings
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/wallet" className="menu-item">
               My Wallet
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/change-password" className="menu-item">
               Change Password
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/cancel-booking" className="menu-item">
              Cancel Booking
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/feedback" className="menu-item">
              Write Feedback
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/faqs" className="menu-item">
              FAQs
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/terms" className="menu-item">
              Terms & Conditions
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/privacy" className="menu-item">
              Privacy Policy
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/about" className="menu-item">
              About Us
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/subscribe" className="menu-item">
              Subscriptions
            </ListGroup.Item>
            <ListGroup.Item action className="menu-item logout-action" onClick={handleLogout}>
              Logout
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}
 
export default Account;
 
 