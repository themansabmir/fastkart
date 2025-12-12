import { Clock, Zap, ShoppingBag, Building2 } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Same-Day Delivery (Metro)",
    description: "Get parcels delivered within hours in major cities across India.",
    features: ["Mumbai, Delhi, Bangalore, Chennai", "Order before 2 PM", "Express handling"],
  },
  {
    icon: Clock,
    title: "Next-Day Nationwide",
    description: "Fast next-day delivery for most urban and semi-urban PIN codes.",
    features: ["19,000+ PIN codes", "Guaranteed delivery", "SMS tracking updates"],
  },
  {
    icon: ShoppingBag,
    title: "eCommerce Fulfilment & COD",
    description: "Integrated shipping, returns, and fast COD settlements.",
    features: ["API integration", "T+2 COD settlement", "Easy returns management"],
  },
  {
    icon: Building2,
    title: "Bulk & B2B Logistics",
    description: "Custom pricing, dedicated account managers, API integrations.",
    features: ["Volume discounts", "Dedicated support", "Custom SLAs"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-12 md:py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive courier solutions tailored for businesses and individuals across India
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
