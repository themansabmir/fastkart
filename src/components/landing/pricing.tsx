import { Check } from "lucide-react";

const plans = [
  {
    name: "Pay-as-you-go",
    price: "₹40",
    period: "per kg",
    description: "Perfect for occasional shipments",
    features: [
      "No monthly commitment",
      "Standard delivery times",
      "Basic tracking",
      "Email support",
      "Insurance up to ₹5,000",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Business Monthly",
    price: "₹2,999",
    period: "per month",
    description: "Best for growing eCommerce businesses",
    features: [
      "100 shipments included",
      "₹25/kg additional shipments",
      "Priority pickup",
      "Real-time GPS tracking",
      "COD with T+2 settlement",
      "Dedicated account manager",
      "API integration",
      "Insurance up to ₹25,000",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Tailored solutions for large volumes",
    features: [
      "Unlimited shipments",
      "Custom pricing per zone",
      "Same-day pickup guarantee",
      "White-label tracking",
      "Reverse logistics",
      "Custom SLAs",
      "24/7 priority support",
      "Full insurance coverage",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your shipping needs. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card border rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow ${
                plan.highlighted ? "border-primary border-2 shadow-md" : "border-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {plan.badge}
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-3 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-transform duration-150 active:scale-95 ${
                  plan.highlighted
                    ? "btn-primary"
                    : "border-2 border-input hover:bg-muted hover:border-primary"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include standard insurance. Additional coverage available. Prices exclude GST.
          </p>
        </div>
      </div>
    </section>
  );
}
