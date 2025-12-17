"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

import { Search, Package, Truck, CheckCircle, MapPin, Loader2, AlertCircle } from "lucide-react";

interface ParcelData {
  trackingId: string;
  status: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  expectedDeliveryTime?: string;
  updatedAt: string;
}

export function TrackingWidget() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parcelData, setParcelData] = useState<ParcelData | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setError(null);
    setParcelData(null);

    try {
      const response = await fetch(`/api/public/parcel/${trackingId.trim()}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Parcel not found. Please check your tracking ID and try again.");
        } else {
          setError("Failed to fetch parcel details. Please try again later.");
        }
        return;
      }

      const data = await response.json();
      setParcelData(data.parcel);
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (parcelData) {
      router.push(`/parcel/${trackingId.trim()}`);
    }
  };

  return (
    <section id="tracking" className="py-12 md:py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Track Your Parcel</h2>
          <p className="text-lg text-muted-foreground">
            Enter your AWB / Tracking ID for real-time updates
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleTrack} className="flex gap-3 mb-6">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter your tracking ID"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !trackingId.trim()}
              className="btn-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Track
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in duration-300">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {parcelData && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <div className="text-sm text-muted-foreground">Tracking ID</div>
                  <div className="font-mono font-semibold">{parcelData.trackingId}</div>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {parcelData.status.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Customer</div>
                  <div className="font-medium">{parcelData.customerName}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Pickup Address</div>
                    <div className="text-sm">{parcelData.pickupAddress}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Delivery Address</div>
                    <div className="text-sm">{parcelData.deliveryAddress}</div>
                  </div>
                </div>

                {parcelData.expectedDeliveryTime && (
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="text-sm text-muted-foreground">Expected Delivery</div>
                    <div className="font-medium">
                      {new Date(parcelData.expectedDeliveryTime).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/parcel/${trackingId.trim()}`}
                className="w-full btn-primary px-6 py-3 rounded-lg font-semibold transition-transform duration-150 active:scale-95 flex justify-center items-center"
              >
                View Full Details
              </Link>
            </div>
          )}

          {!parcelData && !error && !isLoading && (
            <div className="text-center text-muted-foreground text-sm">
              Enter your tracking ID to see parcel details
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
