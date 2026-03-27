"use client";

import React from "react";
import { Download, Loader, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useGetBooking, useDownloadBookingReceipt } from "@/hooks/use-booking";
import { formatDashboardPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

function BookingDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const { data: response, isLoading, isError } = useGetBooking(id);
    const booking = response?.data;
    
    const { mutateAsync: downloadReceipt, isPending: isDownloadingReceipt } = useDownloadBookingReceipt();

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader className="animate-spin text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">Loading Booking Details</h2>
                    <p className="text-muted-foreground">Please wait while we fetch the information...</p>
                </div>
            </div>
        );
    }

    if (isError || !booking) {
        return (
            <div className="min-h-[400px] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Booking</h2>
                    <p className="text-muted-foreground">The requested booking could not be found or an error occurred.</p>
                    <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const stops = booking.tripDetails.stops?.filter((s) => s.address?.trim()) ?? [];
    const allLocations = [
        booking.tripDetails.pickupAddress,
        ...stops.map((s) => s.address),
        booking.tripDetails.deliveryAddress,
    ].filter(Boolean);

    const totalAmount = booking.amount || 0;
    const outboundChildSeatCount = booking.tripDetails.childSeats?.reduce(
        (total: number, seat: any) => total + (Number(seat.quantity) || 0),
        0
    ) || 0;
    const returnChildSeatCount = booking.tripDetails.returnChildSeats?.reduce(
        (total: number, seat: any) => total + (Number(seat.quantity) || 0),
        0
    ) || 0;
    const childSeatCount = outboundChildSeatCount + returnChildSeatCount;
    const pricing = booking.pricingBreakdown;

    const mergedGratuityAmount =
        (pricing?.vehicle?.oneWay?.gratuityAmount || 0) +
        (pricing?.vehicle?.return?.isSelected ? (pricing?.vehicle?.return?.gratuityAmount || 0) : 0);
    const mergedTaxAmount =
        (pricing?.vehicle?.oneWay?.taxAmount || 0) +
        (pricing?.vehicle?.return?.isSelected ? (pricing?.vehicle?.return?.taxAmount || 0) : 0);
    const mergedBasePriceAmount =
        (pricing?.vehicle?.oneWay?.basePrice || 0) +
        (pricing?.vehicle?.return?.isSelected ? (pricing?.vehicle?.return?.basePrice || 0) : 0);
    const mergedDiscountAmount =
        (pricing?.vehicle?.oneWay?.displayDiscountAmount || 0) +
        (pricing?.vehicle?.return?.isSelected ? (pricing?.vehicle?.return?.discountAmount || 0) : 0);

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Bookings
                </Button>
                <div className="flex items-center gap-3">
                    <Badge variant="soft" color={booking.status === 'confirmed' ? 'success' : 'secondary'} className="h-8 px-4 text-sm font-bold capitalize">
                        {booking.status}
                    </Badge>
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await downloadReceipt(booking._id);
                            } catch {
                                toast.error("Unable to download receipt. Please try again.");
                            }
                        }}
                        disabled={isDownloadingReceipt}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 text-xs font-semibold rounded-md inline-flex items-center justify-center gap-2 disabled:opacity-60 transition-colors whitespace-nowrap"
                    >
                        <Download size={14} />
                        {isDownloadingReceipt ? "Downloading..." : "Download Receipt"}
                    </button>
                </div>
            </div>

            <header className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-4 px-6 py-5">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Detailed View</p>
                        <h1 className="text-2xl font-bold tracking-tight">Booking Info</h1>
                    </div>
                    <div className="bg-muted/50 border border-border rounded-xl px-5 py-3 text-right">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Booking Number</p>
                        <p className="text-lg font-mono font-bold">{booking.bookingNumber || booking._id}</p>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Route Section */}
                <section className="md:col-span-12 bg-card rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full" /> Route Details
                    </h2>
                    <div className="space-y-4">
                        {allLocations.map((location, index) => (
                            <div key={`${location}-${index}`} className="flex items-start gap-4">
                                <div className="flex flex-col items-center gap-1 mt-1">
                                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary' : index === allLocations.length - 1 ? 'bg-success' : 'bg-muted-foreground'}`} />
                                    {index !== allLocations.length - 1 && <div className="w-0.5 h-8 bg-border" />}
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                        {index === 0 ? "Pickup" : index === allLocations.length - 1 ? "Drop-off" : `Stop ${index}`}
                                    </p>
                                    <p className="text-sm font-medium">{location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Info Cards */}
                <div className="md:col-span-4 bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                    <h3 className="text-lg font-bold border-b pb-2">Passenger</h3>
                    <InfoField label="Name" value={booking.passengerDetails.fullName} />
                    <InfoField label="Email" value={booking.passengerDetails.email} />
                    <InfoField label="Phone" value={booking.passengerDetails.phone} />
                    <InfoField label="State" value={booking.passengerDetails.state} />
                </div>

                <div className="md:col-span-4 bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                    <h3 className="text-lg font-bold border-b pb-2">Trip Info</h3>
                    <InfoField label="Category" value={booking.category} />
                    <InfoField label="Pickup Date" value={booking.tripDetails.pickupDate} />
                    <InfoField label="Pickup Time" value={booking.tripDetails.pickupTime} />
                    <InfoField label="Passengers" value={String(booking.tripDetails.passengers || 0)} />
                    <InfoField label="Bags" value={String(booking.tripDetails.bags || 0)} />
                    <InfoField label="Distance" value={`${booking.tripDetails.distanceMiles || 0} miles`} />
                </div>

                <div className="md:col-span-4 bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                    <h3 className="text-lg font-bold border-b pb-2">Extras & Status</h3>
                    <InfoField label="Airport Pickup" value={booking.tripDetails.isAirportPickup ? "Yes" : "No"} />
                    <InfoField label="Meet & Greet" value={booking.tripDetails.isMeetGreet ? "Yes" : "No"} />
                    <InfoField label="Return M&G" value={booking.tripDetails.isReturnMeetGreet ? "Yes" : "No"} />
                    <InfoField label="Child Seats" value={String(childSeatCount)} />
                    <InfoField label="Payment" value={booking.paymentStatus} />
                    <InfoField label="Booking" value={booking.status} />
                </div>

                {/* Instructions Section */}
                {booking.tripDetails.instructions && (
                    <section className="md:col-span-12 bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-3">Special Instructions</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border border-border/50 italic">
                            "{booking.tripDetails.instructions}"
                        </p>
                    </section>
                )}

                {/* Vehicle Section */}
                {booking.vehicle && (
                    <section className="md:col-span-12 bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                             <span className="w-1.5 h-6 bg-primary rounded-full" /> Assigned Vehicle
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <InfoField label="Model" value={(booking.vehicle as any).name || "N/A"} />
                            <InfoField label="Passenger Limit" value={`${(booking.vehicle as any).passengers || 0} Users`} />
                            <InfoField label="Luggage Limit" value={`${(booking.vehicle as any).suitcases || 0} Bags`} />
                            <InfoField label="Time Period" value={(booking.vehicle as any).timePeriod || "Default Chauffeur"} />
                        </div>
                    </section>
                )}

                {/* Pricing Section */}
                <section className="md:col-span-12 bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full" /> Financial Breakdown
                    </h3>

                    {pricing ? (
                        <div className="space-y-3">
                            <InfoField
                                label={pricing.vehicle?.return?.isSelected ? "Base Price (Outbound + Return)" : "Base Price"}
                                value={formatDashboardPrice(mergedBasePriceAmount)}
                            />
                            <InfoField
                                label="Discount Applied"
                                value={`- ${formatDashboardPrice(mergedDiscountAmount)}`}
                                isDiscount
                            />
                            <InfoField
                                label="Total Gratuity"
                                value={formatDashboardPrice(mergedGratuityAmount)}
                            />
                            <InfoField
                                label="Total Tax"
                                value={formatDashboardPrice(mergedTaxAmount)}
                            />

                            {pricing.extras?.stops?.total > 0 && (
                                <InfoField
                                    label={`Additional Stops (${pricing.extras.stops.count} x ${formatDashboardPrice(pricing.extras.stops.unitPrice)})`}
                                    value={formatDashboardPrice(pricing.extras.stops.total)}
                                />
                            )}

                            {pricing.extras?.airportPickup?.total > 0 && (
                                <InfoField
                                    label="Airport Pickup Service"
                                    value={formatDashboardPrice(pricing.extras.airportPickup.total)}
                                />
                            )}

                            {pricing.extras?.meetAndGreet?.total > 0 && (
                                <InfoField
                                    label="Meet & Greet (Combined)"
                                    value={formatDashboardPrice(pricing.extras.meetAndGreet.total)}
                                />
                            )}

                            {pricing.extras?.childSeats?.items?.map((item: any, idx: number) => (
                                <InfoField
                                    key={`${item.tripType}-${item.seatId}-${idx}`}
                                    label={`${item.name || "Child Seat"} (${item.tripType === "return" ? "Return" : "One-way"} - ${item.quantity} x ${formatDashboardPrice(item.unitPrice)})`}
                                    value={formatDashboardPrice(item.total)}
                                />
                            ))}

                            <div className="border-t border-border mt-6 pt-4">
                                <InfoField label="Grand Total (Charged)" value={formatDashboardPrice(totalAmount)} strong />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-muted/30 p-8 text-center rounded-lg border border-dashed">
                             <p className="text-muted-foreground italic">Detailed pricing snapshot is not available for this legacy booking.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function InfoField({
    label,
    value,
    strong = false,
    isDiscount = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
    isDiscount?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4 py-1">
            <span className={`text-sm ${isDiscount ? "text-destructive font-semibold" : "text-muted-foreground font-medium"}`}>
                {label}
            </span>
            <span
                className={`text-sm tracking-tight ${strong ? "text-primary font-extrabold text-base" : isDiscount ? "text-destructive font-bold" : "text-foreground font-semibold"}`}
            >
                {value}
            </span>
        </div>
    );
}

export default BookingDetailsPage;
