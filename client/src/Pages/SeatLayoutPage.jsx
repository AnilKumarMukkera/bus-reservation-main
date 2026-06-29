import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { findLayoutById } from '../components/SeatLayout/seatLayoutHelpers';
import SeatLayoutView from '../components/SeatLayout/SeatLayoutView';

const SeatLayoutPage = () => {
  const location = useLocation();
  const params = useParams();
  const routeState = location.state;

  let selectedBus = null;
  let selectedLayout = null;
  let returnBus = null;
  let returnLayout = null;

  // First, try to get bus from route state (dynamic data from API)
  if (routeState && routeState.bus) {
    selectedBus = routeState.bus;
  }

  if (selectedBus) {
    // Use the dynamic seatLayout from the bus if available, otherwise fallback to static for backward compatibility
    selectedLayout = selectedBus.seatLayout || findLayoutById(selectedBus.seatLayoutId);
  }

  // Handle return bus for two-way trips
  if (routeState && routeState.tripType === 'two-way' && routeState.returnBus) {
    returnBus = routeState.returnBus;

    if (returnBus) {
      returnLayout = returnBus.seatLayout || findLayoutById(returnBus.seatLayoutId);
    }
  }

  return (
    <SeatLayoutView
      selectedBus={selectedBus}
      selectedLayout={selectedLayout}
      returnBus={returnBus}
      returnLayout={returnLayout}
      routeState={routeState}
    />
  );
};

export default SeatLayoutPage;
