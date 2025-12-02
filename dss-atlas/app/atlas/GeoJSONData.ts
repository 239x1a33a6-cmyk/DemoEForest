// GeoJSON data for tribal areas and administrative boundaries
export interface TribalBoundary {
  id: string;
  name: string;
  state: string;
  district: string;
  village: string;
  tribalGroup: string;
  coordinates: number[][][]; // Multi-polygon coordinates
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export interface AdministrativeBoundary {
  id: string;
  name: string;
  type: 'state' | 'district' | 'village';
  coordinates: number[][][];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

// Tribal area boundaries data
export const tribalBoundaries: TribalBoundary[] = [
  // Koya tribe areas in Telangana
  {
    id: 'koya-aswapuram',
    name: 'Koya Tribal Area - Aswapuram',
    state: 'Telangana',
    district: 'Bhadradri Kothagudem',
    village: 'Aswapuram',
    tribalGroup: 'Koya',
    coordinates: [
      [
        [80.5200, 17.2400],
        [80.5400, 17.2400],
        [80.5400, 17.2200],
        [80.5200, 17.2200],
        [80.5200, 17.2400]
      ]
    ],
    bounds: {
      north: 17.2400,
      south: 17.2200,
      east: 80.5400,
      west: 80.5200
    },
    center: { lat: 17.2300, lng: 80.5300 },
    zoom: 15
  },
  {
    id: 'koya-kothagudem',
    name: 'Koya Tribal Area - Kothagudem',
    state: 'Telangana',
    district: 'Bhadradri Kothagudem',
    village: 'Kothagudem',
    tribalGroup: 'Koya',
    coordinates: [
      [
        [80.6100, 17.5500],
        [80.6300, 17.5500],
        [80.6300, 17.5300],
        [80.6100, 17.5300],
        [80.6100, 17.5500]
      ]
    ],
    bounds: {
      north: 17.5500,
      south: 17.5300,
      east: 80.6300,
      west: 80.6100
    },
    center: { lat: 17.5400, lng: 80.6200 },
    zoom: 15
  },
  {
    id: 'koya-bhadrachalam',
    name: 'Koya Tribal Area - Bhadrachalam',
    state: 'Telangana',
    district: 'Bhadradri Kothagudem',
    village: 'Bhadrachalam',
    tribalGroup: 'Koya',
    coordinates: [
      [
        [80.8800, 17.6700],
        [80.9000, 17.6700],
        [80.9000, 17.6500],
        [80.8800, 17.6500],
        [80.8800, 17.6700]
      ]
    ],
    bounds: {
      north: 17.6700,
      south: 17.6500,
      east: 80.9000,
      west: 80.8800
    },
    center: { lat: 17.6600, lng: 80.8900 },
    zoom: 15
  },

  // Gond tribe areas in Madhya Pradesh
  {
    id: 'gond-amarpur',
    name: 'Gond Tribal Area - Amarpur',
    state: 'Madhya Pradesh',
    district: 'Dindori',
    village: 'Amarpur',
    tribalGroup: 'Gond',
    coordinates: [
      [
        [81.0900, 22.9200],
        [81.1100, 22.9200],
        [81.1100, 22.9000],
        [81.0900, 22.9000],
        [81.0900, 22.9200]
      ]
    ],
    bounds: {
      north: 22.9200,
      south: 22.9000,
      east: 81.1100,
      west: 81.0900
    },
    center: { lat: 22.9100, lng: 81.1000 },
    zoom: 15
  },

  // Munda tribe areas in Jharkhand
  {
    id: 'munda-angara',
    name: 'Munda Tribal Area - Angara',
    state: 'Jharkhand',
    district: 'Ranchi',
    village: 'Angara',
    tribalGroup: 'Munda',
    coordinates: [
      [
        [85.1100, 23.3800],
        [85.1300, 23.3800],
        [85.1300, 23.3600],
        [85.1100, 23.3600],
        [85.1100, 23.3800]
      ]
    ],
    bounds: {
      north: 23.3800,
      south: 23.3600,
      east: 85.1300,
      west: 85.1100
    },
    center: { lat: 23.3700, lng: 85.1200 },
    zoom: 15
  },
  {
    id: 'munda-bero',
    name: 'Munda Tribal Area - Bero',
    state: 'Jharkhand',
    district: 'Ranchi',
    village: 'Bero',
    tribalGroup: 'Munda',
    coordinates: [
      [
        [85.4100, 23.2800],
        [85.4300, 23.2800],
        [85.4300, 23.2600],
        [85.4100, 23.2600],
        [85.4100, 23.2800]
      ]
    ],
    bounds: {
      north: 23.2800,
      south: 23.2600,
      east: 85.4300,
      west: 85.4100
    },
    center: { lat: 23.2700, lng: 85.4200 },
    zoom: 15
  },

  // Santhal tribe areas in Odisha
  {
    id: 'santhal-baripada',
    name: 'Santhal Tribal Area - Baripada',
    state: 'Odisha',
    district: 'Mayurbhanj',
    village: 'Baripada',
    tribalGroup: 'Santhal',
    coordinates: [
      [
        [86.7200, 21.9300],
        [86.7400, 21.9300],
        [86.7400, 21.9100],
        [86.7200, 21.9100],
        [86.7200, 21.9300]
      ]
    ],
    bounds: {
      north: 21.9300,
      south: 21.9100,
      east: 86.7400,
      west: 86.7200
    },
    center: { lat: 21.9200, lng: 86.7300 },
    zoom: 15
  },

  // Tripuri tribe areas in Tripura
  {
    id: 'tripuri-agartala',
    name: 'Tripuri Tribal Area - Agartala',
    state: 'Tripura',
    district: 'West Tripura',
    village: 'Agartala',
    tribalGroup: 'Tripuri',
    coordinates: [
      [
        [91.2800, 23.8300],
        [91.3000, 23.8300],
        [91.3000, 23.8100],
        [91.2800, 23.8100],
        [91.2800, 23.8300]
      ]
    ],
    bounds: {
      north: 23.8300,
      south: 23.8100,
      east: 91.3000,
      west: 91.2800
    },
    center: { lat: 23.8200, lng: 91.2900 },
    zoom: 15
  }
];

// Administrative boundaries data
export const administrativeBoundaries: AdministrativeBoundary[] = [
  // States
  {
    id: 'telangana-state',
    name: 'Telangana',
    type: 'state',
    coordinates: [
      [
        [77.0, 19.9],
        [81.1, 19.9],
        [81.1, 15.6],
        [77.0, 15.6],
        [77.0, 19.9]
      ]
    ],
    bounds: {
      north: 19.9,
      south: 15.6,
      east: 81.1,
      west: 77.0
    },
    center: { lat: 18.1124, lng: 79.0193 },
    zoom: 7
  },
  {
    id: 'jharkhand-state',
    name: 'Jharkhand',
    type: 'state',
    coordinates: [
      [
        [83.0, 25.5],
        [88.0, 25.5],
        [88.0, 21.5],
        [83.0, 21.5],
        [83.0, 25.5]
      ]
    ],
    bounds: {
      north: 25.5,
      south: 21.5,
      east: 88.0,
      west: 83.0
    },
    center: { lat: 23.6102, lng: 85.2799 },
    zoom: 7
  },
  {
    id: 'madhyapradesh-state',
    name: 'Madhya Pradesh',
    type: 'state',
    coordinates: [
      [
        [74.0, 26.9],
        [82.8, 26.9],
        [82.8, 21.0],
        [74.0, 21.0],
        [74.0, 26.9]
      ]
    ],
    bounds: {
      north: 26.9,
      south: 21.0,
      east: 82.8,
      west: 74.0
    },
    center: { lat: 22.9734, lng: 78.6569 },
    zoom: 6
  },
  {
    id: 'odisha-state',
    name: 'Odisha',
    type: 'state',
    coordinates: [
      [
        [81.0, 22.5],
        [87.5, 22.5],
        [87.5, 17.8],
        [81.0, 17.8],
        [81.0, 22.5]
      ]
    ],
    bounds: {
      north: 22.5,
      south: 17.8,
      east: 87.5,
      west: 81.0
    },
    center: { lat: 20.9517, lng: 85.0985 },
    zoom: 7
  },
  {
    id: 'tripura-state',
    name: 'Tripura',
    type: 'state',
    coordinates: [
      [
        [91.1, 24.5],
        [92.3, 24.5],
        [92.3, 22.9],
        [91.1, 22.9],
        [91.1, 24.5]
      ]
    ],
    bounds: {
      north: 24.5,
      south: 22.9,
      east: 92.3,
      west: 91.1
    },
    center: { lat: 23.9408, lng: 91.9882 },
    zoom: 8
  },

  // Districts
  {
    id: 'bhadradri-kothagudem-district',
    name: 'Bhadradri Kothagudem',
    type: 'district',
    coordinates: [
      [
        [79.5, 18.2],
        [81.5, 18.2],
        [81.5, 17.0],
        [79.5, 17.0],
        [79.5, 18.2]
      ]
    ],
    bounds: {
      north: 18.2,
      south: 17.0,
      east: 81.5,
      west: 79.5
    },
    center: { lat: 17.5500, lng: 80.6167 },
    zoom: 10
  },
  {
    id: 'ranchi-district',
    name: 'Ranchi',
    type: 'district',
    coordinates: [
      [
        [84.8, 23.8],
        [85.8, 23.8],
        [85.8, 22.9],
        [84.8, 22.9],
        [84.8, 23.8]
      ]
    ],
    bounds: {
      north: 23.8,
      south: 22.9,
      east: 85.8,
      west: 84.8
    },
    center: { lat: 23.3441, lng: 85.3096 },
    zoom: 10
  },
  {
    id: 'dindori-district',
    name: 'Dindori',
    type: 'district',
    coordinates: [
      [
        [80.8, 23.2],
        [81.4, 23.2],
        [81.4, 22.6],
        [80.8, 22.6],
        [80.8, 23.2]
      ]
    ],
    bounds: {
      north: 23.2,
      south: 22.6,
      east: 81.4,
      west: 80.8
    },
    center: { lat: 22.9417, lng: 81.0833 },
    zoom: 10
  },
  {
    id: 'mayurbhanj-district',
    name: 'Mayurbhanj',
    type: 'district',
    coordinates: [
      [
        [86.2, 22.2],
        [87.0, 22.2],
        [87.0, 21.6],
        [86.2, 21.6],
        [86.2, 22.2]
      ]
    ],
    bounds: {
      north: 22.2,
      south: 21.6,
      east: 87.0,
      west: 86.2
    },
    center: { lat: 21.9287, lng: 86.7350 },
    zoom: 10
  },
  {
    id: 'west-tripura-district',
    name: 'West Tripura',
    type: 'district',
    coordinates: [
      [
        [91.0, 24.0],
        [91.6, 24.0],
        [91.6, 23.6],
        [91.0, 23.6],
        [91.0, 24.0]
      ]
    ],
    bounds: {
      north: 24.0,
      south: 23.6,
      east: 91.6,
      west: 91.0
    },
    center: { lat: 23.8315, lng: 91.2868 },
    zoom: 10
  },

  // Villages
  {
    id: 'aswapuram-village',
    name: 'Aswapuram',
    type: 'village',
    coordinates: [
      [
        [80.5100, 17.2500],
        [80.5500, 17.2500],
        [80.5500, 17.2100],
        [80.5100, 17.2100],
        [80.5100, 17.2500]
      ]
    ],
    bounds: {
      north: 17.2500,
      south: 17.2100,
      east: 80.5500,
      west: 80.5100
    },
    center: { lat: 17.2300, lng: 80.5300 },
    zoom: 14
  },
  {
    id: 'kothagudem-village',
    name: 'Kothagudem',
    type: 'village',
    coordinates: [
      [
        [80.6000, 17.5600],
        [80.6400, 17.5600],
        [80.6400, 17.5200],
        [80.6000, 17.5200],
        [80.6000, 17.5600]
      ]
    ],
    bounds: {
      north: 17.5600,
      south: 17.5200,
      east: 80.6400,
      west: 80.6000
    },
    center: { lat: 17.5400, lng: 80.6200 },
    zoom: 14
  },
  {
    id: 'bhadrachalam-village',
    name: 'Bhadrachalam',
    type: 'village',
    coordinates: [
      [
        [80.8700, 17.6800],
        [80.9100, 17.6800],
        [80.9100, 17.6400],
        [80.8700, 17.6400],
        [80.8700, 17.6800]
      ]
    ],
    bounds: {
      north: 17.6800,
      south: 17.6400,
      east: 80.9100,
      west: 80.8700
    },
    center: { lat: 17.6600, lng: 80.8900 },
    zoom: 14
  },
  {
    id: 'angara-village',
    name: 'Angara',
    type: 'village',
    coordinates: [
      [
        [85.1000, 23.3900],
        [85.1400, 23.3900],
        [85.1400, 23.3500],
        [85.1000, 23.3500],
        [85.1000, 23.3900]
      ]
    ],
    bounds: {
      north: 23.3900,
      south: 23.3500,
      east: 85.1400,
      west: 85.1000
    },
    center: { lat: 23.3700, lng: 85.1200 },
    zoom: 14
  },
  {
    id: 'bero-village',
    name: 'Bero',
    type: 'village',
    coordinates: [
      [
        [85.4000, 23.2900],
        [85.4400, 23.2900],
        [85.4400, 23.2500],
        [85.4000, 23.2500],
        [85.4000, 23.2900]
      ]
    ],
    bounds: {
      north: 23.2900,
      south: 23.2500,
      east: 85.4400,
      west: 85.4000
    },
    center: { lat: 23.2700, lng: 85.4200 },
    zoom: 14
  },
  {
    id: 'amarpur-village',
    name: 'Amarpur',
    type: 'village',
    coordinates: [
      [
        [81.0800, 22.9300],
        [81.1200, 22.9300],
        [81.1200, 22.8900],
        [81.0800, 22.8900],
        [81.0800, 22.9300]
      ]
    ],
    bounds: {
      north: 22.9300,
      south: 22.8900,
      east: 81.1200,
      west: 81.0800
    },
    center: { lat: 22.9100, lng: 81.1000 },
    zoom: 14
  },
  {
    id: 'baripada-village',
    name: 'Baripada',
    type: 'village',
    coordinates: [
      [
        [86.7100, 21.9400],
        [86.7500, 21.9400],
        [86.7500, 21.9000],
        [86.7100, 21.9000],
        [86.7100, 21.9400]
      ]
    ],
    bounds: {
      north: 21.9400,
      south: 21.9000,
      east: 86.7500,
      west: 86.7100
    },
    center: { lat: 21.9200, lng: 86.7300 },
    zoom: 14
  },
  {
    id: 'agartala-village',
    name: 'Agartala',
    type: 'village',
    coordinates: [
      [
        [91.2700, 23.8400],
        [91.3100, 23.8400],
        [91.3100, 23.8000],
        [91.2700, 23.8000],
        [91.2700, 23.8400]
      ]
    ],
    bounds: {
      north: 23.8400,
      south: 23.8000,
      east: 91.3100,
      west: 91.2700
    },
    center: { lat: 23.8200, lng: 91.2900 },
    zoom: 14
  }
];

// Helper functions
export const getTribalBoundary = (
  state: string,
  district: string,
  village: string,
  tribalGroup: string
): TribalBoundary | null => {
  return tribalBoundaries.find(
    boundary =>
      boundary.state.toLowerCase() === state.toLowerCase() &&
      boundary.district.toLowerCase() === district.toLowerCase() &&
      boundary.village.toLowerCase() === village.toLowerCase() &&
      boundary.tribalGroup.toLowerCase() === tribalGroup.toLowerCase()
  ) || null;
};

export const getAdministrativeBoundary = (
  type: 'state' | 'district' | 'village',
  name: string
): AdministrativeBoundary | null => {
  return administrativeBoundaries.find(
    boundary =>
      boundary.type === type &&
      boundary.name.toLowerCase() === name.toLowerCase()
  ) || null;
};

export const getAllTribalBoundariesForLocation = (
  state: string,
  district?: string,
  village?: string
): TribalBoundary[] => {
  return tribalBoundaries.filter(boundary => {
    const stateMatch = boundary.state.toLowerCase() === state.toLowerCase();
    const districtMatch = !district || boundary.district.toLowerCase() === district.toLowerCase();
    const villageMatch = !village || boundary.village.toLowerCase() === village.toLowerCase();
    
    return stateMatch && districtMatch && villageMatch;
  });
};

export const getTribalGroupsForLocation = (
  state: string,
  district?: string,
  village?: string
): string[] => {
  const boundaries = getAllTribalBoundariesForLocation(state, district, village);
  return [...new Set(boundaries.map(boundary => boundary.tribalGroup))];
};
