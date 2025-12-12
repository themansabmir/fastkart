import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";
import { verifyAuthTokenEdge } from "@/lib/auth-edge";
import { updateParcelSchema } from "@/lib/validators/parcel";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const parcel = await Parcel.findOne({ publicId: id }).lean();

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json({
      parcel: {
        id: parcel.publicId,
        publicId: parcel.publicId,
        trackingId: parcel.trackingId,
        customerName: parcel.customerName,
        customerPhone: parcel.customerPhone,
        pickupAddress: parcel.pickupAddress,
        deliveryAddress: parcel.deliveryAddress,
        description: parcel.description,
        weight: parcel.weight,
        volume: parcel.volume,
        mode: parcel.mode,
        pickupTime: parcel.pickupTime,
        deliveryTime: parcel.deliveryTime,
        status: parcel.status,
        internalNotes: parcel.internalNotes,
        assignedRider: parcel.assignedRider,
        proofUrls: parcel.proofUrls,
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const ip = getClientIP(req);
    const rateLimitKey = getRateLimitKey(ip, "PATCH:/api/parcels");
    const rateLimit = checkRateLimit(rateLimitKey, {
      windowMs: 60000,
      maxRequests: 30,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateParcelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.pickupTime) {
      updateData.pickupTime = new Date(parsed.data.pickupTime);
    }
    if (parsed.data.deliveryTime) {
      updateData.deliveryTime = new Date(parsed.data.deliveryTime);
    }

    const parcel = await Parcel.findOneAndUpdate(
      { publicId: id },
      { $set: updateData },
      { new: true }
    ).lean();

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json({
      parcel: {
        id: parcel.publicId,
        trackingId: parcel.trackingId,
        customerName: parcel.customerName,
        status: parcel.status,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const parcel = await Parcel.findOneAndDelete({ publicId: id });

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
