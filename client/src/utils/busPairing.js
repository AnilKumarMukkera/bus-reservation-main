// Algorithm to pair buses by company name for round-trip journeys

export const pairBusesByCompany = (allBuses, goingDate, returnDate) => {
  // Step 1: Filter buses for going date
  const goingBuses = [];
  for (let i = 0; i < allBuses.length; i++) {
    if (allBuses[i].date === goingDate) {
      goingBuses.push(allBuses[i]);
    }
  }

  // Step 2: Filter buses for return date
  const returnBuses = [];
  for (let i = 0; i < allBuses.length; i++) {
    if (allBuses[i].date === returnDate) {
      returnBuses.push(allBuses[i]);
    }
  }

  // Step 3: Group buses by company name
  const goingByCompany = {};
  for (let i = 0; i < goingBuses.length; i++) {
    const bus = goingBuses[i];
    const company = bus.name;

    if (goingByCompany[company] === undefined) {
      goingByCompany[company] = [];
    }
    goingByCompany[company].push(bus);
  }

  const returnByCompany = {};
  for (let i = 0; i < returnBuses.length; i++) {
    const bus = returnBuses[i];
    const company = bus.name;

    if (returnByCompany[company] === undefined) {
      returnByCompany[company] = [];
    }
    returnByCompany[company].push(bus);
  }

  // Step 4: Create pairs (cross-product for each company)
  const pairs = [];
  let pairId = 1;

  // Get all company names from going buses
  const companies = Object.keys(goingByCompany);

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];

    // Check if this company has buses on return date
    if (returnByCompany[company] !== undefined) {
      const goingBusesForCompany = goingByCompany[company];
      const returnBusesForCompany = returnByCompany[company];

      // Create all combinations (cross-product)
      for (let j = 0; j < goingBusesForCompany.length; j++) {
        const goingBus = goingBusesForCompany[j];

        for (let k = 0; k < returnBusesForCompany.length; k++) {
          const returnBus = returnBusesForCompany[k];

          const pair = {
            pairId: pairId,
            outbound: goingBus,
            return: returnBus,
            totalPrice: goingBus.price + returnBus.price
          };

          pairs.push(pair);
          pairId = pairId + 1;
        }
      }
    }
  }

  return pairs;
};
