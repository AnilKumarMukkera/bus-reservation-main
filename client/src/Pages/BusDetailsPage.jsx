
import FilterSidebar from '../components/BusDetails/FilterSidebar';
import SortBar from '../components/BusDetails/SortBar';
import BusCard from '../components/BusDetails/BusCard';
import BusPairCard from '../components/BusDetails/BusPairCard';
import './BusDetailsPage.css';
import { pairBusesByCompany } from '../utils/busPairing';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import React, { useState, useMemo, useEffect } from 'react';

const BusDetailsPage = () => {
  // 1. State for data and interactions
  const navigate = useNavigate();
  
  const location = useLocation();
  const tripState = location.state || {};
  
  const [allBuses, setAllBuses] = useState([]);
  const [returnBuses, setReturnBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ AC: false, NonAC: false, Sleeper: false, Seater: false });
  const [sortBy, setSortBy] = useState('Price'); // Default sort
  
  const tripType = tripState.tripType || 'one-way';
  const goingDate = tripState.date || tripState.goingDate || '2024-04-25';
  const returnDate = tripState.returnDate || '2024-04-27';
  const source = tripState.from || tripState.source || 'Hyderabad';
  const destination = tripState.to || tripState.destination || 'Mumbai';

  // 2. Fetch buses from backend on component mount or when search params change
  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch outgoing buses (source -> destination)
        const outgoingResponse = await axios.post('http://localhost:3939/api/client/search', {
          source,
          destination,
          startDate: goingDate,
        });

        if (!outgoingResponse.data.success) {
          setError(outgoingResponse.data.message || 'Failed to fetch outgoing buses');
          setLoading(false);
          return;
        }

        const outgoingBuses = outgoingResponse.data.data || [];
        setAllBuses(outgoingBuses);

        // If two-way trip, fetch return buses (destination -> source)
        if (tripType === 'two-way') {
          const returnResponse = await axios.post('http://localhost:3939/api/client/search', {
            source: destination, // Swap source and destination
            destination: source,
            startDate: returnDate,
          });

          if (returnResponse.data.success) {
            const returnBusesData = returnResponse.data.data || [];
            setReturnBuses(returnBusesData);
          } else {
            console.warn('Failed to fetch return buses:', returnResponse.data.message);
            setReturnBuses([]);
          }
        } else {
          setReturnBuses([]);
        }
      } catch (err) {
        console.error('Error fetching buses:', err);
        setError(err.message || 'Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [source, destination, goingDate, returnDate, tripType]);

  const handleClearAllFilters = () => {
    setFilters({ AC: false, NonAC: false, Sleeper: false, Seater: false });
  };

  const handleSelectSeats = (bus, pairData) => {
    let selectedTripType = tripType;

    if (!selectedTripType) {
      selectedTripType = 'one-way';
    }

    let routeState = {
      busId: bus.id,
      bus: bus, // Pass entire bus object with all details
      tripType: selectedTripType,
      goingDate: goingDate,
      returnDate: returnDate,
      from: source,
      to: destination,
      source: source,
      destination: destination,
      passengers: tripState.passengers,
      passengerDetails: tripState.passengerDetails
    };

    if (pairData) {
      routeState.tripType = 'two-way';
      routeState.returnBusId = pairData.return.id;
      routeState.returnBus = pairData.return; // Pass entire return bus object
      routeState.returnBusName = pairData.return.name;
      routeState.returnSeatLayoutId = pairData.return.seatLayoutId;
      routeState.returnDate = pairData.return.date;
    }

    navigate(`/seat-layout/${bus.id}`, {
      state: routeState
    });
  };

  const isBusMatchingFilters = (bus) => {
    let noFiltersActive = true;

    if (filters.AC) {
      noFiltersActive = false;
    }
    if (filters.NonAC) {
      noFiltersActive = false;
    }
    if (filters.Sleeper) {
      noFiltersActive = false;
    }
    if (filters.Seater) {
      noFiltersActive = false;
    }

    if (noFiltersActive) {
      return true;
    }

    let matches = false;
    const typeUpper = bus.type.toUpperCase();

    if (filters.AC) {
      if (typeUpper.includes('AC')) {
        if (!typeUpper.includes('NON-AC')) {
          matches = true;
        }
      }
    }

    if (filters.NonAC) {
      if (typeUpper.includes('NON-AC')) {
        matches = true;
      }
    }

    if (filters.Sleeper) {
      if (typeUpper.includes('SLEEPER')) {
        matches = true;
      }
    }

    if (filters.Seater) {
      if (typeUpper.includes('SEATER')) {
        matches = true;
      }
    }

    return matches;
  };

  const isPairMatchingFiltersStrict = (pair) => {
    const outboundMatches = isBusMatchingFilters(pair.outbound);
    const returnMatches = isBusMatchingFilters(pair.return);

    if (outboundMatches) {
      if (returnMatches) {
        return true;
      }
    }

    return false;
  };

  // 2. Sorting Logic
  const sortedAndFilteredBuses = useMemo(() => {
    // First, apply filters (from previous step)
    let result = allBuses.filter(bus => {
      return isBusMatchingFilters(bus);
    });

    // Second, apply sorting
    return result.sort((a, b) => {
      if (sortBy === 'Price') return a.price - b.price;
      if (sortBy === 'Ratings') {
        const ra = a.avgRating ?? a.rating ?? 0;
        const rb = b.avgRating ?? b.rating ?? 0;
        return rb - ra; // Higher rating first
      }
      if (sortBy === 'Seats') return b.seatsAvailable - a.seatsAvailable;
      if (sortBy === 'Departure') return a.departureTime.localeCompare(b.departureTime);
      if (sortBy === 'Arrival') return a.arrivalTime.localeCompare(b.arrivalTime);
      return 0;
    });
  }, [allBuses, filters, sortBy]);

  const pairedBuses = useMemo(() => {
    // For two-way trips, combine outgoing and return buses
    // then pass to the existing pairing logic
    if (tripType === 'two-way' && returnBuses.length > 0) {
      // Combine outgoing and return buses with date markers
      const allBusesForPairing = [
        ...allBuses.map(bus => ({ ...bus, tripDirection: 'outgoing' })),
        ...returnBuses.map(bus => ({ ...bus, tripDirection: 'return' })),
      ];
      return pairBusesByCompany(allBusesForPairing, goingDate, returnDate);
    } else {
      // For one-way trips, use only outgoing buses
      return pairBusesByCompany(allBuses, goingDate, returnDate);
    }
  }, [allBuses, returnBuses, goingDate, returnDate, tripType]);

  const filteredPairedBuses = useMemo(() => {
    const result = [];

    for (let i = 0; i < pairedBuses.length; i++) {
      const pair = pairedBuses[i];

      if (isPairMatchingFiltersStrict(pair)) {
        result.push(pair);
      }
    }

    return result;
  }, [pairedBuses, filters]);

  const sortedPairedBuses = useMemo(() => {
    const result = [...filteredPairedBuses];

    return result.sort((a, b) => {
      if (sortBy === 'Price') return a.totalPrice - b.totalPrice;
      if (sortBy === 'Ratings') {
        const ra = a.outbound.avgRating ?? a.outbound.rating ?? 0;
        const rb = b.outbound.avgRating ?? b.outbound.rating ?? 0;
        return rb - ra;
      }
      if (sortBy === 'Seats') {
        const seatsA = a.outbound.seatsAvailable + a.return.seatsAvailable;
        const seatsB = b.outbound.seatsAvailable + b.return.seatsAvailable;
        return seatsB - seatsA;
      }
      if (sortBy === 'Departure') return a.outbound.departureTime.localeCompare(b.outbound.departureTime);
      if (sortBy === 'Arrival') return a.return.arrivalTime.localeCompare(b.return.arrivalTime);
      return 0;
    });
  }, [filteredPairedBuses, sortBy]);

  let displayCount;
  if (tripType === 'two-way') {
    displayCount = sortedPairedBuses.length;
  } else {
    displayCount = sortedAndFilteredBuses.length;
  }

  let busDisplayContent;

  if (loading) {
    busDisplayContent = (
      <div className="loading-message">
        <p>Loading available buses...</p>
      </div>
    );
  } else if (error) {
    busDisplayContent = (
      <div className="error-message">
        <p>Error: {error}</p>
      </div>
    );
  } else if (tripType === 'two-way') {
    busDisplayContent = (
      <div className="bus-pair-list">
        {sortedPairedBuses.map(pair => (
          <BusPairCard
            key={pair.pairId}
            pair={pair}
            goingDate={goingDate}
            returnDate={returnDate}
            onSelectSeats={handleSelectSeats}
          />
        ))}
      </div>
    );
  } else {
    busDisplayContent = (
      <div className="bus-list">
        {sortedAndFilteredBuses.map(bus => (
          <BusCard key={bus.id} bus={bus} onSelectSeats={handleSelectSeats} />
        ))}
      </div>
    );
  }

  return (
    <div className="bus-details-page">
      <aside className="sidebar-container">
        <FilterSidebar 
          selectedFilters={filters} 
          onFilterChange={(name, checked) => setFilters(prev => ({ ...prev, [name]: checked }))}
          onClearAll={handleClearAllFilters}
        />
      </aside>

      <main className="main-content">
        <SortBar 
          count={displayCount} 
          activeSort={sortBy} 
          onSortChange={setSortBy} 
        />

        {busDisplayContent}
      </main>
    </div>
  );
};

export default BusDetailsPage;