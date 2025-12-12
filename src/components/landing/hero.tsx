"use client";

import { useState } from "react";
import { Package, MapPin, Clock, TrendingUp } from "lucide-react";

export function Hero({ onGetQuote, onTrackParcel }: { onGetQuote: () => void; onTrackParcel: () => void }) {
  return (
    <section className="relative bg-background pt-20 pb-12 md:pt-32 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Fast & Reliable{" "}
                <span className="text-primary">Courier Service</span>{" "}
                Across India
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Doorstep pickup • Real-time tracking • Same-day in metros • Trusted by sellers and shoppers nationwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetQuote}
                className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg transition-transform duration-150 active:scale-95"
              >
                Get a Free Quote
              </button>
              <button
                onClick={onTrackParcel}
                className="px-8 py-4 rounded-lg border-2 border-input hover:bg-muted hover:border-primary transition-colors font-semibold text-lg"
              >
                Track Your Parcel
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">99.8%</div>
                <div className="text-sm text-muted-foreground">On-time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">30K+</div>
                <div className="text-sm text-muted-foreground">Daily shipments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">19K+</div>
                <div className="text-sm text-muted-foreground">PIN codes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&h=600&fit=crop"
                alt="Courier delivery service in India"
                className="rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
