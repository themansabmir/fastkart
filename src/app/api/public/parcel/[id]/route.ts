import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";
import { logger } from "@/lib/logger";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const start = Date.now();
  const ip = getClientIP(req);
  const { id } = await params;
  logger.api.request("GET", `/api/public/parcel/${id}`, { ip });

  try {
    await connectDB();

    // Try to find parcel by publicId first, then by trackingId
    let parcel = await Parcel.findOne({ publicId: id }).lean();
    
    if (!parcel) {
      parcel = await Parcel.findOne({ trackingId: id }).lean();
    }

    if (!parcel) {
      logger.warn("Public parcel not found", { route: `/api/public/parcel/${id}`, method: "GET", ip, parcelId: id });
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    logger.api.response("GET", `/api/public/parcel/${id}`, 200, Date.now() - start, { parcelId: id });

    // Return only public-safe fields (no phone, no internal notes)
    return NextResponse.json({
      parcel: {
        trackingId: parcel.trackingId,
        customerName: parcel.customerName,
        pickupAddress: parcel.pickupAddress,
        deliveryAddress: parcel.deliveryAddress,
        description: parcel.description,
        weight: parcel.weight,
        volume: parcel.volume,
        count: parcel.count,
        mode: parcel.mode,
        pickupTime: parcel.pickupTime,
        deliveryTime: parcel.deliveryTime,
        expectedDeliveryTime: parcel.expectedDeliveryTime,
        status: parcel.status,
        createdAt: parcel.createdAt,
        updatedAt: parcel.updatedAt,
      },
    });
  } catch (error) {
    logger.api.error("GET", `/api/public/parcel/${id}`, error, { ip });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
