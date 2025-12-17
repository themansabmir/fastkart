import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Image from "next/image";
import { CheckCircle, Shield, Truck, Globe, Award, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us | FastKart Cargo - India's Trusted Courier Partner",
    description: "Learn about FastKart Cargo's journey to becoming India's fastest and most reliable courier service. Our mission, vision, and commitment to excellence.",
};

export default function AboutPage() {
    return (
        <>
            <HeaderWrapper />
            <main className="pt-24 pb-16 min-h-screen bg-background">
                {/* Header Section */}
                <section className="bg-muted py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} />
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About FastKart Cargo</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl">
                            We are driving the future of logistics in India with speed, integrity, and innovation.
                        </p>
                    </div>
                </section>

                {/* Company History & Mission */}
                <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
                                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                                    <p>
                                        Founded with a simple vision to simplify logistics for Indian businesses, FastKart Cargo has grown from a local courier agency to a nationwide logistics powerhouse.
                                    </p>
                                    <p>
                                        Over the years, we have built a robust network covering 19,000+ PIN codes, handling everything from critical documents to heavy cargo with the same level of care and precision. Our commitment to technology and customer satisfaction has made us the preferred partner for eCommerce giants and small businesses alike.
                                    </p>
                                </div>
                            </div>
                            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                                <div className="absolute inset-0 bg-primary/10 z-10"></div>
                                {/* Placeholder for About Image - Using a color block or pattern if image not available, but user asked for next/image */}
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    <span className="sr-only">Company Warehouse Image</span>
                                    {/* Ideally we would have a real image here. I will use a placeholder from unsplash if possible or just a div as per my constraints I can't guess image paths. 
                       But new constraint says: "Images: Use the next/image ... for all new icons/illustrations". 
                       I will use a standard Unsplash ID. */}
                                    <Image
                                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                                        alt="FastKart Warehouse Operations"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-24 grid md:grid-cols-2 gap-8">
                            <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                <p className="text-muted-foreground">
                                    To empower businesses by bridging distances with the fastest, most secure, and cost-effective logistics solutions, ensuring every parcel delivered is a promise kept.
                                </p>
                            </div>
                            <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                                    <Award className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                                <p className="text-muted-foreground">
                                    To be India's undisputed leader in logistics, known for innovation, reliability, and setting the benchmark for customer experience in the courier industry.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="bg-muted/50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FastKart?</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                We deliver more than just parcels; we deliver trust. Here is why thousands of customers rely on us daily.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                                <Truck className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Unmatched Speed</h3>
                                <p className="text-muted-foreground">
                                    Same-day delivery in metro cities and next-day service across major Indian hubs. We understand the value of time.
                                </p>
                            </div>

                            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                                <Shield className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Secure Handling</h3>
                                <p className="text-muted-foreground">
                                    Your cargo is precious. With tamper-proof packaging and real-time surveillance, we ensure 100% safety.
                                </p>
                            </div>

                            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                                <Users className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                                <p className="text-muted-foreground">
                                    24/7 support team dedicated to resolving your queries. No bots, just real people helping you.
                                </p>
                            </div>

                            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                                <Globe className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Nationwide Reach</h3>
                                <p className="text-muted-foreground">
                                    From Kashmir to Kanyakumari, our network covers over 19,000+ PIN codes including remote locations.
                                </p>
                            </div>

                            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Reliable Tracking</h3>
                                <p className="text-muted-foreground">
                                    End-to-end visibility with our advanced tracking system. Know exactly where your shipment is at all times.
                                </p>
                            </div>

                            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                                <Award className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Best Rates</h3>
                                <p className="text-muted-foreground">
                                    Competitive pricing without compromising on service quality. Tailored plans for businesses.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
