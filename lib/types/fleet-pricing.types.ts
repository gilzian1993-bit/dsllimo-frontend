// Fleet Pricing types matching backend IFleetPricing structure
export interface FleetPricing {
  _id: string;
  fleetId: string | {
    _id: string;
    name?: string;
  };
  fromMiles: number;
  toMiles: number | null;
  price: number;
  priceType: "fixed" | "per_mile";
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Frontend-friendly flattened fleet pricing structure for table display
export interface FleetPricingTableRow extends FleetPricing {
  fleetName?: string;
  priceDisplay?: string;
}

// Vehicle/Fleet type (imported from vehicle types)
export interface Vehicle {
  _id: string;
  name: string;
  cars?: string;
  passengers: number;
  suitcases: number;
  image: string;
  description?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// API Response types
export interface FleetPricingResponse {
  success: boolean;
  pricingRanges: FleetPricing[];
  total: number;
  page: number;
  pages: number;
  fleet?: Vehicle | null; // Fleet/vehicle details included when fleetId is provided
}

export interface FleetPricingQueryParams {
  page?: number;
  limit?: number;
  fleetId?: string;
  isActive?: boolean;
  search?: string;
}

