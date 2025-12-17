import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
    title: "Terms & Conditions | FastKart Cargo",
    description: "Service agreement and terms of use for FastKart Cargo services.",
};

export default function TermsPage() {
    return (
        <>
            <HeaderWrapper />
            <main className="pt-24 pb-16 min-h-screen bg-background">
                <section className="bg-muted py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs items={[{ label: "Terms & Conditions", href: "/terms" }]} />
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms and Conditions</h1>
                        <p className="text-muted-foreground">Effective Date: December 17, 2025</p>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-gray max-w-none">
                            <p className="lead text-lg text-muted-foreground mb-8">
                                Welcome to FastKart Cargo. By using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">1. Definitions</h2>
                            <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                                <li><strong>"Company"</strong> refers to FastKart Cargo Pvt. Ltd.</li>
                                <li><strong>"Customer"</strong> refers to the person or entity availing the services.</li>
                                <li><strong>"Shipment"</strong> refers to all documents or parcels transported under a single waybill.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mt-8 mb-4">2. Prohibited Items</h2>
                            <p className="mb-4 text-muted-foreground">
                                The content of the shipment must not contain any prohibited items, including but not limited to: explosives, firearms, illegal drugs, currency, perishable food items (unless specified), and hazardous materials. The Company reserves the right to inspect any shipment.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">3. Packaging</h2>
                            <p className="mb-4 text-muted-foreground">
                                The Customer is responsible for ensuring that the shipment is adequately packaged to withstand normal transport conditions. The Company is not liable for damage caused by improper packaging.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">4. Liability</h2>
                            <p className="mb-4 text-muted-foreground">
                                The Company's liability for loss or damage is limited to the declared value of the shipment or ₹5,000, whichever is lower, unless enhanced insurance is purchased. We are not liable for indirect or consequential losses (e.g., loss of profit).
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">5. Delivery Times</h2>
                            <p className="mb-4 text-muted-foreground">
                                While we strive to deliver within the estimated timeframes, delivery dates are estimates and not guaranteed. The Company is not liable for delays caused by force majeure events (e.g., weather, strikes, natural disasters).
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">6. Payment</h2>
                            <p className="mb-4 text-muted-foreground">
                                Payment must be made in full at the time of booking or pickup. For credit account holders, payment is due within the agreed credit period. Late payments may attract interest.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">7. Governing Law</h2>
                            <p className="mb-4 text-muted-foreground">
                                These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
