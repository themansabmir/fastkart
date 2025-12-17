import type { Metadata } from "next";

export const landingMetadata: Metadata = {
  title: "FastKart Cargo — Fast, Reliable Courier Service Across India",
  description: "FastKart Cargo — Fast, reliable courier service across India. Doorstep pickup, real-time parcel tracking, eCommerce shipping, COD & bulk logistics. Get a free quote.",
  keywords: [
    "courier service India",
    "courier service near me India",
    "FastKart Cargo",
    "fastkart",
    "parcel tracking India",
    "door pickup courier India",
    "ecommerce shipping India",
    "COD courier India",
    "cheap courier rates India",
    "pan-India courier",
  ],
  authors: [{ name: "FastKart Cargo" }],
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
    url: "https://fastkartcargo.in",
    title: "FastKart Cargo — Fast, Reliable Courier Service Across India",
    description: "FastKart Cargo — Fast, reliable courier service across India. Doorstep pickup, real-time parcel tracking, eCommerce shipping, COD & bulk logistics. Get a free quote.",
    siteName: "FastKart Cargo",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or use a valid URL
        width: 1200,
        height: 630,
        alt: "FastKart Cargo - Fast delivery across India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastKart Cargo — Fast, Reliable Courier Service Across India",
    description: "Fast, reliable courier service across India. Doorstep pickup, real-time tracking, eCommerce shipping, COD & bulk logistics.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://fastkartcargo.in",
  },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://fastkartcargo.in",
      name: "FastKart Cargo",
      url: "https://fastkartcargo.in",
      logo: "https://fastkartcargo.in/logo.png",
      image: "https://fastkartcargo.in/og-image.jpg",
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
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-1800-XXX-XXXX",
        contactType: "Customer Service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
        contactOption: "TollFree",
        url: "https://fastkartcargo.in/contact",
      },
      sameAs: [
        "https://www.facebook.com/fastkartcargo",
        "https://twitter.com/fastkartcargo",
        "https://www.instagram.com/fastkartcargo",
        "https://www.linkedin.com/company/fastkartcargo",
      ],
    },
    {
      "@type": "SiteNavigationElement",
      name: "About Us",
      url: "https://fastkartcargo.in/about",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Services",
      url: "https://fastkartcargo.in/services",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Track Parcel",
      url: "https://fastkartcargo.in/#tracking",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Contact Us",
      url: "https://fastkartcargo.in/contact",
    },
  ],
};
