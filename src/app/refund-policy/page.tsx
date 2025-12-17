import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy | FastKart Cargo",
    description: "Learn about our cancellation process and refund conditions.",
};

export default function RefundPolicyPage() {
    return (
        <>
            <HeaderWrapper />
            <main className="pt-24 pb-16 min-h-screen bg-background">
                <section className="bg-muted py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs items={[{ label: "Refund Policy", href: "/refund-policy" }]} />
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Refund & Cancellation Policy</h1>
                        <p className="text-muted-foreground">Effective Date: December 17, 2025</p>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-gray max-w-none">
                            <p className="lead text-lg text-muted-foreground mb-8">
                                At FastKart Cargo, we aim for complete customer satisfaction. If you are not satisfied with our service or need to cancel a booking, this policy outlines the terms.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">1. Cancellation Policy</h2>
                            <p className="mb-4 text-muted-foreground">
                                <strong>Before Pickup:</strong> You may cancel your booking at any time before the shipment is picked up. A full refund will be processed within 5-7 business days.
                            </p>
                            <p className="mb-4 text-muted-foreground">
                                <strong>After Pickup:</strong> Once the shipment has been picked up, cancellations are treated as "Return to Origin" (RTO). Shipping charges will not be refunded, and return charges may apply.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">2. Refund Eligibility</h2>
                            <p className="mb-4 text-muted-foreground">
                                Refunds are applicable in the following scenarios:
                            </p>
                            <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                                <li>Service failure where the package was lost or damaged in transit (subject to insurance claims).</li>
                                <li>Incorrect billing or duplicate payments.</li>
                                <li>Cancellation before pickup as mentioned above.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mt-8 mb-4">3. Non-Refundable Scenarios</h2>
                            <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                                <li>Delays caused by incorrect address or contact details provided by the sender.</li>
                                <li>Shipments detained by customs or government authorities.</li>
                                <li>Force majeure events beyond our control.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mt-8 mb-4">4. Processing Time</h2>
                            <p className="mb-4 text-muted-foreground">
                                Approved refunds will be credited back to the original payment method within 7-10 working days.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">5. Contact for Refunds</h2>
                            <p className="text-muted-foreground">
                                To request a cancellation or refund, please email us at refunds@fastkartcargo.in or call our support line with your Tracking ID/AWB Number.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
