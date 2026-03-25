import { api } from "@/config/axios.config";
import { API_ROUTES } from "@/config/routes";

export interface ExpressPayment {
    _id: string;
    bookingId: string | { _id: string; status: string; totalAmount: number; createdAt: string };
    paymentId: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed" | "refunded";
    customerDetails: {
        name: string;
        email: string;
        phone?: string;
    };
    cardLast4?: string;
    paymentMethodType?: string;
    transactionId: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentListResponse {
    success: boolean;
    data: ExpressPayment[];
    meta?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

export const getPayments = async (params?: Record<string, any>): Promise<PaymentListResponse> => {
    const response = await api.get<PaymentListResponse>(`/api/payments`, {
        params,
    });
    return response.data;
};

export const getPaymentDetails = async (id: string): Promise<{ success: boolean; data: ExpressPayment }> => {
    const response = await api.get(`/api/payments/${id}`);
    return response.data;
};

export const deletePayment = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/payments/${id}`);
    return response.data;
};

export const deletePayments = async (ids: string[]): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/api/payments/bulk-delete`, { ids });
    return response.data;
};
