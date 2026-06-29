import React, { useState } from 'react';
import './FAQs.css';

const faqData = [
    {
        category: "Online Booking Related",
        qas: [
            {
                q: "How do I book a bus ticket online?",
                a: "Select your route, choose your bus, pick your seat, and complete payment to book instantly."
            },
            {
                q: "Can I book tickets for others?",
                a: "Yes, you can book tickets for friends or family by entering their details during booking."
            }
        ]
    },
    {
        category: "Cancellation Related",
        qas: [
            {
                q: "How can I cancel my ticket?",
                a: "Go to 'My Bookings', select your ticket, and click 'Cancel'. Refunds will be processed as per policy."
            },
            {
                q: "Are there any cancellation charges?",
                a: "Cancellation charges depend on the bus operator and time before departure. Check cancellation policy for details."
            }
        ]
    },
    {
        category: "Payments Related",
        qas: [
            {
                q: "What payment methods are accepted?",
                a: "We accept credit/debit cards, net banking, UPI, and popular wallets."
            },
            {
                q: "My payment failed but money was deducted. What should I do?",
                a: "Usually, the amount is refunded automatically within 3-5 business days. If not, contact support."
            }
        ]
    },
    {
        category: "Refunds Related",
        qas: [
            {
                q: "When will I get my refund after cancellation?",
                a: "Refunds are processed within 3-7 business days to your original payment method."
            },
            {
                q: "How can I track my refund status?",
                a: "You can check refund status in 'My Bookings' or contact customer support."
            }
        ]
    },
    {
        category: "Bus Partner Related",
        qas: [
            {
                q: "How do I become a bus partner?",
                a: "Visit our 'Bus Partner' page and fill out the registration form. Our team will contact you."
            },
            {
                q: "Can I list my bus on your platform?",
                a: "Yes, bus operators can list their buses after verification."
            }
        ]
    },
    {
        category: "Discounts and Offers",
        qas: [
            {
                q: "How do I use a promo code?",
                a: "Enter your promo code at checkout to avail discounts."
            },
            {
                q: "Where can I find current offers?",
                a: "Check our 'Offers' section or subscribe to our newsletter for updates."
            }
        ]
    },
    {
        category: "Other Information",
        qas: [
            {
                q: "How do I contact customer support?",
                a: "You can reach us via the 'Contact Us' page or call our helpline."
            },
            {
                q: "Is my personal information safe?",
                a: "Yes, we use advanced security measures to protect your data."
            }
        ]
    },
    {
        category: "Free Cancellation Related",
        qas: [
            {
                q: "What is free cancellation?",
                a: "Free cancellation allows you to cancel your ticket without any charges within a specified period."
            },
            {
                q: "How do I know if my ticket is eligible?",
                a: "Eligible tickets will have a 'Free Cancellation' tag during booking."
            }
        ]
    },
    {
        category: "Assured Related",
        qas: [
            {
                q: "What does 'Assured' mean?",
                a: "'Assured' buses meet our highest standards for punctuality, cleanliness, and safety."
            },
            {
                q: "How do I book an Assured bus?",
                a: "Look for the 'Assured' badge while searching for buses."
            }
        ]
    },
    {
        category: "Travel Guarantee Related",
        qas: [
            {
                q: "What is Travel Guarantee?",
                a: "Travel Guarantee ensures a full refund or alternative arrangement if your bus is cancelled by the operator."
            },
            {
                q: "How do I claim Travel Guarantee?",
                a: "Contact our support team with your booking details if your bus is cancelled."
            }
        ]
    }
];

function FAQs() {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="faq-container">
            <div className="faq-title">FAQ</div>
            {faqData.map((section, idx) => (
                <div
                    className={`faq-section${openIndex === idx ? " open" : ""}`}
                    key={section.category}
                >
                    <button
                        className="faq-header"
                        onClick={() => handleToggle(idx)}
                        aria-expanded={openIndex === idx}
                        aria-controls={`faq-content-${idx}`}
                    >
                        {section.category}
                        <span className="faq-arrow">▶</span>
                    </button>
                    {openIndex === idx && (
                        <div className="faq-content" id={`faq-content-${idx}`}>
                            {section.qas.map((qa, qidx) => (
                                <div className="faq-qa" key={qidx}>
                                    <div className="faq-question">Q: {qa.q}</div>
                                    <div className="faq-answer">{qa.a}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default FAQs;