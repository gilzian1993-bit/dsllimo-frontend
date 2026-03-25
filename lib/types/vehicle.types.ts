// Vehicle/Fleet types matching backend IFleet structure
export interface Vehicle {
  _id: string;
  name: string;
  cars?: string;
  passengers: number;
  suitcases: number;
  image: string;
  description?: string;
  isActive: boolean;
  position?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Frontend-friendly flattened vehicle structure for table display
export interface VehicleTableRow extends Vehicle {
  // Can add additional computed fields here if needed
}

// API Response types
export interface VehiclesResponse {
  success: boolean;
  fleets: Vehicle[];
  total: number;
  page: number;
  pages: number;
}

export interface VehicleQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

