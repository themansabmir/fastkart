"use client";

import { useState } from "react";
import Script from "next/script";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { TrackingWidget } from "@/components/landing/tracking-widget";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { QuoteForm } from "@/components/landing/quote-form";
import { structuredData } from "./layout-metadata";

export default function Home() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const handleGetQuote = () => {
    setShowQuoteForm(true);
  };

  const handleTrackParcel = () => {
    const trackingSection = document.getElementById("tracking");
    if (trackingSection) {
      trackingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar onGetQuote={handleGetQuote} />
      <main>
        <Hero onGetQuote={handleGetQuote} onTrackParcel={handleTrackParcel} />
        <Services />
        <HowItWorks />
        <Pricing />
        <TrackingWidget />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <QuoteForm isOpen={showQuoteForm} onClose={() => setShowQuoteForm(false)} />
    </>
  );
}
