
import React, { useState } from 'react';
import './Termsandconditions.css';

const termsData = [
    {
        section: 'General Terms and Conditions',
        details: [
            'By using our platform, you agree to comply with all applicable laws and regulations. All bookings are subject to availability and confirmation by the bus operator.',
            'We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the updated terms.',
            'Users are responsible for providing accurate information during booking. Any misuse or fraudulent activity may result in suspension of your account.'
        ]
    },
    {
        section: 'Cash Terms and Conditions',
        details: [
            'Cash payments are accepted only at designated counters or as specified by the bus operator.',
            'Please collect a valid receipt for all cash transactions. The platform is not responsible for cash payments made outside authorized channels.',
            'Cash refunds, if applicable, will be processed as per the operator’s policy and may require physical verification.'
        ]
    },
    {
        section: "Offers & Discounts",
        details: [
            'Offers and discounts are subject to specific terms and may be withdrawn at any time without prior notice.',
            'Promo codes must be entered at the time of booking and cannot be applied retroactively.',
            'Each offer may have eligibility criteria and usage limits. Please refer to the offer details for more information.'
        ]
    },
    {
        section: 'Bus Responsibility',
        details: [
            'The bus operator is responsible for providing the service as per the schedule and ensuring passenger safety during the journey.',
            'Operators are required to maintain cleanliness, punctuality, and adhere to all safety regulations.',
            'In case of delays or cancellations, the operator will communicate updates and provide assistance as per policy.'
        ]
    },
    {
        section: 'Not Bus Responsibility',
        details: [
            'The platform and bus operator are not responsible for loss of personal belongings, delays due to traffic, weather, or unforeseen circumstances.',
            'We are not liable for any indirect, incidental, or consequential damages arising from the use of the service.',
            'Passengers are advised to arrive at the boarding point at least 15 minutes before departure.'
        ]
    },
    {
        section: 'Failed Transaction',
        details: [
            'If your payment fails but the amount is deducted, it is usually refunded automatically within 3-7 business days.',
            'If you do not receive a refund within this period, please contact customer support with your transaction details.',
            'The platform is not responsible for delays caused by payment gateways or banks.'
        ]
    },
    {
        section: 'Cancellation Policy',
        details: [
            'Cancellations can be made through the platform or by contacting customer support, subject to the operator’s policy.',
            'Cancellation charges may apply based on the time of cancellation and operator rules.',
            'No cancellations are allowed after the scheduled departure time.'
        ]
    },
    {
        section: 'Refund Policy',
        details: [
            'Refunds for eligible cancellations are processed within 3-7 business days to the original payment method.',
            'Refund timelines may vary depending on the payment provider and operator policies.',
            'Partial refunds may apply if only part of the journey is cancelled.'
        ]
    },
    {
        section: 'Free Cancellation Terms and Conditions',
        details: [
            'Free cancellation is available only on select routes and buses, as indicated during booking.',
            'To avail free cancellation, requests must be made within the specified time window before departure.',
            'If eligible, no cancellation charges will be deducted and the full amount will be refunded.'
        ]
    },
    {
        section: 'Assured Terms and Conditions',
        details: [
            '“Assured” buses meet our highest standards for punctuality, cleanliness, and safety.',
            'Assured status is granted after thorough verification and regular audits of the operator’s service.',
            'Look for the “Assured” badge when booking for a premium travel experience.'
        ]
    },
    {
        section: 'Bus Travel Guarantee Terms and Conditions',
        details: [
            'Travel Guarantee ensures a full refund or alternative arrangement if your bus is cancelled by the operator.',
            'To claim, contact support with your booking details. Terms apply as per the guarantee policy.',
            'Guarantee does not cover cancellations due to force majeure events.'
        ]
    },
    {
        section: 'Travel Guidance',
        details: [
            'Carry a valid ID and your ticket (digital or printed) for boarding.',
            'Follow all safety instructions provided by the operator and staff.',
            'For assistance during travel, contact the helpline or use the in-app support feature.'
        ]
    },
    {
        section: 'Insurance Terms',
        details: [
            'Travel insurance, if opted, is provided by third-party insurers as per their terms and conditions.',
            'Claims must be filed directly with the insurer. The platform is not responsible for claim processing.',
            'Please read the insurance policy document carefully before purchasing.'
        ]
    }
];

function Termsandconditions() {
    const [openIndex, setOpenIndex] = useState(null);
    const [selectedSection, setSelectedSection] = useState('');

    const handleToggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
        setSelectedSection(termsData[idx].section);
    };

    const handleSelectChange = (e) => {
        const idx = termsData.findIndex(s => s.section === e.target.value);
        setOpenIndex(idx);
        setSelectedSection(e.target.value);
        setTimeout(() => {
            const el = document.getElementById(`terms-section-${idx}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="terms-container">
            <div className="terms-header-row">
                <h1 className="terms-title">Terms and Conditions</h1>
            </div>
            {termsData.map((section, idx) => (
                <div
                    className={`terms-section${openIndex === idx ? ' open' : ''}`}
                    key={section.section}
                    id={`terms-section-${idx}`}
                >
                    <button
                        className="terms-header"
                        onClick={() => handleToggle(idx)}
                        aria-expanded={openIndex === idx}
                        aria-controls={`terms-content-${idx}`}
                    >
                        {section.section}
                        <span className="terms-arrow">▶</span>
                    </button>
                    {openIndex === idx && (
                        <div className="terms-content" id={`terms-content-${idx}`}> 
                            <ul>
                                {section.details.map((detail, dIdx) => (
                                    <li key={dIdx}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Termsandconditions;