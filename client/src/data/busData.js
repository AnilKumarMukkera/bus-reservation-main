export const buses = [
  {
    id: 1,
    name: 'Chirutha - Purple Bus',
    date: '2024-04-25',
    type: 'AC Sleeper (2 + 1)',
    seatLayoutType: 'sleeper',
    seatLayoutId: 'sleeper-2x1',
    departureTime: '15:30',
    arrivalTime: '06:30',
    duration: '15h',
    price: 992,
    rating: 4.2,
    reviewCount: 103,
    seatsAvailable: 20
  },
  {
    id: 2,
    name: 'Dhruva Travels',
    date: '2024-04-25',
    type: 'VE AC Sleeper (2 + 1)',
    seatLayoutType: 'sleeper',
    seatLayoutId: 'sleeper-2x1',
    departureTime: '19:30',
    arrivalTime: '10:00',
    duration: '14h 30m',
    price: 922,
    rating: 3.4,
    reviewCount: 10,
    seatsAvailable: 3
  },
  {
    id: 3,
    name: 'Orange Travels',
    date: '2024-04-25',
    type: 'Non-AC Seater',
    seatLayoutType: 'seater',
    seatLayoutId: 'seater-37',
    departureTime: '08:00',
    arrivalTime: '21:00',
    duration: '13h',
    price: 550,
    rating: 3.8,
    reviewCount: 99,
    seatsAvailable: 37
  },
  {
    id: 4,
    name: 'Nayak Travels',
    date: '2024-04-25',
    type: 'Electric AC Sleeper',
    seatLayoutType: 'sleeper',
    seatLayoutId: 'sleeper-2x1',
    departureTime: '22:00',
    arrivalTime: '09:30',
    duration: '11h 30m',
    price: 1250,
    rating: 4.5,
    reviewCount: 16,
    seatsAvailable: 12
  },
  {
    id: 5,
    name: 'Peddi Travels',
    date: '2024-04-25',
    type: 'AC Sleeper Multi-Axle',
    seatLayoutType: 'sleeper',
    seatLayoutId: 'sleeper-2x1',
    departureTime: '17:45',
    arrivalTime: '07:15',
    duration: '13h 30m',
    price: 1800,
    rating: 4.7,
    reviewCount: 12,
    seatsAvailable: 8
  },
  {
    id: 6,
    name: 'Chirutha - Purple Bus',
    date: '2024-04-27',
    type: 'AC Seater (2 + 1)',
    seatLayoutType: 'seater',
    seatLayoutId: 'seater-37',
    departureTime: '16:15',
    arrivalTime: '07:00',
    duration: '14h 45m',
    price: 980,
    rating: 4.1,
    reviewCount: 88,
    seatsAvailable: 18
  },
  {
    id: 7,
    name: 'Dhruva Travels',
    date: '2024-04-27',
    type: 'VE AC Sleeper (2 + 1)',
    seatLayoutType: 'sleeper',
    seatLayoutId: 'sleeper-2x1',
    departureTime: '20:00',
    arrivalTime: '10:30',
    duration: '14h 30m',
    price: 940,
    rating: 3.6,
    reviewCount: 42,
    seatsAvailable: 6
  },
  {
    id: 8,
    name: 'Orange Travels',
    date: '2024-04-27',
    type: 'Non-AC Seater',
    seatLayoutType: 'seater',
    seatLayoutId: 'seater-37',
    departureTime: '07:30',
    arrivalTime: '20:45',
    duration: '13h 15m',
    price: 575,
    rating: 3.9,
    reviewCount: 77,
    seatsAvailable: 37
  },
  {
    id: 9,
    name: 'Nayak Travels',
    date: '2024-04-27',
    type: 'Electric AC Sleeper',
    seatLayoutType: 'sleeper',
    seatLayoutId: 'sleeper-2x1',
    departureTime: '22:30',
    arrivalTime: '09:45',
    duration: '11h 15m',
    price: 1290,
    rating: 4.6,
    reviewCount: 53,
    seatsAvailable: 9
  },
  {
    id: 10,
    name: 'Peddi Travels',
    date: '2024-04-27',
    type: 'AC Sleeper Multi-Axle',
    seatLayoutType: 'sleeper',
    seatLayoutId: 'sleeper-2x1',
    departureTime: '18:30',
    arrivalTime: '07:45',
    duration: '13h 15m',
    price: 1760,
    rating: 4.5,
    reviewCount: 61,
    seatsAvailable: 11
  },
  {
    id: 11,
    name: 'Mixed Deck Express',
    date: '2024-04-28',
    type: 'AC Sleeper (Upper Deck) + Seater (Lower Deck)',
    seatLayoutType: 'mixed',
    seatLayoutId: 'mixed-seater-lower-sleeper-upper',
    departureTime: '18:15',
    arrivalTime: '06:45',
    duration: '12h 30m',
    price: 1350,
    rating: 4.4,
    reviewCount: 24,
    seatsAvailable: 30
  }
];

export const seatLayouts = [
  {
    id: 'seater-37',
    type: 'seater',
    rows: [
      [
        { seatNo: 'S1', status: 'booked', price: 463 },
        { seatNo: 'S2', status: 'available', price: 463, femaleOnly: true },
        null,
        { seatNo: 'S3', status: 'booked', price: 463 },
        { seatNo: 'S4', status: 'booked', price: 463 }
      ],
      [
        { seatNo: 'S5', status: 'booked', price: 463 },
        { seatNo: 'S6', status: 'available', price: 463 },
        null,
        { seatNo: 'S7', status: 'booked', price: 463 },
        { seatNo: 'S8', status: 'booked', price: 463 }
      ],
      [
        { seatNo: 'S9', status: 'booked', price: 463 },
        { seatNo: 'S10', status: 'available', price: 463 },
        null,
        { seatNo: 'S11', status: 'available', price: 463 },
        { seatNo: 'S12', status: 'booked', price: 463 }
      ],
      [
        { seatNo: 'S13', status: 'booked', price: 463 },
        { seatNo: 'S14', status: 'booked', price: 463 },
        null,
        { seatNo: 'S15', status: 'available', price: 463 },
        { seatNo: 'S16', status: 'booked', price: 463 }
      ],
      [
        { seatNo: 'S17', status: 'booked', price: 463 },
        { seatNo: 'S18', status: 'available', price: 463, femaleOnly: true },
        null,
        { seatNo: 'S19', status: 'available', price: 463 },
        { seatNo: 'S20', status: 'booked', price: 463 }
      ],
      [
        { seatNo: 'S21', status: 'booked', price: 463 },
        { seatNo: 'S22', status: 'booked', price: 463 },
        null,
        { seatNo: 'S23', status: 'available', price: 463 },
        { seatNo: 'S24', status: 'booked', price: 463 }
      ],
      [
        { seatNo: 'S25', status: 'available', price: 463 },
        { seatNo: 'S26', status: 'booked', price: 463 },
        null,
        { seatNo: 'S27', status: 'booked', price: 463 },
        { seatNo: 'S28', status: 'booked', price: 463 }
      ],
      [
        { seatNo: 'S29', status: 'booked', price: 463 },
        { seatNo: 'S30', status: 'available', price: 463 },
        null,
        { seatNo: 'S31', status: 'available', price: 463 },
        { seatNo: 'S32', status: 'booked', price: 463 }
      ],
      [
        { seatNo: 'S33', status: 'booked', price: 463 },
        { seatNo: 'S34', status: 'available', price: 463 },
        { seatNo: 'S35', status: 'available', price: 463 },
        { seatNo: 'S36', status: 'booked', price: 463 },
        { seatNo: 'S37', status: 'available', price: 463 }
      ]
    ]
  },
  {
    id: 'sleeper-2x1',
    type: 'sleeper',
    decks: [
      {
        name: 'lower',
        label: 'Lower deck',
        hasSteeringWheel: true,
        rows: [
          [
            { seatNo: 'L1', status: 'available', price: 992, deck: 'lower', femaleOnly: true },
            null,
            { seatNo: 'L2', status: 'booked', price: 992, deck: 'lower' },
            { seatNo: 'L3', status: 'available', price: 992, deck: 'lower' }
          ],
          [
            { seatNo: 'L4', status: 'available', price: 992, deck: 'lower' },
            null,
            { seatNo: 'L5', status: 'booked', price: 992, deck: 'lower' },
            { seatNo: 'L6', status: 'available', price: 992, deck: 'lower' }
          ],
          [
            { seatNo: 'L7', status: 'available', price: 992, deck: 'lower' },
            null,
            { seatNo: 'L8', status: 'available', price: 992, deck: 'lower' },
            { seatNo: 'L9', status: 'available', price: 992, deck: 'lower' }
          ],
          [
            { seatNo: 'L10', status: 'booked', price: 992, deck: 'lower' },
            null,
            { seatNo: 'L11', status: 'available', price: 992, deck: 'lower' },
            { seatNo: 'L12', status: 'available', price: 992, deck: 'lower' }
          ],
          [
            { seatNo: 'L13', status: 'available', price: 992, deck: 'lower' },
            null,
            { seatNo: 'L14', status: 'available', price: 992, deck: 'lower' },
            { seatNo: 'L15', status: 'available', price: 992, deck: 'lower' }
          ]
        ]
      },
      {
        name: 'upper',
        label: 'Upper deck',
        rows: [
          [
            { seatNo: 'U1', status: 'available', price: 992, deck: 'upper', femaleOnly: true },
            null,
            { seatNo: 'U2', status: 'booked', price: 992, deck: 'upper' },
            { seatNo: 'U3', status: 'available', price: 992, deck: 'upper' }
          ],
          [
            { seatNo: 'U4', status: 'available', price: 992, deck: 'upper' },
            null,
            { seatNo: 'U5', status: 'available', price: 992, deck: 'upper' },
            { seatNo: 'U6', status: 'available', price: 992, deck: 'upper' }
          ],
          [
            { seatNo: 'U7', status: 'available', price: 992, deck: 'upper' },
            null,
            { seatNo: 'U8', status: 'available', price: 992, deck: 'upper' },
            { seatNo: 'U9', status: 'booked', price: 992, deck: 'upper' }
          ],
          [
            { seatNo: 'U10', status: 'available', price: 992, deck: 'upper' },
            null,
            { seatNo: 'U11', status: 'available', price: 992, deck: 'upper' },
            { seatNo: 'U12', status: 'available', price: 992, deck: 'upper' }
          ],
          [
            { seatNo: 'U13', status: 'booked', price: 992, deck: 'upper' },
            null,
            { seatNo: 'U14', status: 'available', price: 992, deck: 'upper' },
            { seatNo: 'U15', status: 'available', price: 992, deck: 'upper' }
          ]
        ]
      }
    ]
  },
  {
    id: 'mixed-seater-lower-sleeper-upper',
    type: 'mixed',
    decks: [
      {
        name: 'lower',
        label: 'Lower deck',
        hasSteeringWheel: true,
        layoutType: 'seater',
        rows: [
          [
            { seatNo: 'L1', status: 'available', price: 1350, deck: 'lower' },
            null,
            { seatNo: 'L2', status: 'available', price: 1350, deck: 'lower', femaleOnly: true },
            { seatNo: 'L3', status: 'booked', price: 1350, deck: 'lower' }
          ],
          [
            { seatNo: 'L4', status: 'available', price: 1350, deck: 'lower' },
            null,
            { seatNo: 'L5', status: 'booked', price: 1350, deck: 'lower' },
            { seatNo: 'L6', status: 'available', price: 1350, deck: 'lower' }
          ],
          [
            { seatNo: 'L7', status: 'available', price: 1350, deck: 'lower' },
            null,
            { seatNo: 'L8', status: 'available', price: 1350, deck: 'lower' },
            { seatNo: 'L9', status: 'available', price: 1350, deck: 'lower' }
          ],
          [
            { seatNo: 'L10', status: 'booked', price: 1350, deck: 'lower' },
            null,
            { seatNo: 'L11', status: 'available', price: 1350, deck: 'lower' },
            { seatNo: 'L12', status: 'available', price: 1350, deck: 'lower' }
          ],
          [
            { seatNo: 'L13', status: 'available', price: 1350, deck: 'lower' },
            null,
            { seatNo: 'L14', status: 'available', price: 1350, deck: 'lower' },
            { seatNo: 'L15', status: 'booked', price: 1350, deck: 'lower' }
          ]
          ,
          [
            { seatNo: 'L16', status: 'available', price: 1350, deck: 'lower' },
            null,
            { seatNo: 'L17', status: 'available', price: 1350, deck: 'lower' },
            { seatNo: 'L18', status: 'booked', price: 1350, deck: 'lower' }
          ],
          [
            { seatNo: 'L19', status: 'available', price: 1350, deck: 'lower' },
            null,
            { seatNo: 'L20', status: 'booked', price: 1350, deck: 'lower' },
            { seatNo: 'L21', status: 'booked', price: 1350, deck: 'lower' }
          ],
          [
            { seatNo: 'L22', status: 'booked', price: 1350, deck: 'lower' },
            null,
            { seatNo: 'L23', status: 'available', price: 1350, deck: 'lower' },
            { seatNo: 'L24', status: 'booked', price: 1350, deck: 'lower' }
          ]
        ]
      },
      {
        name: 'upper',
        label: 'Upper deck',
        layoutType: 'sleeper',
        rows: [
          [
            { seatNo: 'U1', status: 'available', price: 1350, deck: 'upper', femaleOnly: true },
            null,
            { seatNo: 'U2', status: 'booked', price: 1350, deck: 'upper' },
            { seatNo: 'U3', status: 'available', price: 1350, deck: 'upper' }
          ],
          [
            { seatNo: 'U4', status: 'available', price: 1350, deck: 'upper' },
            null,
            { seatNo: 'U5', status: 'available', price: 1350, deck: 'upper' },
            { seatNo: 'U6', status: 'booked', price: 1350, deck: 'upper' }
          ],
          [
            { seatNo: 'U7', status: 'available', price: 1350, deck: 'upper' },
            null,
            { seatNo: 'U8', status: 'available', price: 1350, deck: 'upper' },
            { seatNo: 'U9', status: 'available', price: 1350, deck: 'upper' }
          ],
          [
            { seatNo: 'U10', status: 'booked', price: 1350, deck: 'upper' },
            null,
            { seatNo: 'U11', status: 'available', price: 1350, deck: 'upper' },
            { seatNo: 'U12', status: 'available', price: 1350, deck: 'upper' }
          ],
          [
            { seatNo: 'U13', status: 'available', price: 1350, deck: 'upper' },
            null,
            { seatNo: 'U14', status: 'available', price: 1350, deck: 'upper' },
            { seatNo: 'U15', status: 'booked', price: 1350, deck: 'upper' }
          ]
        ]
      }
    ]
  }
];
