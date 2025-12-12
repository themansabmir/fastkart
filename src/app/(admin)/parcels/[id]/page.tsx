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
    <div className="space-y-6">
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
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={updateParcel.isPending}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                parcel.status === status
                  ? "text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
              style={
                parcel.status === status ? { backgroundColor: "#ff7a00" } : {}
              }
            >
              {updateParcel.isPending && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {getStatusLabel(status)}
            </button>
          ))}
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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">
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
                <p className="font-medium">{parcel.customerName}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
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
                <p className="font-medium">{parcel.customerPhone}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
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
                <p>{parcel.pickupAddress}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
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
                <p>{parcel.deliveryAddress}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Description
              </label>
              {isEditing ? (
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background resize-none"
                />
              ) : (
                <p>{parcel.description}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
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
                <p>{parcel.assignedRider || "Not assigned"}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
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
                <p className="text-muted-foreground">
                  {parcel.internalNotes || "No notes"}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    parcel.status
                  )}`}
                >
                  {getStatusLabel(parcel.status)}
                </span>
              </p>
            </div>
          </div>
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
