import { ClipboardCheck, Package, Radar, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Book Pickup",
    description: "Request a free pickup or schedule a time that suits you.",
  },
  {
    icon: Package,
    title: "We Pick, Pack & Dispatch",
    description: "Professional handling and secure transit.",
  },
  {
    icon: Radar,
    title: "Track in Real Time",
    description: "Live updates, SMS & email notifications.",
  },
  {
    icon: CheckCircle,
    title: "Delivery & Confirmation",
    description: "Contactless delivery and proof of delivery.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent process from pickup to delivery
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
                </div>
              )}
              
              <div className="relative z-10 text-center">
                <div className="inline-flex h-24 w-24 rounded-full bg-primary/10 items-center justify-center text-primary mb-4 relative">
                  <step.icon className="h-10 w-10" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
