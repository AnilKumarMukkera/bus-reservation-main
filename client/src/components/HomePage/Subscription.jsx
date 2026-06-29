import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Subscription.css';

const plans = [
  {
    id: 1,
    name: 'Standard',
    discountPercentage: 10,
    monthlyCost: 299,
    durationLabel: '1 month',
    features: [
      '10% discount on every ticket',
      'Valid for 1 month from activation',
      'Valid for 8 journeys per month',
      'Email booking confirmation',
      'Standard customer support',
      'Monthly discount summary',
      'Single user account',
    ],
    description: 'Ideal for occasional travelers',
  },
  {
    id: 2,
    name: 'Premium',
    discountPercentage: 20,
    monthlyCost: 599,
    durationLabel: '2 months',
    features: [
      '20% discount on every ticket',
      'Valid for 2 months from activation',
      'Valid for 10 journeys per month',
      '2 free cancellations per month',
      'Priority customer support',
      'SMS + Email notifications',
      'Free seat selection upgrade',
      'Monthly travel report & insights',
      'Exclusive offers & early booking discounts',
    ],
    description: 'Best for frequent travelers',
    popular: true,
  },
  {
    id: 3,
    name: 'Elite Plus',
    discountPercentage: 30,
    monthlyCost: 999,
    durationLabel: '3 months',
    features: [
      '30% discount on every ticket',
      'Valid for 3 months from activation',
      'Valid for 15 journeys per 3 months',
      'Unlimited free cancellations',
      '24/7 priority VIP support',
      'SMS + Email + Push notifications',
      'Complimentary premium seat selection',
      'Comprehensive travel analytics dashboard',
      'VIP lounge access (at partner terminals)',
      'Quarterly travel vouchers worth ₹500',
      'Referral rewards program',
      'Family group booking discounts (15% extra)',
    ],
    description: 'Premium experience for loyal customers',
  },
];

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeSub, setActiveSub] = useState(null);
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });

  // Fetch active subscription on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios
      .get('http://localhost:3939/api/subscriptions/my', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success && res.data.subscription) {
          setActiveSub(res.data.subscription);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribeClick = (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to subscribe.');
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
    setPaymentSuccess(false);
    setError('');
    setCard({ name: '', number: '', expiry: '', cvv: '' });
  };

  const closePaymentModal = () => {
    if (!isProcessing) {
      setShowPayment(false);
      setSelectedPlan(null);
      setError('');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3939/api/subscriptions',
        { plan: selectedPlan.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setPaymentSuccess(true);
        setActiveSub(res.data.subscription);
        // Update localStorage for quick frontend checks
        localStorage.setItem('subscriptionPlan', selectedPlan.name);
        localStorage.setItem('subscriptionDiscount', String(selectedPlan.discountPercentage));

        setTimeout(() => {
          setShowPayment(false);
          setSelectedPlan(null);
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>Subscriptions</h1>
        <p>Save money on every journey with our optimized subscription plans</p>
      </div>

      {/* Active subscription banner */}
      {activeSub && (
        <div className="active-sub-banner">
          <span>🎉 Active Plan: <strong>{activeSub.plan}</strong></span>
          <span>{activeSub.discountPercentage}% OFF on all tickets</span>
          <span>Expires: {formatDate(activeSub.expiryDate)}</span>
        </div>
      )}

      <div className="plans-section">
        <h2>Choose Your Subscription Plan</h2>
        <br />
        <div className="subscription-plans">
          {plans.map((plan) => {
            const isCurrentPlan = activeSub?.plan === plan.name;
            return (
              <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'current-plan' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                {isCurrentPlan && <div className="current-plan-badge">Your Current Plan</div>}

                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                  <div className="plan-price">
                    <span className="price">₹{plan.monthlyCost}</span>
                    <span className="period">/{plan.durationLabel}</span>
                  </div>
                  <div className="discount-badge">{plan.discountPercentage}% OFF per journey</div>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="checkmark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className="subscribe-btn"
                  onClick={() => handleSubscribeClick(plan)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Currently Active' : 'Subscribe Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="payment-modal-overlay" onClick={closePaymentModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>

            {paymentSuccess ? (
              <div className="payment-success-view">
                <div className="success-icon">✓</div>
                <h2>Subscribed!</h2>
                <p>Welcome to the <strong>{selectedPlan.name}</strong> plan.</p>
                <p>You now get <strong>{selectedPlan.discountPercentage}% OFF</strong> on every ticket.</p>
                <p className="redirect-text">Activating your benefits...</p>
              </div>
            ) : (
              <>
                <div className="payment-modal-header">
                  <h2>Complete Your Payment</h2>
                  <button className="close-btn" onClick={closePaymentModal} disabled={isProcessing}>
                    &times;
                  </button>
                </div>

                <div className="payment-summary">
                  <span>Plan: <strong>{selectedPlan.name}</strong></span>
                  <span>Total: <strong>₹{selectedPlan.monthlyCost}</strong></span>
                </div>

                <div className="sub-discount-info">
                  🎁 After subscribing, you get <strong>{selectedPlan.discountPercentage}% OFF</strong> automatically on all ticket bookings.
                </div>

                {error && <div className="sub-error-msg">⚠️ {error}</div>}

                <form onSubmit={handlePaymentSubmit} className="payment-form">
                  <div className="form-group">
                    <label>Name on Card</label>
                    <input
                      type="text" placeholder="John Doe" required
                      value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Card Number</label>
                    <div className="card-input-wrapper">
                      <input
                        type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" required
                        value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })}
                        disabled={isProcessing}
                      />
                      <span className="card-icon">💳</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label>Expiry Date</label>
                      <input
                        type="text" placeholder="MM/YY" maxLength="5" required
                        value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="form-group half">
                      <label>CVV</label>
                      <input
                        type="password" placeholder="•••" maxLength="4" required
                        value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`pay-now-btn ${isProcessing ? 'processing' : ''}`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${selectedPlan.monthlyCost} Securely`}
                  </button>
                </form>
                <div className="secure-checkout-text">🔒 Your payment is encrypted and secure.</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription;
