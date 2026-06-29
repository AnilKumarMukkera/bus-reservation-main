import React, { useState } from 'react';
import './PrivacyandPolicy.css';

function PrivacyandPolicy() {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionId) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    return (
        <div className="privacy-page">
            <div className="privacy-header">
                <div className="header-content">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last Updated: April 2026</p>
                </div>
            </div>

            <div className="privacy-container">
                <div className="privacy-intro">
                    <p className="intro-text">
                        By visiting our platforms, you are accepting and consenting to the practices described in this Privacy Policy. We are committed to protecting your personal information and ensuring transparency about how we collect, use, and share your data.
                    </p>
                </div>

                {/* Section A */}
                <section className="privacy-section">
                    <div
                        className="section-header"
                        onClick={() => toggleSection('sectionA')}
                    >
                        <h2>A. Information You Provide and We Collect</h2>
                        <span className="toggle-icon">
                            {expandedSections['sectionA'] ? '−' : '+'}
                        </span>
                    </div>
                    {expandedSections['sectionA'] && (
                        <div className="section-content">
                            <div className="subsection">
                                <h3>1. General Information</h3>
                                <p>
                                    We provide a technology platform for online bus ticketing that connects travelers with bus partners and service providers. We operate as a marketplace and do not own or operate transportation services.
                                </p>
                            </div>

                            <div className="subsection">
                                <h3>2. Information Collection and Usage</h3>
                                <p>
                                    We collect personally identifiable information including email address, name, phone number, gender, travel preferences, and accommodation details. This information helps us provide you with personalized services and improve your booking experience.
                                </p>
                                <ul className="info-list">
                                    <li>Account registration details</li>
                                    <li>Payment and billing information</li>
                                    <li>Travel history and preferences</li>
                                    <li>Contact information</li>
                                    <li>Device and usage data</li>
                                </ul>
                            </div>

                            <div className="subsection">
                                <h3>3. Sensitive Personal Information</h3>
                                <p>
                                    We collect and process sensitive information such as payment details, banking information, and health-related preferences with your express consent as required by applicable laws.
                                </p>
                            </div>

                            <div className="subsection">
                                <h3>4. Information Sharing</h3>
                                <p>
                                    Your information is shared with service providers (bus operators, hotels, payment processors) solely for fulfilling your bookings and providing services. We do not share your information for unauthorized purposes.
                                </p>
                                <p className="highlight-text">
                                    By making a booking with us, you authorize us to share your information with relevant service providers.
                                </p>
                            </div>

                            <div className="subsection">
                                <h3>5. Automatic Information Collection</h3>
                                <p>
                                    We automatically collect information about your interactions with our platform, including browsing history, click streams, device information, and location data to improve your experience.
                                </p>
                            </div>

                            <div className="subsection">
                                <h3>6. Account Deletion</h3>
                                <p>
                                    You can request to delete your account by writing to us at support@abhibus.com. We may require identity verification before processing your deletion request. Identity proofs are retained for 21 days following deletion.
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Section B */}
                <section className="privacy-section">
                    <div
                        className="section-header"
                        onClick={() => toggleSection('sectionB')}
                    >
                        <h2>B. Mobile App Permissions</h2>
                        <span className="toggle-icon">
                            {expandedSections['sectionB'] ? '−' : '+'}
                        </span>
                    </div>
                    {expandedSections['sectionB'] && (
                        <div className="section-content">
                            <h3>Android Permissions</h3>
                            <div className="permissions-grid">
                                <div className="permission-item">
                                    <h4>Device & App History</h4>
                                    <p>Access to device information including OS version, hardware model, and language preferences to optimize your experience.</p>
                                </div>
                                <div className="permission-item">
                                    <h4>Location</h4>
                                    <p>Enables location-specific deals, auto-detection of your nearest city, and bus tracking features.</p>
                                </div>
                                <div className="permission-item">
                                    <h4>Identity</h4>
                                    <p>Auto-fill email IDs and provide exclusive offers, wallet cashbacks, and social login options.</p>
                                </div>
                                <div className="permission-item">
                                    <h4>SMS & Phone</h4>
                                    <p>OTP validation and direct calling to service providers and customer support.</p>
                                </div>
                                <div className="permission-item">
                                    <h4>Contacts & Media</h4>
                                    <p>Share tickets with friends and upload multimedia reviews.</p>
                                </div>
                                <div className="permission-item">
                                    <h4>Camera & Calendar</h4>
                                    <p>Capture booking confirmations and organize travel plans.</p>
                                </div>
                            </div>

                            <h3 style={{ marginTop: '2rem' }}>iOS Permissions</h3>
                            <div className="permissions-grid">
                                <div className="permission-item">
                                    <h4>Notifications</h4>
                                    <p>Receive exclusive deals, promotional offers, and travel-related updates.</p>
                                </div>
                                <div className="permission-item">
                                    <h4>Location Services</h4>
                                    <p>Personalized experience with location-specific deals and bus tracking.</p>
                                </div>
                                <div className="permission-item">
                                    <h4>Contacts & Media</h4>
                                    <p>Share bookings and upload multimedia reviews with enhanced features.</p>
                                </div>
                                <div className="permission-item">
                                    <h4>Camera & Calendar</h4>
                                    <p>Capture visual reviews and sync travel plans to your calendar.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Section C */}
                <section className="privacy-section">
                    <div
                        className="section-header"
                        onClick={() => toggleSection('sectionC')}
                    >
                        <h2>C. Cookies & Tracking Technology</h2>
                        <span className="toggle-icon">
                            {expandedSections['sectionC'] ? '−' : '+'}
                        </span>
                    </div>
                    {expandedSections['sectionC'] && (
                        <div className="section-content">
                            <p>
                                We use cookies and similar tracking technologies to enhance your browsing experience, measure promotional effectiveness, and ensure platform security.
                            </p>
                            <ul className="info-list">
                                <li><strong>Session Cookies:</strong> Automatically deleted at the end of your session</li>
                                <li><strong>Persistent Cookies:</strong> Stored to remember your preferences</li>
                                <li><strong>Purpose:</strong> Authentication, fraud prevention, personalization, and analytics</li>
                                <li><strong>Control:</strong> You can decline cookies through your browser settings, though some features may be limited</li>
                            </ul>
                        </div>
                    )}
                </section>

                {/* Section D */}
                <section className="privacy-section">
                    <div
                        className="section-header"
                        onClick={() => toggleSection('sectionD')}
                    >
                        <h2>D. Security of Your Information</h2>
                        <span className="toggle-icon">
                            {expandedSections['sectionD'] ? '−' : '+'}
                        </span>
                    </div>
                    {expandedSections['sectionD'] && (
                        <div className="section-content">
                            <p>
                                We implement comprehensive security measures to protect your personal information:
                            </p>
                            <div className="security-features">
                                <div className="feature">
                                    <span className="feature-icon">🔒</span>
                                    <div>
                                        <h4>SSL/TLS Encryption</h4>
                                        <p>All data is transmitted using industry-standard encryption protocols</p>
                                    </div>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">🛡️</span>
                                    <div>
                                        <h4>ISO 27001 Compliance</h4>
                                        <p>We maintain information security standards as per international requirements</p>
                                    </div>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">🔐</span>
                                    <div>
                                        <h4>Physical & Digital Safeguards</h4>
                                        <p>Multiple layers of protection against unauthorized access and misuse</p>
                                    </div>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">⚠️</span>
                                    <div>
                                        <h4>User Responsibility</h4>
                                        <p>Protect your password and ensure secure access to your account</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Section E */}
                <section className="privacy-section">
                    <div
                        className="section-header"
                        onClick={() => toggleSection('sectionE')}
                    >
                        <h2>E. Eligibility to Use Our Platform</h2>
                        <span className="toggle-icon">
                            {expandedSections['sectionE'] ? '−' : '+'}
                        </span>
                    </div>
                    {expandedSections['sectionE'] && (
                        <div className="section-content">
                            <p>
                                Our platform is available only to persons who can form a legally binding contract under Indian law. Minors (under 18 years) may use our platform only with parental consent and involvement of a guardian or authorized representative.
                            </p>
                        </div>
                    )}
                </section>

                {/* Section F */}
                <section className="privacy-section">
                    <div
                        className="section-header"
                        onClick={() => toggleSection('sectionF')}
                    >
                        <h2>F. Manage Your Privacy Preferences</h2>
                        <span className="toggle-icon">
                            {expandedSections['sectionF'] ? '−' : '+'}
                        </span>
                    </div>
                    {expandedSections['sectionF'] && (
                        <div className="section-content">
                            <p>
                                You have control over your personal information and communication preferences:
                            </p>
                            <ul className="info-list">
                                <li>Choose not to provide optional information</li>
                                <li>Update your profile and account details anytime</li>
                                <li>Opt-out of promotional emails and communications</li>
                                <li>Adjust your privacy settings in your account dashboard</li>
                                <li>Request data export or deletion</li>
                            </ul>
                            <p className="note">
                                <strong>Note:</strong> Legal notices and Terms of Service will always apply to your account, regardless of communication preferences.
                            </p>
                        </div>
                    )}
                </section>

                {/* Section G */}
                <section className="privacy-section">
                    <div
                        className="section-header"
                        onClick={() => toggleSection('sectionG')}
                    >
                        <h2>G. Policy Updates & Contact</h2>
                        <span className="toggle-icon">
                            {expandedSections['sectionG'] ? '−' : '+'}
                        </span>
                    </div>
                    {expandedSections['sectionG'] && (
                        <div className="section-content">
                            <p>
                                We may update this Privacy Policy from time to time. Continued use of our platform constitutes your acceptance of the updated policy.
                            </p>
                            <div className="contact-section">
                                <h3>Contact Us</h3>
                                <p>
                                    If you have any concerns, questions, or grievances regarding this Privacy Policy:
                                </p>
                                <div className="contact-box">
                                    <p>📧 <strong>Email:</strong> support@abhibus.com</p>
                                    <p>
                                        Please include a detailed description of your concern, and we will endeavor to resolve it promptly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Consent Section */}
                <div className="consent-section">
                    <h2>Your Consent</h2>
                    <p>
                        By visiting our platform and using our services, you acknowledge that you have read, understood, and agree to the practices outlined in this Privacy Policy. You consent to our collection, use, and sharing of your information as described herein.
                    </p>
                    <p>
                        If you do not agree with this Privacy Policy, please do not use our services or provide us with any information.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PrivacyandPolicy;