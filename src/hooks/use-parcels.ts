import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toaster";

interface Parcel {
  id: string;
  trackingId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  description: string;
  status: string;
  internalNotes?: string;
  deliveryDate?: string;
  assignedRider?: string;
  proofUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ParcelsResponse {
  parcels: Parcel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface StatsResponse {
  total: number;
  byStatus: Record<string, number>;
  recentParcels: {
    id: string;
    trackingId: string;
    customerName: string;
    status: string;
    createdAt: string;
  }[];
  dailyCounts: { date: string; count: number }[];
}

interface ParcelFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useParcels(filters: ParcelFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  return useQuery<ParcelsResponse>({
    queryKey: ["parcels", filters],
    queryFn: async () => {
      const res = await fetch(`/api/parcels?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch parcels");
      return res.json();
    },
  });
}

export function useParcel(id: string) {
  return useQuery<{ parcel: Parcel }>({
    queryKey: ["parcel", id],
    queryFn: async () => {
      const res = await fetch(`/api/parcels/${id}`);
      if (!res.ok) throw new Error("Failed to fetch parcel");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useParcelStats() {
  return useQuery<StatsResponse>({
    queryKey: ["parcel-stats"],
    queryFn: async () => {
      const res = await fetch("/api/parcels/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}

export function useCreateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create parcel");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      queryClient.invalidateQueries({ queryKey: ["parcel-stats"] });
      toast({ title: "Parcel created successfully", variant: "success" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/parcels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update parcel");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      queryClient.invalidateQueries({ queryKey: ["parcel", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["parcel-stats"] });
      toast({ title: "Parcel updated successfully", variant: "success" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/parcels/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete parcel");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      queryClient.invalidateQueries({ queryKey: ["parcel-stats"] });
      toast({ title: "Parcel deleted successfully", variant: "success" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });
}
