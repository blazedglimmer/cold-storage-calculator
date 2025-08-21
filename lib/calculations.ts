export interface ProductSpecs {
  humidity: number;
  moisture: number;
  preChilling: 'Yes' | 'No';
  dryCondition: 'Yes' | 'No';
  shelfChilled: string;
  shelfFrozen: string;
}

export interface CalculationResult extends ProductSpecs {
  acRequired: number;
  volume: number;
  power24hrs: number;
  powerPerHour: number;
  units24hrs: number;
}

// Product specifications by category
export const productDatabase: Record<string, ProductSpecs> = {
  fruits: {
    humidity: 85,
    moisture: 12,
    preChilling: 'Yes',
    dryCondition: 'No',
    shelfChilled: '7-14 days',
    shelfFrozen: '6-12 months',
  },
  vegetables: {
    humidity: 90,
    moisture: 15,
    preChilling: 'Yes',
    dryCondition: 'No',
    shelfChilled: '5-10 days',
    shelfFrozen: '8-10 months',
  },
  meat: {
    humidity: 75,
    moisture: 8,
    preChilling: 'Yes',
    dryCondition: 'No',
    shelfChilled: '3-5 days',
    shelfFrozen: '6-9 months',
  },
  fish: {
    humidity: 95,
    moisture: 10,
    preChilling: 'Yes',
    dryCondition: 'No',
    shelfChilled: '2-3 days',
    shelfFrozen: '3-6 months',
  },
  dairy: {
    humidity: 80,
    moisture: 5,
    preChilling: 'No',
    dryCondition: 'No',
    shelfChilled: '7-14 days',
    shelfFrozen: '3-4 months',
  },
  grains: {
    humidity: 60,
    moisture: 3,
    preChilling: 'No',
    dryCondition: 'Yes',
    shelfChilled: '30-60 days',
    shelfFrozen: '12-24 months',
  },
  default: {
    humidity: 80,
    moisture: 10,
    preChilling: 'Yes',
    dryCondition: 'No',
    shelfChilled: '7-10 days',
    shelfFrozen: '6-8 months',
  },
};

/**
 * Calculate AC tonnage required based on temperature and weight
 * Formula: TR = (Weight * Temperature Factor * Load Factor) / 3517
 * Where 3517 is the conversion factor from BTU/hr to TR
 */
function calculateACTonnage(weight: number, temperature: number): number {
  // Base load factor per kg (BTU/hr per kg)
  let loadFactor = 50; // Base load for chilled storage

  // Adjust load factor based on temperature
  if (temperature <= -25) {
    loadFactor = 120; // Deep frozen
  } else if (temperature <= -18) {
    loadFactor = 100; // Frozen
  } else if (temperature <= 0) {
    loadFactor = 80; // Near freezing
  } else if (temperature <= 4) {
    loadFactor = 60; // Chilled
  }

  // Additional factors
  const safetyFactor = 1.2; // 20% safety margin
  const infiltrationFactor = 1.15; // 15% for air infiltration

  const totalLoad = weight * loadFactor * safetyFactor * infiltrationFactor;
  const tonnage = totalLoad / 3517; // Convert BTU/hr to TR

  return Math.round(tonnage * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate power consumption based on AC tonnage and COP
 * Formula: Power (kW) = TR * 3.517 / COP
 */
function calculatePowerConsumption(
  tonnage: number,
  temperature: number
): number {
  // COP (Coefficient of Performance) varies significantly with temperature
  // Based on real-world refrigeration system performance data
  let cop: number;

  if (temperature <= -30) {
    cop = 1.8; // Ultra-low temperature freezing
  } else if (temperature <= -25) {
    cop = 2.0; // Deep frozen storage
  } else if (temperature <= -20) {
    cop = 2.3; // Standard frozen storage
  } else if (temperature <= -15) {
    cop = 2.6; // Medium frozen storage
  } else if (temperature <= -10) {
    cop = 2.9; // Light frozen storage
  } else if (temperature <= -5) {
    cop = 3.2; // Near freezing point
  } else if (temperature <= 0) {
    cop = 3.5; // Just above freezing
  } else if (temperature <= 2) {
    cop = 3.8; // Very cold chilled
  } else if (temperature <= 4) {
    cop = 4.0; // Standard chilled storage
  } else if (temperature <= 8) {
    cop = 4.2; // Cool storage
  } else if (temperature <= 12) {
    cop = 4.4; // Mild cool storage
  } else if (temperature <= 16) {
    cop = 4.6; // Moderate temperature
  } else {
    cop = 4.8; // Room temperature cooling
  }

  // Power in kW = TR * 3.517 / COP
  const powerKW = (tonnage * 3.517) / cop;

  return Math.round(powerKW * 100) / 100;
}

export function calculateValues(
  category: string,
  weight: number,
  temperature: number,
  density: number
): CalculationResult {
  const specs = productDatabase[category] || productDatabase.default;

  // Calculate AC tonnage required
  const acRequired = calculateACTonnage(weight, temperature);

  // Calculate volume
  const volume = Math.round((weight / density) * 100) / 100;

  // Calculate power consumption
  const powerPerHour = calculatePowerConsumption(acRequired, temperature);
  const power24hrs = Math.round(powerPerHour * 24 * 100) / 100;

  return {
    ...specs,
    acRequired,
    volume,
    power24hrs,
    powerPerHour,
    units24hrs: power24hrs,
  };
}
