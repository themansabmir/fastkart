"use client";

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
  const { data, isLoading, error } = useParcelStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-lg p-6 border border-border animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-20 mb-2" />
              <div className="h-8 bg-muted rounded w-12" />
            </div>
          ))}
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
        <div
          className="bg-card rounded-lg p-6 border-2"
          style={{ borderColor: "#ff7a00" }}
        >
          <p className="text-sm text-muted-foreground mb-1">Total Parcels</p>
          <p className="text-3xl font-bold" style={{ color: "#ff7a00" }}>
            {stats.total}
          </p>
        </div>

        {Object.entries(stats.byStatus).map(([status, count]) => {
          const Icon = statusIcons[status] || Package;
          return (
            <div
              key={status}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {getStatusLabel(status)}
                </p>
              </div>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Chart - Simple bar visualization */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">Parcels by Status</h2>
        <div className="space-y-3">
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const percentage =
              stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{getStatusLabel(status)}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: "#ff7a00",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily counts chart */}
      {stats.dailyCounts.length > 0 && (
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Parcels (Last 7 Days)</h2>
          <div className="flex items-end gap-2 h-32">
            {stats.dailyCounts.map((day) => {
              const maxCount = Math.max(
                ...stats.dailyCounts.map((d) => d.count)
              );
              const height =
                maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs text-muted-foreground">
                    {day.count}
                  </span>
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${Math.max(height, 4)}%`,
                      backgroundColor: "#ff7a00",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              <Link
                key={parcel.id}
                href={`/parcels/${parcel.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{parcel.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {parcel.trackingId}
                  </p>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
