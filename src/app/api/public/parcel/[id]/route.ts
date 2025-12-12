import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const parcel = await Parcel.findOne({ publicId: id }).lean();

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    // Return only public-safe fields (no phone, no internal notes)
    return NextResponse.json({
      parcel: {
        trackingId: parcel.trackingId,
        customerName: parcel.customerName,
        pickupAddress: parcel.pickupAddress,
        deliveryAddress: parcel.deliveryAddress,
        description: parcel.description,
        status: parcel.status,
        deliveryDate: parcel.deliveryDate,
        createdAt: parcel.createdAt,
        updatedAt: parcel.updatedAt,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
