import type { Metadata } from "next";

export const landingMetadata: Metadata = {
  title: "Nationwide Courier — Fast, Reliable Courier Service Across India",
  description: "Nationwide Courier — Fast, reliable courier service across India. Doorstep pickup, real-time parcel tracking, eCommerce shipping, COD & bulk logistics. Get a free quote.",
  keywords: [
    "courier service India",
    "courier service near me India",
    "national courier service",
    "same day courier India",
    "next day courier India",
    "parcel tracking India",
    "door pickup courier India",
    "ecommerce shipping India",
    "COD courier India",
    "cheap courier rates India",
    "pan-India courier",
  ],
  authors: [{ name: "Nationwide Courier" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nationwidecourier.in",
    title: "Nationwide Courier — Fast, Reliable Courier Service Across India",
    description: "Nationwide Courier — Fast, reliable courier service across India. Doorstep pickup, real-time parcel tracking, eCommerce shipping, COD & bulk logistics. Get a free quote.",
    siteName: "Nationwide Courier",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Nationwide Courier - Fast delivery across India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nationwide Courier — Fast, Reliable Courier Service Across India",
    description: "Fast, reliable courier service across India. Doorstep pickup, real-time tracking, eCommerce shipping, COD & bulk logistics.",
    images: ["https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&h=630&fit=crop"],
  },
  alternates: {
    canonical: "https://nationwidecourier.in",
  },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://nationwidecourier.in",
  name: "Nationwide Courier",
  url: "https://nationwidecourier.in",
  logo: "https://nationwidecourier.in/logo.png",
  image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&h=630&fit=crop",
  description: "Fast, reliable courier service across India with doorstep pickup, real-time tracking, and nationwide coverage.",
  telephone: "+91-1800-XXX-XXXX",
  priceRange: "₹₹",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "19.0760",
    longitude: "72.8777",
  },
  serviceType: [
    "Courier Service",
    "Parcel Delivery",
    "Same-Day Delivery",
    "Next-Day Delivery",
    "eCommerce Fulfilment",
    "COD Service",
    "B2B Logistics",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "2847",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-1800-XXX-XXXX",
    contactType: "Customer Service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://www.facebook.com/nationwidecourier",
    "https://twitter.com/nationwidecourier",
    "https://www.instagram.com/nationwidecourier",
    "https://www.linkedin.com/company/nationwidecourier",
  ],
};
