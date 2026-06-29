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
          ],
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
