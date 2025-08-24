// Philippine Regions
export const PHILIPPINE_REGIONS = {
  // Luzon Island Group
  NCR: {
    code: "NCR",
    name: "National Capital Region (NCR)",
    description: "Metro Manila, the country's capital",
    island: "Luzon",
  },
  CAR: {
    code: "CAR",
    name: "Cordillera Administrative Region (CAR)",
    description: "Northern part of Luzon",
    island: "Luzon",
  },
  REGION_I: {
    code: "Region I",
    name: "Ilocos Region",
    description: "Northern Luzon",
    island: "Luzon",
  },
  REGION_II: {
    code: "Region II",
    name: "Cagayan Valley",
    description: "Northeastern Luzon",
    island: "Luzon",
  },
  REGION_III: {
    code: "Region III",
    name: "Central Luzon",
    description: "Central part of Luzon",
    island: "Luzon",
  },
  REGION_IV_A: {
    code: "Region IV-A",
    name: "Calabarzon",
    description: "Southeast Luzon",
    island: "Luzon",
  },
  REGION_IV_B: {
    code: "Region IV-B",
    name: "Mimaropa",
    description: "Southwest Luzon (Mindoro, Marinduque, Romblon, Palawan)",
    island: "Luzon",
  },
  REGION_V: {
    code: "Region V",
    name: "Bicol Region",
    description: "Southern Luzon",
    island: "Luzon",
  },

  // Visayas Island Group
  REGION_VI: {
    code: "Region VI",
    name: "Western Visayas",
    description: "Western part of the Visayas",
    island: "Visayas",
  },
  REGION_VII: {
    code: "Region VII",
    name: "Central Visayas",
    description: "Central part of the Visayas",
    island: "Visayas",
  },
  REGION_VIII: {
    code: "Region VIII",
    name: "Eastern Visayas",
    description: "Eastern part of the Visayas",
    island: "Visayas",
  },

  // Mindanao Island Group
  REGION_IX: {
    code: "Region IX",
    name: "Zamboanga Peninsula",
    description: "Western part of Mindanao",
    island: "Mindanao",
  },
  REGION_X: {
    code: "Region X",
    name: "Northern Mindanao",
    description: "Northern part of Mindanao",
    island: "Mindanao",
  },
  REGION_XI: {
    code: "Region XI",
    name: "Davao Region",
    description: "Southern part of Mindanao",
    island: "Mindanao",
  },
  REGION_XII: {
    code: "Region XII",
    name: "SOCCSKSARGEN",
    description:
      "Central Mindanao (South Cotabato, Cotabato, Sultan Kudarat, Sarangani, and General Santos City)",
    island: "Mindanao",
  },
  REGION_XIII: {
    code: "Region XIII",
    name: "Caraga",
    description: "Northeastern Mindanao",
    island: "Mindanao",
  },
  BARMM: {
    code: "BARMM",
    name: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
    description: "Southern part of Mindanao",
    island: "Mindanao",
  },
} as const;

// Helper arrays for easier usage
export const REGIONS_BY_ISLAND = {
  Luzon: [
    PHILIPPINE_REGIONS.NCR,
    PHILIPPINE_REGIONS.CAR,
    PHILIPPINE_REGIONS.REGION_I,
    PHILIPPINE_REGIONS.REGION_II,
    PHILIPPINE_REGIONS.REGION_III,
    PHILIPPINE_REGIONS.REGION_IV_A,
    PHILIPPINE_REGIONS.REGION_IV_B,
    PHILIPPINE_REGIONS.REGION_V,
  ],
  Visayas: [
    PHILIPPINE_REGIONS.REGION_VI,
    PHILIPPINE_REGIONS.REGION_VII,
    PHILIPPINE_REGIONS.REGION_VIII,
  ],
  Mindanao: [
    PHILIPPINE_REGIONS.REGION_IX,
    PHILIPPINE_REGIONS.REGION_X,
    PHILIPPINE_REGIONS.REGION_XI,
    PHILIPPINE_REGIONS.REGION_XII,
    PHILIPPINE_REGIONS.REGION_XIII,
    PHILIPPINE_REGIONS.BARMM,
  ],
};

export const ALL_REGIONS = Object.values(PHILIPPINE_REGIONS);

export type PhilippineRegion =
  (typeof PHILIPPINE_REGIONS)[keyof typeof PHILIPPINE_REGIONS];
export type RegionCode = PhilippineRegion["code"];
