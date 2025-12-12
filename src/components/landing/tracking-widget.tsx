"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, MapPin } from "lucide-react";

const demoTracking = {
  awb: "NWC123456789",
  status: "IN_TRANSIT",
  timeline: [
    { status: "PICKED_UP", label: "Picked Up", location: "Mumbai", time: "Dec 10, 10:30 AM", completed: true },
    { status: "IN_TRANSIT", label: "In Transit", location: "Delhi Hub", time: "Dec 11, 2:15 PM", completed: true },
    { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", location: "Noida", time: "Dec 12, 9:00 AM", completed: false },
    { status: "DELIVERED", label: "Delivered", location: "", time: "", completed: false },
  ],
};

export function TrackingWidget() {
  const [trackingId, setTrackingId] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setShowDemo(true);
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
              placeholder="Enter tracking number (e.g., NWC123456789)"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button
              type="submit"
              className="btn-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform duration-150 active:scale-95"
            >
              <Search className="h-5 w-5" />
              Track
            </button>
          </form>

          {showDemo && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <div className="text-sm text-muted-foreground">Tracking ID</div>
                  <div className="font-mono font-semibold">{demoTracking.awb}</div>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  In Transit
                </div>
              </div>

              <div className="space-y-4">
                {demoTracking.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          event.completed ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.status === "PICKED_UP" && <Package className="h-5 w-5" />}
                        {event.status === "IN_TRANSIT" && <Truck className="h-5 w-5" />}
                        {event.status === "OUT_FOR_DELIVERY" && <MapPin className="h-5 w-5" />}
                        {event.status === "DELIVERED" && <CheckCircle className="h-5 w-5" />}
                      </div>
                      {index < demoTracking.timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${event.completed ? "bg-primary" : "bg-border"}`}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-semibold">{event.label}</div>
                      {event.location && (
                        <div className="text-sm text-muted-foreground">{event.location}</div>
                      )}
                      {event.time && (
                        <div className="text-xs text-muted-foreground mt-1">{event.time}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border text-sm text-muted-foreground">
                <p>Estimated delivery: Dec 12, 2025 by 6:00 PM</p>
              </div>
            </div>
          )}

          {!showDemo && (
            <div className="text-center text-muted-foreground text-sm">
              Try demo tracking ID: <span className="font-mono font-semibold">NWC123456789</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
