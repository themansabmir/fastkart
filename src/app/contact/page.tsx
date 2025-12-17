import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactPageForm } from "@/components/contact/contact-page-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us | FastKart Cargo - 24/7 Customer Support",
    description: "Get in touch with FastKart Cargo. Call our toll-free number, visit our Mumbai headquarters, or send us a message for instant support.",
};

export default function ContactPage() {
    return (
        <>
            <HeaderWrapper />
            <main className="pt-24 pb-16 min-h-screen bg-background">
                <section className="bg-muted py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs items={[{ label: "Contact Us", href: "/contact" }]} />
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl">
                            We are here to help. Reach out to us for quotes, tracking support, or partnership inquiries.
                        </p>
                    </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

                            {/* Contact Information */}
                            <div>
                                <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Head Office</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                FastKart Cargo Pvt. Ltd.<br />
                                                Unit 401, Logistics Park, Andheri East<br />
                                                Mumbai, Maharashtra - 400093, India
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Phone</h3>
                                            <p className="text-muted-foreground mb-1">
                                                <a href="tel:18001234567" className="hover:text-primary transition-colors">1800-123-4567</a> (Toll Free)
                                            </p>
                                            <p className="text-muted-foreground">
                                                <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a> (Support)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Email</h3>
                                            <p className="text-muted-foreground mb-1">
                                                <a href="mailto:support@fastkartcargo.in" className="hover:text-primary transition-colors">support@fastkartcargo.in</a>
                                            </p>
                                            <p className="text-muted-foreground">
                                                <a href="mailto:sales@fastkartcargo.in" className="hover:text-primary transition-colors">sales@fastkartcargo.in</a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Operating Hours</h3>
                                            <p className="text-muted-foreground">
                                                Mon - Sat: 9:00 AM - 8:00 PM<br />
                                                Sun: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <h2 className="text-2xl font-bold mb-6">Find Us on Map</h2>
                                    <div className="rounded-xl overflow-hidden border border-border shadow-sm h-[300px] w-full bg-muted relative">
                                        {/* Google Maps Placeholder */}
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.845836938477!2d72.85934!3d19.11364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzQ5LjEiTiA3MsKwNTEnMzMuNiJF!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            title="FastKart Cargo Location"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div>
                                <div className="bg-card rounded-2xl p-2 md:p-6">
                                    <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                                    <p className="text-muted-foreground mb-8">Fill out the form below and we will get back to you shortly.</p>
                                    <ContactPageForm />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
