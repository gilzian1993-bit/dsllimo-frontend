// Payment types matching backend IPayment structure
export interface Payment {
  _id: string;
  bookingId: string | {
    _id: string;
    passengerInfo?: {
      name: string;
      email: string;
      phone: string;
    };
    bookingDetails?: {
      pickUpAddress?: string;
      dropOffAddress?: string;
      vehicleTitle?: string;
      date?: Date | string;
      time?: string;
    };
    orderNumber?: string;
  };
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: number;
  stripeSessionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Frontend-friendly flattened payment structure for table display
export interface PaymentTableRow {
  _id: string;
  transactionId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  booking_id: string;
  booking_order_number?: string;
  pickup_location?: string;
  vehicle_title?: string;
  date_time?: string;
  createdAt: Date | string;
  stripeSessionId?: string;
}

// API Response types
export interface PaymentsResponse {
  success: boolean;
  payments: Payment[];
  total: number;
  page: number;
  pages: number;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

