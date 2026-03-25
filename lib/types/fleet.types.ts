export interface FleetTableRow {
    _id: string;
    name: string;
    image: string;
    description?: string;
    passengers: number;
    suitcases: number;
    timePeriod?: string;
    carType?: string;
    isActive: boolean;
    allowRequestQuote: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface FleetListResponse {
    success: boolean;
    data: FleetTableRow[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface FleetResponse {
    success: boolean;
    data: FleetTableRow;
}
