"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomers, useCreateCustomer } from "@/hooks/use-customers";
import { formatDateTime } from "@/lib/utils";
import { Plus, Search, X, Loader2, Building2, User, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const { data, isLoading, error } = useCustomers({ search });
  const createCustomer = useCreateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      businessName: "",
    },
  });

  const onSubmit = async (formData: Record<string, unknown>) => {
    try {
      await createCustomer.mutateAsync({
        name: formData.name as string,
        phone: formData.phone as string,
        address: formData.address as string,
        businessName: formData.businessName ? (formData.businessName as string) : undefined,
      });
      setShowCreateModal(false);
      reset();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 justify-center"
        >
          <Plus className="h-5 w-5" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, phone, or business..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            Failed to load customers. Please try again.
          </div>
        ) : data?.customers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {search
              ? "No customers match your search."
              : "No customers yet. Add your first customer to get started."}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Phone</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Business</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Address</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data?.customers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      onClick={() => {
                        setNavigatingTo(customer.id);
                        router.push(`/parcels?customerId=${customer.id}`);
                      }}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {navigatingTo === customer.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {customer.businessName ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {customer.businessName}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground max-w-xs">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{customer.address}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDateTime(customer.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden divide-y divide-border">
              {data?.customers.map((customer) => (
                <div 
                  key={customer.id} 
                  onClick={() => {
                    setNavigatingTo(customer.id);
                    router.push(`/parcels?customerId=${customer.id}`);
                  }}
                  className="p-4 space-y-3 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {navigatingTo === customer.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{customer.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                  {customer.businessName && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.businessName}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{customer.address}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Added {formatDateTime(customer.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Add New Customer</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  reset();
                }}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name *
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address *
                </label>
                <textarea
                  {...register("address", { required: "Address is required" })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="123 Main Street, City, State, PIN"
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Business Name (Optional)
                </label>
                <input
                  {...register("businessName")}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="ABC Company Pvt Ltd"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    reset();
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-input hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add Customer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
