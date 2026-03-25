export interface Reservation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  date: string;
  pickupTime: string;
  pickupLocation: string;
  destination?: string;
  passengers: number;
  flightNumber?: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface ReservationTableRow extends Reservation {}

export interface ReservationsResponse {
  success: boolean;
  reservations: Reservation[];
  total: number;
  page: number;
  pages: number;
}

export interface ReservationQueryParams {
  page?: number;
  limit?: number;
}
