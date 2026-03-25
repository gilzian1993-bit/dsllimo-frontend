// Hourly Package types matching backend IHourlyPackage structure
export type PackageType = "hourly" | "day" | "week";

export interface HourlyPackage {
  _id: string;
  fleetId: string | {
    _id: string;
    name?: string;
  };
  packageType: PackageType;
  duration: number;
  includedMiles: number;
  price: number;
  extraMileRate: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Frontend-friendly flattened hourly package structure for table display
export interface HourlyPackageTableRow extends HourlyPackage {
  fleetName?: string;
  durationDisplay?: string;
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
export interface HourlyPackageResponse {
  success: boolean;
  packages: HourlyPackage[];
  total: number;
  page: number;
  pages: number;
  fleet?: Vehicle | null; // Fleet/vehicle details included when fleetId is provided
}

export interface HourlyPackageQueryParams {
  page?: number;
  limit?: number;
  fleetId?: string;
  packageType?: PackageType;
  isActive?: boolean;
  search?: string;
}

// Form data for creating/updating hourly packages
export interface HourlyPackageFormData {
  packageType: PackageType;
  duration: number;
  includedMiles: number;
  price: number;
  extraMileRate: number;
  isActive: boolean;
}
