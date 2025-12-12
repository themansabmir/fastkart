"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What areas do you deliver to?",
    answer: "We deliver to all PIN codes across India — metro, urban and remote. Typical delivery times vary by zone: metros 1 day, major cities 2 days, remote areas 3-5 days.",
  },
  {
    question: "How do I schedule a pickup?",
    answer: "Use our 'Get a Free Quote' form, enter pickup details, or call our helpline at 1800-XXX-XXXX. We offer free doorstep pickup across all serviceable areas.",
  },
  {
    question: "How can I track my parcel?",
    answer: "Enter your AWB/tracking ID in the tracking widget at the top of the page for real-time updates. You'll also receive SMS and email notifications at every milestone.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer: "Yes — we provide integrated COD services with secure settlement cycles (T+2 for business accounts). Perfect for eCommerce sellers and marketplaces.",
  },
  {
    question: "What items are prohibited?",
    answer: "Prohibited items include explosives, illegal substances, perishable hazardous goods, and items banned under Indian law. View the full list in our Terms & Conditions.",
  },
  {
    question: "What is your insurance policy?",
    answer: "All shipments are insured up to the declared value (max ₹25,000 for standard plans). Claims are handled within 7 business days. Additional coverage available for high-value items.",
  },
  {
    question: "How much does shipping cost?",
    answer: "Pricing varies by weight, dimensions, and distance. Use our quote form for instant rates. Pay-as-you-go starts at ₹40/kg, with discounts for monthly business plans.",
  },
  {
    question: "Can I ship internationally?",
    answer: "This service is for domestic (India) shipments. For international shipping, please contact our enterprise team for custom solutions.",
  },
  {
    question: "What if a parcel is delayed?",
    answer: "Check tracking first for real-time updates. Contact our 24/7 support for escalation. We provide refunds or credits for service failures as per our SLA commitments.",
  },
  {
    question: "How does returns handling work?",
    answer: "We provide reverse logistics and returns management for sellers. Single-click returns from your dashboard, with the same tracking and reliability as forward shipments.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-12 md:py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about courier & shipping in India
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
