"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParcelStats } from "@/hooks/use-parcels";
import { getStatusLabel, getStatusColor, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  RotateCcw,
  MapPin,
  Loader2,
} from "lucide-react";

const statusIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  PICKED_UP: Package,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: MapPin,
  DELIVERED: CheckCircle,
  RETURNED: RotateCcw,
};

export default function DashboardPage() {
  const router = useRouter();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const { data, isLoading, error } = useParcelStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  const stats = data!;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          onClick={() => {
            setNavigatingTo("total");
            router.push("/parcels");
          }}
          disabled={navigatingTo === "total"}
          className="bg-card rounded-lg p-6 border hover:shadow-lg transition-all cursor-pointer text-left disabled:opacity-50"
          style={{ borderColor: 'hsl(var(--border))' }}
          onMouseEnter={(e) => {
            if (navigatingTo !== "total") {
              e.currentTarget.style.borderColor = '#ff7a00';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'hsl(var(--border))';
          }}
        >
          <p className="text-sm text-muted-foreground mb-1">Total Parcels</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">
              {stats.total}
            </p>
            {navigatingTo === "total" && (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
          </div>
        </button>

        {Object.entries(stats.byStatus).map(([status, count]) => {
          const Icon = statusIcons[status] || Package;
          return (
            <button
              key={status}
              onClick={() => {
                setNavigatingTo(status);
                router.push(`/parcels?status=${status}`);
              }}
              disabled={navigatingTo === status}
              className="bg-card rounded-lg p-6 border hover:shadow-lg transition-all cursor-pointer text-left disabled:opacity-50"
              style={{ borderColor: 'hsl(var(--border))' }}
              onMouseEnter={(e) => {
                if (navigatingTo !== status) {
                  e.currentTarget.style.borderColor = '#ff7a00';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--border))';
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {getStatusLabel(status)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{count}</p>
                {navigatingTo === status && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Parcels</h2>
          <Link
            href="/parcels"
            className="text-sm hover:underline"
            style={{ color: "#ff7a00" }}
          >
            View all
          </Link>
        </div>
        {stats.recentParcels.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No parcels yet. Create your first parcel to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {stats.recentParcels.map((parcel) => (
              <div
                key={parcel.id}
                onClick={() => {
                  setNavigatingTo(parcel.id);
                  router.push(`/parcels/${parcel.id}`);
                }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {navigatingTo === parcel.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{parcel.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {parcel.trackingId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      parcel.status
                    )}`}
                  >
                    {getStatusLabel(parcel.status)}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(parcel.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
