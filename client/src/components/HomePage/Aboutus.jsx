import React from 'react';
import './Aboutus.css';

function Aboutus() {
    return (
        <section className="aboutus-container" aria-labelledby="aboutus-heading">
            <div className="aboutus-header">
                <h1 id="aboutus-heading">About <span>Us</span></h1>
                <p className="aboutus-subtitle">Your Trusted Partner in Bus Travel</p>
            </div>
            <div className="aboutus-content">
                <article className="aboutus-mission">
                    <h2>Our Mission</h2>
                    <p>
                        At BusReserve, we are committed to revolutionizing the way you travel by bus.
                        Our platform connects passengers with reliable bus services across the country,
                        ensuring safe, comfortable, and affordable journeys.
                    </p>
                </article>
                <article className="aboutus-story">
                    <h2>Our Story</h2>
                    <p>
                        BusReserve emerged from a vision to simplify bus reservations
                        in an increasingly digital world. We started as a small team passionate about
                        improving travel experiences and have grown into a leading platform serving
                        thousands of travelers daily.
                    </p>
                </article>
                <div className="aboutus-features">
                    <h2>Why Choose Us?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🚌</div>
                            <h3>Wide Network</h3>
                            <p>Access to hundreds of bus operators nationwide</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure Booking</h3>
                            <p>Safe and secure payment processing</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⭐</div>
                            <h3>Quality Service</h3>
                            <p>Verified operators and real-time updates</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Easy to Use</h3>
                            <p>Intuitive interface for seamless booking</p>
                        </div>
                    </div>
                </div>
                <article className="aboutus-contact">
                    <h2>Get in Touch</h2>
                    <p>
                        Have questions or need assistance? Our support team is here to help.
                        Reach out to us anytime.
                    </p>
                    <button className="contact-btn" aria-label="Contact us">Contact Us</button>
                </article>
            </div>
        </section>
    );
}

export default Aboutus;