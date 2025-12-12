import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Anjali Sharma",
    role: "eCommerce Founder",
    company: "StyleHub",
    rating: 5,
    text: "Saved us time and reduced delivery complaints significantly. The COD settlement is fast and the tracking is reliable. Highly recommend for any online business.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "Sameer Patel",
    role: "Marketplace Seller",
    company: "TechGadgets",
    rating: 5,
    text: "Reliable COD settlements and clean API integration. The dedicated account manager helped us scale from 50 to 500 shipments per day seamlessly.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "Priya Desai",
    role: "Operations Manager",
    company: "FreshFarm Organics",
    rating: 5,
    text: "Best courier partner we've had. Same-day delivery in metros is a game-changer for our perishable products. Customer service is top-notch.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

const partners = [
  { name: "Flipkart", logo: "https://via.placeholder.com/120x40/ff7a00/ffffff?text=Flipkart" },
  { name: "Amazon", logo: "https://via.placeholder.com/120x40/ff7a00/ffffff?text=Amazon" },
  { name: "Myntra", logo: "https://via.placeholder.com/120x40/ff7a00/ffffff?text=Myntra" },
  { name: "Meesho", logo: "https://via.placeholder.com/120x40/ff7a00/ffffff?text=Meesho" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Businesses Across India</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their deliveries
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
              
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground">{testimonial.text}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">Integrated with Leading Platforms</h3>
            <p className="text-muted-foreground">Seamless shipping for your marketplace</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <img src={partner.logo} alt={`${partner.name} partner`} className="h-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
