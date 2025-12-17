import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
    title: "Privacy Policy | FastKart Cargo",
    description: "FastKart Cargo's privacy policy explaining how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <HeaderWrapper />
            <main className="pt-24 pb-16 min-h-screen bg-background">
                <section className="bg-muted py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy-policy" }]} />
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last Updated: December 17, 2025</p>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-gray max-w-none">
                            <p className="lead text-lg text-muted-foreground mb-8">
                                At FastKart Cargo, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices regarding data collection, usage, and protection.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
                            <p className="mb-4 text-muted-foreground">
                                We collect information necessary to provide our courier and logistics services, including:
                            </p>
                            <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                                <li>Sender and recipient details (Name, Address, Phone Number, Email).</li>
                                <li>Shipment details (Weight, Dimensions, Contents, Value).</li>
                                <li>Payment information (processed securely through third-party gateways).</li>
                                <li>Device and usage data when you visit our website or use our tracking tools.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
                            <p className="mb-4 text-muted-foreground">
                                Your data is used primarily to:
                            </p>
                            <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                                <li>Process and deliver your shipments.</li>
                                <li>Send tracking updates via SMS and Email.</li>
                                <li>Provide customer support and resolve issues.</li>
                                <li>Improve our services and prevent fraud.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Sharing and Disclosure</h2>
                            <p className="mb-4 text-muted-foreground">
                                We do not sell your personal data. We may share information with:
                            </p>
                            <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                                <li>Service partners (airlines, trucking companies) strictly for delivery purposes.</li>
                                <li>Legal authorities when required by law.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
                            <p className="mb-4 text-muted-foreground">
                                We implement industry-standard security measures including encryption and secure servers to protect your data. However, no method of transmission over the internet is 100% secure.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights</h2>
                            <p className="mb-4 text-muted-foreground">
                                You have the right to access, correct, or delete your personal information held by us. Contact our privacy officer at privacy@fastkartcargo.in for any requests.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies</h2>
                            <p className="mb-4 text-muted-foreground">
                                We use cookies to enhance your browsing experience and analyze website traffic. You can control cookie preferences through your browser settings.
                            </p>

                            <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have questions about this policy, please contact us at:<br />
                                <strong>Email:</strong> support@fastkartcargo.in<br />
                                <strong>Address:</strong> FastKart Cargo Pvt. Ltd., Mumbai, India.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
