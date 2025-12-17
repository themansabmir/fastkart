import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock Data Source - In a real app this might come from a CMS or DB
const serviceData: Record<string, {
    title: string;
    description: string;
    longDescription: string;
    features: string[];
    image: string;
    keywords: string[];
}> = {
    "express-delivery": {
        title: "Express Delivery Service",
        description: "Fastest door-to-door delivery service for urgent parcels across India.",
        longDescription: "When time is money, FastKart Cargo's Express Delivery service is your best bet. We offer same-day delivery in major metros and guaranteed next-day delivery to over 500 cities. Optimized for urgent documents, critical spare parts, and time-sensitive retail shipments.",
        features: ["Same-Day Delivery in Metros", "Real-time GPS Tracking", "Priority Handling", "Money-back Guarantee"],
        image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200",
        keywords: ["Express Delivery India", "Same Day Courier", "Urgent Parcel Service"],
    },
    "heavy-cargo": {
        title: "Heavy Cargo Transport",
        description: "Reliable transportation for heavy machinery and bulk shipments.",
        longDescription: "Move heavy loads with ease. Our Heavy Cargo division specializes in transporting industrial machinery, construction equipment, and bulk raw materials. With a fleet of multi-axle trailers and container trucks, we ensure your goods arrive safely and on schedule.",
        features: ["Full Truck Load (FTL)", "Part Truck Load (PTL)", "ODC & Project Cargo", "Crane Assistance"],
        image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200",
        keywords: ["Heavy Cargo India", "Machine Transport", "Bulk Logistics"],
    },
    "ecommerce-logistics": {
        title: "eCommerce Logistics & Fulfillment",
        description: "Complete logistics solutions for online businesses and D2C brands.",
        longDescription: "Scale your online business with FastKart's specialized eCommerce logistics. We handle storage, packing, shipping, and returns so you can focus on sales. Our technology integrates seamlessly with Shopify, WooCommerce, and Magento.",
        features: ["Fast COD Remittance (T+2)", "RTO Reduction Intelligence", "Smart Warehousing", "Packaging Solutions"],
        image: "https://images.unsplash.com/photo-1566576912906-600dfe056864?w=1200",
        keywords: ["eCommerce Shipping India", "COD Courier Service", "D2C Logistics"],
    },
    "international-shipping": {
        title: "International Shipping",
        description: "Global air and sea freight services connecting India to the world.",
        longDescription: "Expand your reach beyond borders. FastKart Cargo offers cost-effective air and sea freight solutions to over 220 destinations worldwide. We handle customs clearance, documentation, and door-to-door delivery for both export and import shipments.",
        features: ["Customs Brokerage", "Air Freight / Sea Freight", "Export Documentation Support", "Global Tracking"],
        image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=1200",
        keywords: ["International Courier India", "Air Freight Agents", "Export Shipping"],
    },
    "warehousing": {
        title: "Warehousing & Storage",
        description: "Secure, scalable warehousing solutions across strategic locations.",
        longDescription: "Need space? Our network of modern warehouses offers secure storage for your inventory. With WMS (Warehouse Management System) integration, you get real-time visibility of your stock levels. Flexible plans allow you to pay only for the pallet positions you use.",
        features: ["Inventory Management", "24/7 Security & CCTV", "Temperature Controlled Areas", "Pick and Pack Services"],
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200",
        keywords: ["Warehousing Services India", "3PL Providers", "Inventory Storage"],
    },
    "b2b-distribution": {
        title: "B2B Distribution Network",
        description: "Pan-India distribution solutions for manufacturers and wholesalers.",
        longDescription: "Optimize your supply chain with our B2B distribution network. We ensure timely replenishment of your dealers and distributors across rural and urban markets. Our hub-and-spoke model minimizes transit times and reduces logistics costs.",
        features: ["Dealer Distribution", "Appointment Deliveries", "Reverse Logistics", "GST Compliant Billing"],
        image: "https://images.unsplash.com/photo-1595054225888-0521b4b9dc56?w=1200",
        keywords: ["B2B Logistics India", "Supply Chain Management", "Distribution Services"],
    },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const service = serviceData[slug];

    if (!service) {
        return {
            title: "Service Not Found | FastKart Cargo",
        };
    }

    return {
        title: `${service.title} | FastKart Cargo India`,
        description: service.description,
        keywords: service.keywords.join(", "),
        openGraph: {
            title: service.title,
            description: service.longDescription,
            images: [service.image],
        },
    };
}

export async function generateStaticParams() {
    return Object.keys(serviceData).map((slug) => ({
        slug,
    }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = serviceData[slug];

    if (!service) {
        notFound();
    }

    return (
        <>
            <HeaderWrapper />
            <main className="pt-24 pb-16 min-h-screen bg-background">
                <section className="relative bg-muted py-12 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover opacity-10"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs items={[
                            { label: "Services", href: "/services" },
                            { label: service.title, href: `/services/${slug}` }
                        ]} />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">{service.title}</h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
                            {service.description}
                        </p>
                    </div>
                </section>

                <section className="py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16">

                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4">Overview</h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {service.longDescription}
                                    </p>
                                </div>

                                <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                                    <h3 className="text-xl font-bold mb-6">Key Features</h3>
                                    <ul className="space-y-4">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                                                <span className="text-lg">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex gap-4">
                                    <Link href="/contact" className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2">
                                        Get a Quote <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link href="/services" className="px-8 py-4 rounded-lg border border-input font-semibold text-lg hover:bg-muted transition-colors">
                                        View All Services
                                    </Link>
                                </div>
                            </div>

                            <div className="relative h-[400px] lg:h-auto rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={service.image}
                                    alt={`${service.title} in action`}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                        </div>
                    </div>
                </section>

                <section className="bg-primary/5 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to ship?</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join thousands of businesses who trust FastKart Cargo for their logistics needs.
                        </p>
                        <Link href="/contact" className="btn-primary px-8 py-3 rounded-lg font-semibold">
                            Contact Us Today
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
