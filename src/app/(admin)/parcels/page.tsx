"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParcels, useCreateParcel, useUpdateParcel } from "@/hooks/use-parcels";
import { getStatusLabel, getStatusColor, formatDateTime } from "@/lib/utils";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Copy,
  Check,
  Edit2,
  Clock,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";

const statuses = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "RETURNED",
];

const transportModes = ["AIR", "TRUCK", "TRAIN"];

export default function ParcelsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingParcel, setEditingParcel] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    status?: string;
    pickupTime?: string;
    deliveryTime?: string;
  }>({});
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const copyPublicLink = (publicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/parcel/${publicId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const { data, isLoading, error } = useParcels({
    page,
    limit: 20,
    search,
    status: statusFilter,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const createParcel = useCreateParcel();
  const updateParcel = useUpdateParcel();

  const startEditing = (parcel: { id: string; status: string; pickupTime?: string | null; deliveryTime?: string | null }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingParcel(parcel.id);
    setEditValues({
      status: parcel.status,
      pickupTime: parcel.pickupTime ? new Date(parcel.pickupTime).toISOString().slice(0, 16) : "",
      deliveryTime: parcel.deliveryTime ? new Date(parcel.deliveryTime).toISOString().slice(0, 16) : "",
    });
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingParcel(null);
    setEditValues({});
  };

  const saveEditing = async (parcelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateParcel.mutateAsync({
        id: parcelId,
        data: {
          status: editValues.status,
          pickupTime: editValues.pickupTime || null,
          deliveryTime: editValues.deliveryTime || null,
        },
      });
      setEditingParcel(null);
      setEditValues({});
    } catch {
      // Error handled by mutation
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      pickupAddress: "",
      deliveryAddress: "",
      description: "",
      weight: "",
      volume: "",
      mode: "",
      pickupTime: "",
      deliveryTime: "",
      status: "PENDING" as const,
      internalNotes: "",
      assignedRider: "",
    },
  });

  const onSubmit = async (formData: Record<string, unknown>) => {
    try {
      // Convert numeric fields and handle empty strings
      const payload = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight as string) : null,
        volume: formData.volume ? parseFloat(formData.volume as string) : null,
        mode: formData.mode || null,
        pickupTime: formData.pickupTime || null,
        deliveryTime: formData.deliveryTime || null,
      };
      await createParcel.mutateAsync(payload);
      setShowCreateModal(false);
      reset();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Parcels</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 justify-center"
        >
          <Plus className="h-5 w-5" />
          Add Parcel
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, tracking ID, address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
            statusFilter ? "border-primary bg-primary/10" : "border-input"
          }`}
        >
          <Filter className="h-5 w-5" />
          Filter
          {statusFilter && (
            <span
              className="ml-1 px-2 py-0.5 rounded-full text-xs text-white"
              style={{ backgroundColor: "#ff7a00" }}
            >
              1
            </span>
          )}
        </button>
      </div>

      {/* Filter dropdown */}
      {showFilters && (
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Status</span>
            {statusFilter && (
              <button
                onClick={() => {
                  setStatusFilter("");
                  setPage(1);
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(statusFilter === status ? "" : status);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  statusFilter === status
                    ? "text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
                style={
                  statusFilter === status ? { backgroundColor: "#ff7a00" } : {}
                }
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading parcels...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            Failed to load parcels. Please try again.
          </div>
        ) : data?.parcels.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {search || statusFilter
              ? "No parcels match your filters."
              : "No parcels yet. Create your first parcel to get started."}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Tracking ID
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Pickup Time
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Delivery Time
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data?.parcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      onClick={() => {
                        if (editingParcel !== parcel.id) {
                          setNavigatingTo(parcel.id);
                          router.push(`/parcels/${parcel.id}`);
                        }
                      }}
                      className={`hover:bg-muted/50 transition-colors ${editingParcel === parcel.id ? '' : 'cursor-pointer'}`}
                    >
                      <td className="px-4 py-3 font-mono text-sm">
                        <div className="flex items-center gap-2">
                          {navigatingTo === parcel.id && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          )}
                          {parcel.trackingId}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{parcel.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {parcel.customerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {editingParcel === parcel.id ? (
                          <select
                            value={editValues.status || parcel.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditValues({ ...editValues, status: e.target.value });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {getStatusLabel(status)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              parcel.status
                            )}`}
                          >
                            {getStatusLabel(parcel.status)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingParcel === parcel.id ? (
                          <input
                            type="datetime-local"
                            value={editValues.pickupTime || ""}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditValues({ ...editValues, pickupTime: e.target.value });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {parcel.pickupTime ? formatDateTime(parcel.pickupTime) : "Not set"}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingParcel === parcel.id ? (
                          <input
                            type="datetime-local"
                            value={editValues.deliveryTime || ""}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditValues({ ...editValues, deliveryTime: e.target.value });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {parcel.deliveryTime ? formatDateTime(parcel.deliveryTime) : "Not set"}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {editingParcel === parcel.id ? (
                            <>
                              <button
                                onClick={(e) => saveEditing(parcel.id, e)}
                                disabled={updateParcel.isPending}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                title="Save changes"
                              >
                                {updateParcel.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => startEditing(parcel, e)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Quick edit status & times"
                              >
                                <Edit2 className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={(e) => copyPublicLink(parcel.publicId, e)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Copy public tracking link"
                              >
                                {copiedId === parcel.publicId ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden divide-y divide-border">
              {data?.parcels.map((parcel) => (
                <div
                  key={parcel.id}
                  onClick={() => {
                    setNavigatingTo(parcel.id);
                    router.push(`/parcels/${parcel.id}`);
                  }}
                  className="block p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {navigatingTo === parcel.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      <div>
                        <p className="font-medium">{parcel.customerName}</p>
                        <p className="text-sm font-mono text-muted-foreground">
                          {parcel.trackingId}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        parcel.status
                      )}`}
                    >
                      {getStatusLabel(parcel.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {parcel.pickupAddress} → {parcel.deliveryAddress}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.totalPages} (
                  {data.pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(data.pagination.totalPages, p + 1)
                      )
                    }
                    disabled={page === data.pagination.totalPages}
                    className="p-2 rounded-lg border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Add New Parcel</h2>
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
                  {...register("customerName")}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.customerName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Phone *
                </label>
                <input
                  {...register("customerPhone")}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.customerPhone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pickup Address *
                </label>
                <textarea
                  {...register("pickupAddress")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors.pickupAddress && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.pickupAddress.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Address *
                </label>
                <textarea
                  {...register("deliveryAddress")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors.deliveryAddress && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.deliveryAddress.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Package contents, special handling instructions..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("weight")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Volume (m³)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    {...register("volume")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mode
                  </label>
                  <select
                    {...register("mode")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select mode</option>
                    {transportModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode.charAt(0) + mode.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pickup Time
                  </label>
                  <input
                    type="datetime-local"
                    {...register("pickupTime")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Delivery Time
                  </label>
                  <input
                    type="datetime-local"
                    {...register("deliveryTime")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assigned Rider
                  </label>
                  <input
                    {...register("assignedRider")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Internal Notes
                </label>
                <textarea
                  {...register("internalNotes")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Private notes (not visible to customers)"
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
                  className="flex-1 btn-primary px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Parcel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
