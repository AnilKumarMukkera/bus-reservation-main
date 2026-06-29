import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BusTicket.css';

function TicketCard({ bookingData }) {
  // Support several possible booking field names returned by server
  const bookingId = bookingData.ticketNumber || bookingData.ticketId || bookingData.id || bookingData._id || 'N/A';
  const busName = bookingData.busName || bookingData.bus || 'rebel';
  const route = bookingData.route || `${bookingData.from || ''} → ${bookingData.to || ''}`;

  // Aggressively extract seats and passengers from ANY possible nested backend object
  const seats = bookingData.seats || (bookingData.data && bookingData.data.seats) || [];

  const passengerDetails =
    bookingData.passengerDetails ||
    bookingData.passengers ||
    bookingData.passengerInfo ||
    (bookingData.data && bookingData.data.passengers) ||
    [];

  const createdAt = bookingData.createdAt || bookingData.date || bookingData.dateOfBooking || '';
  const status = (bookingData.status || 'confirmed').toString().toLowerCase();

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  return (
    <article className="bus-ticket" aria-label="Bus ticket receipt">
      <header className="bus-ticket__header">
        <div className="bus-ticket__brand">
          <p className="bus-ticket__label">E-Ticket Confirmed</p>
          <h1 className="bus-ticket__title">{busName}</h1>
        </div>
        <div className="bus-ticket__header-right">
          <span className={`bus-ticket__status bus-ticket__status--${status}`}>
            {status}
          </span>
          <p className="bus-ticket__pnr">Ticket ID: {bookingId}</p>
        </div>
      </header>

      <section className="bus-ticket__section">
        <div className="bus-ticket__route-overview">
          <h2 className="bus-ticket__route-title">{route}</h2>
          <p className="bus-ticket__datetime">{formattedDate} • {bookingData.time || formattedTime}</p>
        </div>
      </section>

      <section className="bus-ticket__section">
        <h3 className="bus-ticket__section-title">Passenger Info</h3>
        <div className="bus-ticket__table-wrapper">
          <table className="bus-ticket__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Seat No</th>
              </tr>
            </thead>
            <tbody>
              {passengerDetails.length > 0 ? (
                passengerDetails.map((passenger, index) => (
                  <tr key={index}>
                    <td>{passenger.fullName || passenger.name || passenger.passengerName || 'N/A'}</td>
                    <td>{passenger.age || passenger.passengerAge || 'N/A'}</td>
                    <td>{passenger.gender || passenger.passengerGender || 'N/A'}</td>
                    <td className="bus-ticket__seat">
                      {passenger.seatNo || passenger.seatNumber || seats[index] || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data-msg">
                    No passenger details found. (If this is a new ticket, check your Node.js backend schema!)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}

function BusTicket({ bookingData: propBooking }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Support single booking or multiple bookings (e.g. round-trip)
  const bookings = location.state?.bookings || (propBooking ? [propBooking] : null);
  const singleBooking = propBooking || location.state?.booking || null;

  // If we have a bookings array (multi-leg), render all tickets stacked
  const ticketList = bookings && bookings.length > 0 ? bookings : (singleBooking ? [singleBooking] : []);

  if (ticketList.length === 0) {
    return <div className="bus-ticket-loading">Loading ticket details...</div>;
  }

  const firstStatus = (ticketList[0]?.status || 'confirmed').toString().toLowerCase();

  return (
    <div className="bus-ticket-page">
      {ticketList.map((booking, idx) => (
        <TicketCard key={booking._id || booking.id || idx} bookingData={booking} />
      ))}

      <footer className="bus-ticket__footer">
        <p>Please show this digital receipt along with an ID card while boarding.</p>
        <div className="bus-ticket__actions">
          <button
            className="bus-ticket__btn bus-ticket__btn--bookings"
            onClick={() => navigate('/bookings')}
          >
            Go to Bookings
          </button>
          <button
            className="bus-ticket__btn bus-ticket__btn--print"
            onClick={() => window.print()}
            aria-label="Print ticket"
          >
            Print
          </button>
          {firstStatus !== 'cancelled' && (
            <button
              className="bus-ticket__btn bus-ticket__btn--cancel"
              onClick={() => navigate('/cancel-booking', { state: { booking: ticketList[0] } })}
            >
              Cancel Ticket
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default BusTicket;