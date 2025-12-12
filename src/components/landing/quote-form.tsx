"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteForm({ isOpen, onClose }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupPincode: "",
    deliveryPincode: "",
    weight: "",
    pickupAddress: "",
    pickupDate: "",
    pickupTime: "",
    businessType: "individual",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({
        name: "",
        phone: "",
        email: "",
        pickupPincode: "",
        deliveryPincode: "",
        weight: "",
        pickupAddress: "",
        pickupDate: "",
        pickupTime: "",
        businessType: "individual",
      });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <h2 className="text-2xl font-bold">Get a Free Quote</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {submitted ? (
            <div className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quote Request Submitted!</h3>
            <p className="text-muted-foreground">
              We'll contact you shortly with pricing and pickup details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pickup PIN Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.pickupPincode}
                  onChange={(e) => setFormData({ ...formData, pickupPincode: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="400001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Delivery PIN Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.deliveryPincode}
                  onChange={(e) => setFormData({ ...formData, deliveryPincode: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="110001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Approximate Weight (kg) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="1.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Pickup Address <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                placeholder="Complete pickup address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Pickup Time
                </label>
                <input
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sender Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="individual"
                    checked={formData.businessType === "individual"}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Individual</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="business"
                    checked={formData.businessType === "business"}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Business</span>
                </label>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              🔒 We'll only use your info to contact you about this shipment. Your privacy is protected.
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border border-input hover:bg-muted transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Get Quote"
                )}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
