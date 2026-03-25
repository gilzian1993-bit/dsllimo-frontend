export interface Booking {
  _id: string;
  bookingNumber: string;
  category: "one-way" | "hourly";
  customer?: string;
  fleetId?: string | {
    _id: string;
    name?: string;
    cars?: string;
    passengers?: number;
    suitcases?: number;
    image?: string;
    description?: string;
  };
  passengerDetails: {
    fullName: string;
    email: string;
    phone: string;
    state: string;
  };
  tripDetails: {
    pickupAddress: string;
    deliveryAddress: string;
    pickupDate: string;
    pickupTime: string;
    stops?: { address: string }[];
    distanceMiles?: number;
    passengers?: number;
    bags?: number;
    instructions?: string;
    isReturn?: boolean;
    isAirportPickup?: boolean;
    isMeetGreet?: boolean;
    isReturnMeetGreet?: boolean;
    childSeats?: {
      seatId: string;
      quantity: number;
    }[];
  };
  amount: number;
  pricingBreakdown?: Record<string, any>;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type BookingTableRow = Booking;

export interface BookingsResponse {
  success: boolean;
  data: Booking[];
  meta?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    totalPages?: number;
  };
}

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

