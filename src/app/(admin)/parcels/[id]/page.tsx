"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useParcel, useUpdateParcel, useDeleteParcel } from "@/hooks/use-parcels";
import { getStatusLabel, getStatusColor, formatDateTime } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import {
  ArrowLeft,
  Copy,
  Trash2,
  Edit2,
  X,
  Check,
  Package,
  Clock,
  Truck,
  MapPin,
  CheckCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const statuses = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "RETURNED",
];

const statusTimeline = [
  { status: "PENDING", icon: Clock, label: "Pending" },
  { status: "PICKED_UP", icon: Package, label: "Picked Up" },
  { status: "IN_TRANSIT", icon: Truck, label: "In Transit" },
  { status: "OUT_FOR_DELIVERY", icon: MapPin, label: "Out for Delivery" },
  { status: "DELIVERED", icon: CheckCircle, label: "Delivered" },
];

export default function ParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useParcel(id);
  const updateParcel = useUpdateParcel();
  const deleteParcel = useDeleteParcel();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const parcel = data?.parcel;

  const handleBackClick = () => {
    setIsNavigatingBack(true);
    router.push("/parcels");
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/parcel/${id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Public link copied to clipboard", variant: "success" });
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateParcel.mutateAsync({ id, data: { status: newStatus } });
  };

  const handleSaveEdit = async () => {
    await updateParcel.mutateAsync({ id, data: editData });
    setIsEditing(false);
    setEditData({});
  };

  const handleDelete = async () => {
    await deleteParcel.mutateAsync(id);
    router.push("/parcels");
  };

  const startEdit = () => {
    if (parcel) {
      setEditData({
        customerName: parcel.customerName,
        customerPhone: parcel.customerPhone,
        pickupAddress: parcel.pickupAddress,
        deliveryAddress: parcel.deliveryAddress,
        description: parcel.description,
        internalNotes: parcel.internalNotes || "",
        assignedRider: parcel.assignedRider || "",
        pickupTime: parcel.pickupTime ? new Date(parcel.pickupTime).toISOString().slice(0, 16) : "",
        deliveryTime: parcel.deliveryTime ? new Date(parcel.deliveryTime).toISOString().slice(0, 16) : "",
        expectedDeliveryTime: parcel.expectedDeliveryTime ? new Date(parcel.expectedDeliveryTime).toISOString().slice(0, 16) : "",
      });
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/parcels"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        </div>
        <div className="bg-card rounded-lg p-6 border border-border animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-4 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !parcel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/parcels"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Parcel Not Found</h1>
        </div>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          This parcel could not be found or you don&apos;t have access to it.
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusTimeline.findIndex(
    (s) => s.status === parcel.status
  );

  return (
    <div className="space-y-6 relative">
      {/* Full Page Loader Overlay */}
      {updateParcel.isPending && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-card rounded-lg p-6 flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm font-medium">Updating parcel...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackClick}
            disabled={isNavigatingBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isNavigatingBack ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <ArrowLeft className="h-5 w-5" />
            )}
          </button>
          <div>
            <h1 className="text-2xl font-bold">{parcel.trackingId}</h1>
            <p className="text-muted-foreground">{parcel.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyPublicLink}
            className="px-4 py-2 rounded-lg border border-input hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </button>
          {!isEditing && (
            <button
              onClick={startEdit}
              className="px-4 py-2 rounded-lg border border-input hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Status Timeline */}
      {parcel.status !== "RETURNED" && (
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
          <div className="flex items-center justify-between">
            {statusTimeline.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <div
                  key={step.status}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="relative flex items-center w-full">
                    {index > 0 && (
                      <div
                        className={`absolute left-0 right-1/2 h-1 -translate-y-1/2 top-1/2 ${
                          isCompleted ? "bg-primary" : "bg-muted"
                        }`}
                        style={isCompleted ? { backgroundColor: "#ff7a00" } : {}}
                      />
                    )}
                    {index < statusTimeline.length - 1 && (
                      <div
                        className={`absolute left-1/2 right-0 h-1 -translate-y-1/2 top-1/2 ${
                          index < currentStatusIndex ? "bg-primary" : "bg-muted"
                        }`}
                        style={
                          index < currentStatusIndex
                            ? { backgroundColor: "#ff7a00" }
                            : {}
                        }
                      />
                    )}
                    <div
                      className={`relative z-10 mx-auto w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                      style={isCompleted ? { backgroundColor: "#ff7a00" } : {}}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <span
                    className={`mt-2 text-xs text-center ${
                      isCurrent ? "font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Status Update */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">Update Status</h2>
        <div className="flex items-center gap-3">
          <select
            value={parcel.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updateParcel.isPending}
            className="px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm font-medium min-w-[200px]"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
          {updateParcel.isPending && (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
        </div>
      </div>

      {/* Parcel Details */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Parcel Details</h2>
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData({});
                }}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={updateParcel.isPending}
                className="p-2 hover:bg-muted rounded-lg text-green-600"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Customer Info Row */}
        <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-border">
          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Customer Name
            </label>
            {isEditing ? (
              <input
                value={editData.customerName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, customerName: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
              />
            ) : (
              <p className="text-lg font-semibold text-foreground mt-1">{parcel.customerName}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Customer Phone
            </label>
            {isEditing ? (
              <input
                value={editData.customerPhone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, customerPhone: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
              />
            ) : (
              <a 
                href={`tel:${parcel.customerPhone}`}
                className="text-lg font-semibold text-primary hover:underline mt-1 block"
              >
                {parcel.customerPhone}
              </a>
            )}
          </div>
        </div>

        {/* Times Row */}
        <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-border">
          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Pickup Time
            </label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={editData.pickupTime || ""}
                onChange={(e) =>
                  setEditData({ ...editData, pickupTime: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
              />
            ) : (
              <p className="text-base font-medium text-foreground mt-1">
                {parcel.pickupTime ? formatDateTime(parcel.pickupTime) : <span className="text-muted-foreground">Not set</span>}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Delivery Time
            </label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={editData.deliveryTime || ""}
                onChange={(e) =>
                  setEditData({ ...editData, deliveryTime: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
              />
            ) : (
              <p className="text-base font-medium text-foreground mt-1">
                {parcel.deliveryTime ? formatDateTime(parcel.deliveryTime) : <span className="text-muted-foreground">Not set</span>}
              </p>
            )}
          </div>
        </div>

        {/* Expected Delivery Time */}
        <div className="pb-6 border-b border-border">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Expected Delivery Time
          </label>
          {isEditing ? (
            <input
              type="datetime-local"
              value={editData.expectedDeliveryTime || ""}
              onChange={(e) =>
                setEditData({ ...editData, expectedDeliveryTime: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
            />
          ) : (
            <p className="text-base font-medium text-foreground mt-1">
              {parcel.expectedDeliveryTime ? formatDateTime(parcel.expectedDeliveryTime) : <span className="text-muted-foreground">Not set</span>}
            </p>
          )}
        </div>

        {/* Addresses Row */}
        <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-border">
          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Pickup Address
            </label>
            {isEditing ? (
              <textarea
                value={editData.pickupAddress || ""}
                onChange={(e) =>
                  setEditData({ ...editData, pickupAddress: e.target.value })
                }
                rows={2}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background resize-none"
              />
            ) : (
              <p className="text-base text-foreground mt-1">{parcel.pickupAddress}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Delivery Address
            </label>
            {isEditing ? (
              <textarea
                value={editData.deliveryAddress || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    deliveryAddress: e.target.value,
                  })
                }
                rows={2}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background resize-none"
              />
            ) : (
              <p className="text-base text-foreground mt-1">{parcel.deliveryAddress}</p>
            )}
          </div>
        </div>

        {/* Parcel Details Row */}
        <div className="grid md:grid-cols-3 gap-6 pb-6 border-b border-border">
          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Mode
            </label>
            <p className="text-base font-medium text-foreground mt-1">
              {parcel.mode || <span className="text-muted-foreground">Not set</span>}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Weight (kg)
            </label>
            <p className="text-base font-medium text-foreground mt-1">
              {parcel.weight ? `${parcel.weight} kg` : <span className="text-muted-foreground">Not set</span>}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Volume (m³)
            </label>
            <p className="text-base font-medium text-foreground mt-1">
              {parcel.volume ? `${parcel.volume} m³` : <span className="text-muted-foreground">Not set</span>}
            </p>
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="pb-6 border-b border-border">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background resize-none"
            />
          ) : (
            <p className="text-base text-foreground mt-1">{parcel.description}</p>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Assigned Rider
            </label>
            {isEditing ? (
              <input
                value={editData.assignedRider || ""}
                onChange={(e) =>
                  setEditData({ ...editData, assignedRider: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="Not assigned"
              />
            ) : (
              <p className="text-base text-foreground mt-1">{parcel.assignedRider || <span className="text-muted-foreground">Not assigned</span>}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </label>
            <p className="mt-1">
              <span
                className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                  parcel.status
                )}`}
              >
                {getStatusLabel(parcel.status)}
              </span>
            </p>
          </div>
        </div>

        {/* Internal Notes - Full Width */}
        <div className="pt-6 border-t border-border">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Internal Notes
          </label>
          {isEditing ? (
            <textarea
              value={editData.internalNotes || ""}
              onChange={(e) =>
                setEditData({ ...editData, internalNotes: e.target.value })
              }
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background resize-none"
              placeholder="Private notes..."
            />
          ) : (
            <p className="text-base text-muted-foreground italic mt-1">
              {parcel.internalNotes || "No notes"}
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Created:</span>{" "}
            {formatDateTime(parcel.createdAt)}
          </div>
          <div>
            <span className="text-muted-foreground">Updated:</span>{" "}
            {formatDateTime(parcel.updatedAt)}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Parcel?</h2>
            <p className="text-muted-foreground mb-6">
              This action cannot be undone. The parcel and all its data will be
              permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-input hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteParcel.isPending}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteParcel.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
