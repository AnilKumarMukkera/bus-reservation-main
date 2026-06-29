import { useMemo, useState } from 'react';
import axios from 'axios';
import { cloneLayoutRows } from './seatLayoutHelpers';

export const useSeatLayoutController = ({ selectedBus, selectedLayout, returnBus, returnLayout, routeState }) => {
  const isTwoWay = routeState && routeState.tripType === 'two-way' && returnBus !== null && returnLayout !== null;

  const [activeLeg, setActiveLeg] = useState('going');
  const [selectedSeatsByLeg, setSelectedSeatsByLeg] = useState({
    going: [],
    return: []
  });

  const currentBus = activeLeg === 'return' ? returnBus : selectedBus;
  const currentLayout = activeLeg === 'return' ? returnLayout : selectedLayout;
  const currentSelectedSeats = activeLeg === 'return' ? selectedSeatsByLeg.return : selectedSeatsByLeg.going;

  const currentSeatRows = useMemo(() => cloneLayoutRows(currentLayout), [currentLayout]);

  const selectedSeatCount = useMemo(() => currentSelectedSeats.length, [currentSelectedSeats]);

  const totalPrice = useMemo(() => {
    let total = 0;

    for (let i = 0; i < currentSelectedSeats.length; i++) {
      total = total + Number(currentSelectedSeats[i].price);
    }

    return total;
  }, [currentSelectedSeats]);

  const isSeatSelected = (seatNo) => {
    for (let i = 0; i < currentSelectedSeats.length; i++) {
      if (currentSelectedSeats[i].seatNo === seatNo) {
        return true;
      }
    }

    return false;
  };

  const handleSeatClick = (seat) => {
    const sStatus = (seat.status || '').toString().toLowerCase();
    // treat only booked seats as unavailable for selection; ignore 'held' status on client
    if (sStatus === 'booked') {
      return;
    }

    let alreadySelected = false;
    for (let i = 0; i < currentSelectedSeats.length; i++) {
      if (currentSelectedSeats[i].seatNo === seat.seatNo) {
        alreadySelected = true;
        break;
      }
    }

    if (alreadySelected) {
      const updatedSeats = currentSelectedSeats.filter(s => s.seatNo !== seat.seatNo);

      if (activeLeg === 'return') {
        setSelectedSeatsByLeg({
          going: selectedSeatsByLeg.going,
          return: updatedSeats
        });
      } else {
        setSelectedSeatsByLeg({
          going: updatedSeats,
          return: selectedSeatsByLeg.return
        });
      }

      return;
    }

    // Gender and total seats validation
    let maxSeats = 6;
    let femalePassengersCount = 6; // Default to allow any if no details
    let malePassengersCount = 6;   // Default to allow any if no details
    let isStrictGenderValidation = false;
    
    if (routeState && routeState.passengerDetails) {
      maxSeats = routeState.passengerDetails.length;
      femalePassengersCount = routeState.passengerDetails.filter(p => p.gender === 'Female').length;
      malePassengersCount = routeState.passengerDetails.filter(p => p.gender === 'Male').length;
      isStrictGenderValidation = true;
    } else if (routeState && routeState.passengers) {
      maxSeats = Number(routeState.passengers);
    }

    if (currentSelectedSeats.length >= maxSeats) {
      alert(`You can only select up to ${maxSeats} seats.`);
      return;
    }

    if (isStrictGenderValidation) {
      if (seat.femaleOnly) {
        const currentFemaleSeats = currentSelectedSeats.filter(s => s.femaleOnly).length;
        if (currentFemaleSeats >= femalePassengersCount) {
          alert(`You can only select up to ${femalePassengersCount} female seats based on your passenger details.`);
          return;
        }
      } else {
        const currentMaleSeats = currentSelectedSeats.filter(s => !s.femaleOnly).length;
        if (currentMaleSeats >= malePassengersCount) {
          alert(`You can only select up to ${malePassengersCount} male/general seats based on your passenger details.`);
          return;
        }
      }
    } else {
      if (seat.femaleOnly) {
        const currentFemaleSeats = currentSelectedSeats.filter(s => s.femaleOnly).length;
        if (currentFemaleSeats >= femalePassengersCount) {
          alert(`You can only select up to ${femalePassengersCount} female-only seats.`);
          return;
        }
      }
    }

    // Directly select the seat locally (no reservation/hold logic)
    if (activeLeg === 'return') {
      setSelectedSeatsByLeg({
        going: selectedSeatsByLeg.going,
        return: [...currentSelectedSeats, seat]
      });
    } else {
      setSelectedSeatsByLeg({
        going: [...currentSelectedSeats, seat],
        return: selectedSeatsByLeg.return
      });
    }
  };

  const getSeatClass = (seat) => {
    let seatClass = 'seat-box';

    const sStatus = (seat.status || '').toString().toLowerCase();
    if (sStatus === 'booked') {
      seatClass = 'seat-box booked';
    } else if (isSeatSelected(seat.seatNo)) {
      seatClass = 'seat-box selected';
    } else if (seat.femaleOnly) {
      seatClass = 'seat-box female-only';
    } else {
      seatClass = 'seat-box available';
    }

    return seatClass;
  };

  const activeLegLabel = activeLeg === 'return' ? 'Return' : 'Going';
  const goingSelectedCount = selectedSeatsByLeg.going.length;
  const returnSelectedCount = selectedSeatsByLeg.return.length;
  const goingTotal = selectedSeatsByLeg.going.reduce((sum, seat) => sum + Number(seat.price), 0);
  const returnTotal = selectedSeatsByLeg.return.reduce((sum, seat) => sum + Number(seat.price), 0);

  return {
    isTwoWay,
    activeLeg,
    setActiveLeg,
    currentBus,
    currentLayout,
    currentSeatRows,
    currentSelectedSeats,
    selectedSeatCount,
    totalPrice,
    activeLegLabel,
    goingSelectedCount,
    returnSelectedCount,
    goingTotal,
    returnTotal,
    handleSeatClick,
    getSeatClass,
    selectedSeatsByLeg
  };
};
