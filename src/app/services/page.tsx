import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { ArrowRight, Truck, Plane, Package, Archive, Clock, Globe } from "lucide-react";

export const metadata: Metadata = {
    title: "Our Services | FastKart Cargo - Comprehensive Logistics Solutions",
    description: "Explore FastKart Cargo's range of courier services: Express Delivery, Heavy Cargo, Warehousing, and International Shipping. Tailored for B2B and B2C needs.",
};

const services = [
    {
        id: "express-delivery",
        title: "Express Delivery",
        description: "Lightning fast delivery for urgent documents and parcels. Same-day available in select metro cities.",
        icon: Clock,
    },
    {
        id: "heavy-cargo",
        title: "Heavy Cargo",
        description: "Specialized handling for heavy and bulky shipments. Cost-effective road and rail transport options.",
        icon: Truck,
    },
    {
        id: "ecommerce-logistics",
        title: "eCommerce Logistics",
        description: "End-to-end fulfillment, COD management, and reverse logistics designed for online sellers.",
        icon: Package,
    },
    {
        id: "international-shipping",
        title: "International Shipping",
        description: "Connect with the world. Reliable air and sea freight solutions to over 200 countries.",
        icon: Plane,
    },
    {
        id: "warehousing",
        title: "Warehousing",
        description: "Secure storage solutions with inventory management. Pay only for the space you use.",
        icon: Archive,
    },
    {
        id: "b2b-distribution",
        title: "B2B Distribution",
        description: "Efficient supply chain management for manufacturers and distributors covering 19,000+ PIN codes.",
        icon: Globe,
    },
];

export default function ServicesPage() {
    return (
        <>
            <HeaderWrapper />
            <main className="pt-24 pb-16 min-h-screen bg-background">
                <section className="bg-muted py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl">
                            From small parcels to full truckloads, we offer a complete suite of logistics services tailored to your business needs.
                        </p>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service) => (
                                <Link
                                    href={`/services/${service.id}`}
                                    key={service.id}
                                    className="group bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 flex flex-col"
                                >
                                    <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <service.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                                    <p className="text-muted-foreground mb-6 flex-grow">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center text-primary font-semibold">
                                        Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-20 bg-primary/5 rounded-2xl p-12 text-center items-center">
                            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                We understand that every business is unique. Contact our logistics experts to design a supply chain solution that fits your specific requirements.
                            </p>
                            <Link href="/contact" className="btn-primary px-8 py-3 rounded-lg font-semibold inline-block">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
