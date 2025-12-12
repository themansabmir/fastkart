import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toaster";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomersResponse {
  customers: Customer[];
}

interface CustomerFilters {
  search?: string;
  limit?: number;
}

export function useCustomers(filters: CustomerFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.limit) params.set("limit", String(filters.limit));

  return useQuery<CustomersResponse>({
    queryKey: ["customers", filters],
    queryFn: async () => {
      const res = await fetch(`/api/customers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      address: string;
      businessName?: string;
    }) => {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create customer");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "Customer created successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
