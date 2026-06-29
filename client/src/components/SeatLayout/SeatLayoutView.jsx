import React, { useState, useEffect } from 'react';
import SeatLayoutHeader from './SeatLayoutHeader';
import SeatLayoutLegTabs from './SeatLayoutLegTabs';
import SeatLayoutGrid from './SeatLayoutGrid';
import SeatLayoutSummary from './SeatLayoutSummary';
import { useSeatLayoutController } from './useSeatLayoutController';
import './SeatLayoutView.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SeatLayoutView = ({ selectedBus, selectedLayout, returnBus, returnLayout, routeState }) => {
  const navigate = useNavigate();
  const [bookingLoading, setBookingLoading] = useState(false);

  const controller = useSeatLayoutController({
    selectedBus,
    selectedLayout,
    returnBus,
    returnLayout,
    routeState
  });

  const handleContinue = async () => {
    // Prepare booking data and redirect user to Payment page.
    // Actual booking (POST /api/bookings) will happen after payment confirmation on the PaymentPage.
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book seats.');
        navigate('/login');
        return;
      }

      const goingSeats = controller.selectedSeatsByLeg.going.map(s => s.seatNo);
      const returnSeats = controller.selectedSeatsByLeg.return.map(s => s.seatNo);

      if (goingSeats.length === 0 && returnSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
      }

      // Build a booking payload compatible with PaymentPage expectations
      const bookingPayload = {
        busId: selectedBus.busId,
        busName: selectedBus.busName || selectedBus.name || '',
        busCategory: selectedBus.busCategory || selectedBus.type || '',
        from: routeState?.from || 'Unknown',
        to: routeState?.to || 'Unknown',
        date: selectedBus.date,
        seats: goingSeats.length ? goingSeats : returnSeats,
        totalAmount: controller.totalPrice || 0,
        // Pair each passenger from the modal with their selected seat
        passengers: (routeState?.passengerDetails || []).map((p, i) => ({
          ...p,
          seatNo: String((goingSeats.length ? goingSeats : returnSeats)[i] || ''),
        })),
      };

      // If two-way and both legs selected, include both legs in payload as `legs` array
      if (controller.isTwoWay) {
        const legs = [];

        if (goingSeats.length > 0) {
          legs.push({
            busId: selectedBus.busId,
            busName: selectedBus.busName || selectedBus.name || '',
            busCategory: selectedBus.busCategory || selectedBus.type || '',
            from: routeState?.from || 'Unknown',
            to: routeState?.to || 'Unknown',
            date: selectedBus.date,
            seats: goingSeats,
            passengerDetails: (routeState?.passengerDetails || []).slice(0, goingSeats.length),
            totalAmount: controller.goingTotal || 0,
            withoutDriver: controller.goingWithoutDriver || false,
          });
        }

        if (returnSeats.length > 0 && returnBus?.busId) {
          legs.push({
            busId: returnBus.busId,
            busName: returnBus?.busName || returnBus?.name || '',
            busCategory: returnBus?.busCategory || returnBus?.type || '',
            from: routeState?.to || 'Unknown',
            to: routeState?.from || 'Unknown',
            date: returnBus?.date,
            seats: returnSeats,
            passengerDetails: (routeState?.passengerDetails || []).slice(0, returnSeats.length),
            totalAmount: controller.returnTotal || 0,
            withoutDriver: controller.returnWithoutDriver || false,
          });
        }

        // Only use legs array if we actually have valid legs; otherwise fall back to single-leg
        if (legs.length > 0) {
          bookingPayload.legs = legs;
        }

        // retain top-level fields for compatibility; set totalAmount to both legs sum
        bookingPayload.seats = goingSeats.length ? goingSeats : returnSeats;
        bookingPayload.totalAmount = (Number(controller.goingTotal || 0) + Number(controller.returnTotal || 0)) || controller.totalPrice || 0;
      }

      navigate('/payment', { state: { booking: bookingPayload } });
    } catch (err) {
      console.error('Continue to payment failed:', err);
      alert('An error occurred while preparing payment. Please try again.');
    }
  };

  // NOTE: 'hold' behaviour removed — no release-on-unload required.

  if (!selectedBus) {
    return (
      <div className="seat-layout-page">
        <div style={{ padding: '20px' }}>
          <p>No bus selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-layout-page">
      <div className="seat-layout-shell">
        <SeatLayoutHeader bus={selectedBus} routeState={routeState} />

        <div className="seat-layout-meta">
          <span><strong>Going Date:</strong> {selectedBus.date}</span>
          {controller.isTwoWay ? <span><strong>Return Date:</strong> {returnBus.date}</span> : null}
          <span><strong>Trip Type:</strong> {routeState && routeState.tripType ? routeState.tripType : 'one-way'}</span>
        </div>

        <SeatLayoutLegTabs
          isTwoWay={controller.isTwoWay}
          activeLeg={controller.activeLeg}
          onChange={controller.setActiveLeg}
          goingSelectedCount={controller.goingSelectedCount}
          returnSelectedCount={controller.returnSelectedCount}
        />

        <div className="seat-layout-content">
          <SeatLayoutGrid
            title={`${controller.activeLegLabel} Seat Layout`}
            busName={controller.currentBus ? controller.currentBus.name : ''}
            seatRows={controller.currentSeatRows}
            layoutType={controller.currentLayout ? controller.currentLayout.type : ''}
            getSeatClass={controller.getSeatClass}
            onSeatClick={controller.handleSeatClick}
          />

          <SeatLayoutSummary
            currentLegLabel={controller.activeLegLabel}
            selectedSeatCount={controller.selectedSeatCount}
            totalPrice={controller.totalPrice}
            selectedSeats={controller.currentSelectedSeats}
            isTwoWay={controller.isTwoWay}
            goingTotal={controller.goingTotal}
            returnTotal={controller.returnTotal}
            onContinue={handleContinue}
          />
        </div>
      </div>
      {bookingLoading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,255,255,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <h2>Booking your seats...</h2>
        </div>
      )}
    </div>
  );
};

export default SeatLayoutView;
