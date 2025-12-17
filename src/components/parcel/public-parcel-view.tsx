"use client";

import { useState, useEffect } from "react";
import { getStatusLabel, formatDateTime } from "@/lib/utils";
import {
    Package,
    Clock,
    Truck,
    MapPin,
    CheckCircle,
    RotateCcw,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface PublicParcel {
    trackingId: string;
    customerName: string;
    pickupAddress: string;
    deliveryAddress: string;
    description: string;
    weight?: number | null;
    volume?: number | null;
    count?: number | null;
    mode?: string | null;
    pickupTime?: string | null;
    deliveryTime?: string | null;
    expectedDeliveryTime?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const statusTimeline = [
    { status: "PENDING", icon: Clock, label: "Pending", description: "Your parcel is being prepared" },
    { status: "PICKED_UP", icon: Package, label: "Picked Up", description: "Parcel has been collected" },
    { status: "IN_TRANSIT", icon: Truck, label: "In Transit", description: "On the way to destination" },
    { status: "OUT_FOR_DELIVERY", icon: MapPin, label: "Out for Delivery", description: "Will arrive today" },
    { status: "DELIVERED", icon: CheckCircle, label: "Delivered", description: "Successfully delivered" },
];

const statusDescriptions: Record<string, string> = {
    PENDING: "Your parcel has been registered and is waiting to be picked up by our courier.",
    PICKED_UP: "Our courier has collected your parcel and it's now in our system.",
    IN_TRANSIT: "Your parcel is on its way! It's currently being transported to the delivery area.",
    OUT_FOR_DELIVERY: "Great news! Your parcel is out for delivery and should arrive today.",
    DELIVERED: "Your parcel has been successfully delivered. Thank you for using FastKart!",
    RETURNED: "This parcel has been returned to the sender.",
};

export function PublicParcelView({ id }: { id: string }) {
    const [parcel, setParcel] = useState<PublicParcel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchParcel = async () => {
        try {
            const res = await fetch(`/api/public/parcel/${id}`);
            if (!res.ok) {
                if (res.status === 404) {
                    setError("Parcel not found");
                } else {
                    setError("Failed to load parcel");
                }
                setParcel(null);
            } else {
                const data = await res.json();
                setParcel(data.parcel);
                setError(null);
            }
        } catch {
            setError("Something went wrong");
            setParcel(null);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchParcel();
    }, [id]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchParcel();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                    Loading parcel information...
                </div>
            </div>
        );
    }

    if (error || !parcel) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-2xl mx-auto px-4 py-12">
                    <div className="text-center mb-8">
                        <Link href="/" className="text-2xl font-bold" style={{ color: "#ff7a00" }}>
                            FastKart
                        </Link>
                        <p className="text-muted-foreground">Parcel Tracking</p>
                    </div>
                    <div className="bg-card rounded-lg p-8 border border-border text-center">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Parcel Not Found</h2>
                        <p className="text-muted-foreground">
                            We couldn&apos;t find a parcel with this tracking link. Please check the
                            URL and try again.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const currentStatusIndex = statusTimeline.findIndex(
        (s) => s.status === parcel.status
    );
    const isReturned = parcel.status === "RETURNED";

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold" style={{ color: "#ff7a00" }}>
                        FastKart
                    </Link>
                    <p className="text-muted-foreground">Parcel Tracking</p>
                </div>

                {/* Tracking ID Card */}
                <div
                    className="bg-card rounded-lg p-6 border-2 mb-6"
                    style={{ borderColor: "#ff7a00" }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Tracking ID</p>
                            <p className="text-xl font-mono font-bold">{parcel.trackingId}</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Refresh status"
                        >
                            <RefreshCw
                                className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Current Status */}
                <div className="bg-card rounded-lg p-6 border border-border mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        {isReturned ? (
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600"
                            >
                                <RotateCcw className="h-6 w-6" />
                            </div>
                        ) : (
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: "#ff7a00" }}
                            >
                                {(() => {
                                    const Icon =
                                        statusTimeline[currentStatusIndex]?.icon || Package;
                                    return <Icon className="h-6 w-6" />;
                                })()}
                            </div>
                        )}
                        <div>
                            <p className="text-lg font-semibold">
                                {getStatusLabel(parcel.status)}
                            </p>
                            <p className="text-muted-foreground">
                                {statusDescriptions[parcel.status]}
                            </p>
                        </div>
                    </div>

                    {parcel.expectedDeliveryTime && (
                        <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">
                                Expected Delivery
                            </p>
                            <p className="font-medium">
                                {formatDateTime(parcel.expectedDeliveryTime)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Status Timeline */}
                {!isReturned && (
                    <div className="bg-card rounded-lg p-6 border border-border mb-6">
                        <h2 className="text-lg font-semibold mb-6">Delivery Progress</h2>
                        <div className="space-y-4">
                            {statusTimeline.map((step, index) => {
                                const isCompleted = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;
                                return (
                                    <div key={step.status} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                                        ? "text-white"
                                                        : "bg-muted text-muted-foreground"
                                                    }`}
                                                style={
                                                    isCompleted ? { backgroundColor: "#ff7a00" } : {}
                                                }
                                            >
                                                <step.icon className="h-5 w-5" />
                                            </div>
                                            {index < statusTimeline.length - 1 && (
                                                <div
                                                    className={`w-0.5 h-8 mt-2 ${index < currentStatusIndex
                                                            ? "bg-primary"
                                                            : "bg-muted"
                                                        }`}
                                                    style={
                                                        index < currentStatusIndex
                                                            ? { backgroundColor: "#ff7a00" }
                                                            : {}
                                                    }
                                                />
                                            )}
                                        </div>
                                        <div className="pt-2">
                                            <p
                                                className={`font-medium ${isCurrent ? "" : "text-muted-foreground"
                                                    }`}
                                                style={isCurrent ? { color: "#ff7a00" } : {}}
                                            >
                                                {step.label}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Customer Details */}
                <div className="bg-card rounded-lg p-6 border border-border mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Customer Details
                    </h2>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Recipient Name
                        </label>
                        <p className="text-lg font-semibold text-foreground mt-1">{parcel.customerName}</p>
                    </div>
                </div>

                {/* Pickup Details */}
                <div className="bg-card rounded-lg p-6 border border-border mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Pickup Details
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Pickup Address
                            </label>
                            <p className="text-base text-foreground mt-1">{parcel.pickupAddress}</p>
                        </div>
                        {parcel.pickupTime && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Pickup Date
                                </label>
                                <p className="text-base font-medium text-foreground mt-1">
                                    {formatDateTime(parcel.pickupTime)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delivery Details */}
                <div className="bg-card rounded-lg p-6 border border-border mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Delivery Details
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Delivery Address
                            </label>
                            <p className="text-base text-foreground mt-1">{parcel.deliveryAddress}</p>
                        </div>
                        {(parcel.expectedDeliveryTime || parcel.deliveryTime) && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {parcel.expectedDeliveryTime && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Expected Delivery Date
                                        </label>
                                        <p className="text-base font-medium text-foreground mt-1">
                                            {formatDateTime(parcel.expectedDeliveryTime)}
                                        </p>
                                    </div>
                                )}
                                {parcel.deliveryTime && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Actual Delivery Date
                                        </label>
                                        <p className="text-base font-medium text-foreground mt-1">
                                            {formatDateTime(parcel.deliveryTime)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Parcel Details */}
                <div className="bg-card rounded-lg p-6 border border-border mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Parcel Details
                    </h2>
                    <div className="space-y-4">
                        {(parcel.mode || parcel.weight || parcel.volume || parcel.count) && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {parcel.mode && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Mode
                                        </label>
                                        <p className="text-base font-medium text-foreground mt-1">
                                            {parcel.mode}
                                        </p>
                                    </div>
                                )}

                                {parcel.weight && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Weight (kg)
                                        </label>
                                        <p className="text-base font-medium text-foreground mt-1">
                                            {parcel.weight} kg
                                        </p>
                                    </div>
                                )}

                                {parcel.volume && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Volume (m³)
                                        </label>
                                        <p className="text-base font-medium text-foreground mt-1">
                                            {parcel.volume} m³
                                        </p>
                                    </div>
                                )}

                                {parcel.count && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Parcel Count
                                        </label>
                                        <p className="text-base font-medium text-foreground mt-1">
                                            {parcel.count}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Description
                            </label>
                            <p className="text-base text-foreground mt-1">{parcel.description}</p>
                        </div>

                        <div className="pt-4 border-t border-border text-sm text-muted-foreground">
                            <p>Last updated: {formatDateTime(parcel.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-muted-foreground">
                    <p>Powered by FastKart Courier Services</p>
                </div>
            </div>
        </div>
    );
}
