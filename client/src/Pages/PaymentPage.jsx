import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from 'react-bootstrap/Toast';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PAYMENT_METHODS = [
  { id: 'wallet', label: '💰 Wallet', desc: 'Pay securely from your BusReserve wallet (5% OFF)' },
  { id: 'net_banking', label: '🏦 Net Banking', desc: 'All major Indian banks supported' },
  { id: 'credit_card', label: '💳 Credit Card', desc: 'Visa, Mastercard, RuPay supported' },
  { id: 'debit_card', label: '💳 Debit Card', desc: 'All major bank debit cards' }
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state?.booking || location.state || {
    busId: '123',
    busName: 'Nizamabad Express',
    busCategory: 'STANDARD',
    from: 'Hyderabad',
    to: 'Nizamabad',
    date: '2026-05-25',
    seats: [15, 16],
    totalAmount: 440,
    passengers: []
  };

  // State Management
  const [method, setMethod] = useState('wallet');
  const [withoutDriver, setWithoutDriver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [bank, setBank] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [subscriptionDiscount, setSubscriptionDiscount] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState('');

  // Guest booking removed — payment requires authenticated user

  // Pricing Logic
  const baseFare = bookingData.totalAmount || (Array.isArray(bookingData.legs) ? bookingData.legs.reduce((s,l) => s + (l.totalAmount||0), 0) : 0);
  const secDeposit = withoutDriver && bookingData.busCategory === 'Coach' ? 5000 : 0;
  const subtotal = baseFare + secDeposit;
  const subDiscountAmount = subscriptionDiscount > 0 ? subtotal * (subscriptionDiscount / 100) : 0;
  const afterSubDiscount = subtotal - subDiscountAmount;
  const walletDiscount = method === 'wallet' ? afterSubDiscount * 0.05 : 0;
  const finalTotal = Math.round((afterSubDiscount - walletDiscount) * 100) / 100;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch wallet balance
    fetch('http://localhost:3939/api/wallet', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.wallet) setWalletBalance(data.wallet.balance);
      })
      .catch((err) => console.error('Error fetching wallet balance:', err));

    // Fetch active subscription
    fetch('http://localhost:3939/api/subscriptions/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.subscription) {
          setSubscriptionDiscount(data.subscription.discountPercentage);
          setSubscriptionPlan(data.subscription.plan);
        }
      })
      .catch(() => {});
  }, []);

  const handlePay = async (e) => {
    if (e) e.preventDefault();

    // Authentication is required for checkout; server enforces this.

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Build payload: support multi-leg (`legs`) or single-leg payloads
      let payload;
      const validLegs = Array.isArray(bookingData.legs)
        ? bookingData.legs.filter(leg => leg.busId && Array.isArray(leg.seats) && leg.seats.length > 0)
        : [];

      if (validLegs.length > 0) {
        const legs = validLegs.map((leg) => ({
          busId: leg.busId,
          from: leg.from,
          to: leg.to,
          date: leg.date,
          seats: leg.seats || [],
          passengerDetails: Array.isArray(leg.passengerDetails) ? leg.passengerDetails : [],
          withoutDriver: !!leg.withoutDriver,
        }));
        payload = {
          legs,
          totalAmount: finalTotal,
          paymentMethod: method,
        };
      } else {
        // Single-leg payload (backwards compatible)
        const seats = bookingData.seats || [];
        const passengerList = Array.isArray(bookingData.passengers) ? bookingData.passengers : [];
        const passengerDetails = passengerList.map((p, i) => ({
          fullName: p.fullName || p.name || '',
          age: Number(p.age) || 0,
          gender: p.gender || '',
          seatNo: String(seats[i] || ''),
        }));

        payload = {
          busId: bookingData.busId,
          from: bookingData.from,
          to: bookingData.to,
          date: bookingData.date,
          seats,
          passengers: passengerDetails.length || seats.length,
          passengerDetails,
          totalAmount: finalTotal,
          paymentMethod: method,
          withoutDriver,
        };
      }

      let bookingResponse = null;
      try {
        const resp = await axios.post('http://localhost:3939/api/payment/checkout', payload, { headers });
        bookingResponse = resp.data;
      } catch (postErr) {
        const serverMsg = postErr.response?.data?.message || JSON.stringify(postErr.response?.data) || postErr.message;
        console.error('Checkout POST failed:', serverMsg);
        setError(`Payment/booking failed: ${serverMsg}`);
        setLoading(false);
        return;
      }

      // bookingResponse may contain a single `booking` or multiple `bookings`
      let ticketData = null;
      if (bookingResponse) {
        if (Array.isArray(bookingResponse.bookings)) ticketData = bookingResponse.bookings;
        else if (bookingResponse.booking) ticketData = bookingResponse.booking;
        else if (bookingResponse.data) ticketData = bookingResponse.data;
      }

      if (!ticketData) {
        throw new Error("Server succeeded but returned no ticket data.");
      }

      try {
        localStorage.setItem('booking_added', '1');
      } catch (e) {
        console.warn('Unable to set booking_added flag in localStorage', e);
      }

      setToastMessage('Booking confirmed! Generating your ticket...');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        if (Array.isArray(ticketData)) {
          navigate('/ticket', { state: { booking: ticketData[0], bookings: ticketData } });
        } else {
          navigate('/ticket', { state: { booking: ticketData } });
        }
      }, 1200);

    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        
        {/* LEFT COLUMN: Summary */}
        <div className="payment-summary">
          <h2 className="summary-title">🎫 Order Summary</h2>
          
          {Array.isArray(bookingData.legs) ? (
            bookingData.legs.map((leg, idx) => (
              <div key={idx} className="ticket-card">
                <div className="ticket-row">
                  <span className="ticket-label">🚌 Bus Operator</span>
                  <span className="ticket-value bus-name">
                    {leg.busName}
                    <span className="badge">{leg.busCategory}</span>
                  </span>
                </div>

                <div className="ticket-row ticket-row--route">
                  <span className="ticket-label">📍 Route</span>
                  <span className="ticket-value">
                    {leg.from}
                    <span className="route-arrow"> 🚌 </span>
                    {leg.to}
                  </span>
                </div>

                <div className="ticket-row">
                  <span className="ticket-label">📅 Travel Date</span>
                  <span className="ticket-value">
                    {leg.date
                      ? new Date(leg.date).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })
                      : leg.date}
                  </span>
                </div>

                <div className="ticket-row">
                  <span className="ticket-label">💺 Seat(s)</span>
                  <span className="ticket-value seats-chips">
                    {(leg.seats || []).map((s) => (
                      <span key={s} className="seat-chip">{s}</span>
                    ))}
                  </span>
                </div>

                <div className="ticket-row">
                  <span className="ticket-label">💰 Leg Fare</span>
                  <span className="ticket-value">₹{(leg.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="ticket-card">
              <div className="ticket-row">
                <span className="ticket-label">🚌 Bus Operator</span>
                <span className="ticket-value bus-name">
                  {bookingData.busName}
                  <span className="badge">{bookingData.busCategory}</span>
                </span>
              </div>

              <div className="ticket-row ticket-row--route">
                <span className="ticket-label">📍 Route</span>
                <span className="ticket-value">
                  {bookingData.from}
                  <span className="route-arrow"> 🚌 </span>
                  {bookingData.to}
                </span>
              </div>

              <div className="ticket-row">
                <span className="ticket-label">📅 Travel Date</span>
                <span className="ticket-value">
                  {bookingData.date
                    ? new Date(bookingData.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })
                    : bookingData.date}
                </span>
              </div>

              <div className="ticket-row">
                <span className="ticket-label">💺 Seat(s)</span>
                <span className="ticket-value seats-chips">
                  {(bookingData.seats || []).map((s) => (
                    <span key={s} className="seat-chip">{s}</span>
                  ))}
                </span>
              </div>
            </div>
          )}

          <div className="pricing-details">
            <div className="price-row">
              <span>Base Ticket Fare</span>
              <span>₹{baseFare.toFixed(2)}</span>
            </div>
            {subDiscountAmount > 0 && (
              <div className="price-row price-row--discount">
                <span>🎁 {subscriptionPlan} ({subscriptionDiscount}% off)</span>
                <span>− ₹{subDiscountAmount.toFixed(2)}</span>
              </div>
            )}
            {walletDiscount > 0 && (
              <div className="price-row price-row--wallet">
                <span>💰 Wallet Discount (5%)</span>
                <span>− ₹{walletDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="price-row grand-total">
              <span>Grand Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Methods */}
        <div className="payment-methods">
          <h2 className="summary-title">Select Payment Method</h2>
          
          {error && (
            <div className="insufficient-alert" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div className="accordion-list">
            {PAYMENT_METHODS.map((m) => {
              const isSelected = method === m.id;

              return (
                <div key={m.id} className={`accordion-card ${isSelected ? 'active' : ''}`}>
                  <label className="accordion-header">
                    <input
                      type="radio"
                      name="paymentMethodGroup"
                      value={m.id}
                      checked={isSelected}
                      onChange={() => {
                        setMethod(m.id);
                        setError('');
                      }}
                    />
                    <div className="method-info">
                      <span className="method-title">{m.label}</span>
                      <span className="method-sub">{m.desc}</span>
                    </div>
                  </label>

                  {isSelected && (
                    <div className="panel-content">
                      <form onSubmit={handlePay}>
                        
                        {/* Wallet Section */}
                        {m.id === 'wallet' && (
                          <div className="wallet-panel">
                            <div className="wallet-balance-box">
                              <span className="balance-title">Your Available Balance</span>
                              <span className="balance-value">₹{walletBalance.toFixed(2)}</span>
                            </div>
                            {walletBalance < finalTotal ? (
                              <div className="insufficient-alert" style={{ textAlign: 'center' }}>
                                {walletBalance === 0
                                  ? `⚠️ Your wallet balance is ₹0.`
                                  : `⚠️ Short by ₹${(finalTotal - walletBalance).toFixed(2)}`}
                                <button
                                  type="button"
                                  className="panel-pay-btn add-funds-btn"
                                  onClick={() =>
                                    navigate('/wallet', {
                                      state: {
                                        returnTo: '/payment',
                                        bookingState: location.state,
                                      },
                                    })
                                  }
                                >
                                  Add Amount
                                </button>
                              </div>
                            ) : (
                              <p className="wallet-success-note">✅ 5% Discount Applied</p>
                            )}
                          </div>
                        )}

                        {/* Credit / Debit Card Section */}
                        {(m.id === 'credit_card' || m.id === 'debit_card') && (
                          <div className="card-details-form">
                            <div className="form-group">
                              <label>Name on Card</label>
                              <input 
                                type="text" placeholder="John Doe" required value={card.name} 
                                onChange={(e) => setCard({...card, name: e.target.value})} 
                              />
                            </div>
                            <div className="form-group">
                              <label>Card Number</label>
                              <input 
                                type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" required value={card.number} 
                                onChange={(e) => setCard({...card, number: e.target.value})} 
                              />
                            </div>
                            <div className="form-row">
                              <div className="form-group split">
                                <label>Expiry Date</label>
                                <input 
                                  type="text" placeholder="MM/YY" maxLength="5" required value={card.expiry} 
                                  onChange={(e) => setCard({...card, expiry: e.target.value})} 
                                />
                              </div>
                              <div className="form-group split">
                                <label>CVV</label>
                                <input 
                                  type="password" placeholder="•••" maxLength="3" required value={card.cvv} 
                                  onChange={(e) => setCard({...card, cvv: e.target.value})} 
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Net Banking Section */}
                        {m.id === 'net_banking' && (
                          <div className="net-banking-form">
                            <div className="form-group">
                              <label>Select Bank</label>
                              <select required value={bank} onChange={(e) => setBank(e.target.value)}>
                                <option value="">-- Select your bank --</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="kotak">Kotak Mahindra Bank</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Pay Button */}
                        {!(m.id === 'wallet' && walletBalance < finalTotal) && (
                          <button type="submit" className="panel-pay-btn" disabled={loading}>
                            {loading ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)} Securely`}
                          </button>
                        )}

                        <p className="panel-secure-badge">🔒 Your payment is encrypted and secure.</p>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
      {/* Toast for feedback */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 2000 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">BusReserve</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
}
