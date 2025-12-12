import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";
import { verifyAuthTokenEdge } from "@/lib/auth-edge";
import { updateParcelSchema } from "@/lib/validators/parcel";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
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
  logger.api.request("GET", `/api/parcels/${id}`, { ip });

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      logger.warn("Unauthorized request - no token", { route: `/api/parcels/${id}`, method: "GET", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      logger.warn("Unauthorized request - invalid token", { route: `/api/parcels/${id}`, method: "GET", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const parcel = await Parcel.findOne({ publicId: id }).lean();

    if (!parcel) {
      logger.warn("Parcel not found", { route: `/api/parcels/${id}`, method: "GET", ip, parcelId: id });
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    logger.api.response("GET", `/api/parcels/${id}`, 200, Date.now() - start, { userId: payload.userId, parcelId: id });

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
  } catch (error) {
    logger.api.error("GET", `/api/parcels/${id}`, error, { ip });
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
  const start = Date.now();
  const ip = getClientIP(req);
  const { id } = await params;
  logger.api.request("PATCH", `/api/parcels/${id}`, { ip });

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      logger.warn("Unauthorized request - no token", { route: `/api/parcels/${id}`, method: "PATCH", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      logger.warn("Unauthorized request - invalid token", { route: `/api/parcels/${id}`, method: "PATCH", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(ip, "PATCH:/api/parcels");
    const rateLimit = checkRateLimit(rateLimitKey, {
      windowMs: 60000,
      maxRequests: 30,
    });

    if (!rateLimit.allowed) {
      logger.warn("Rate limit exceeded", { route: `/api/parcels/${id}`, method: "PATCH", ip, userId: payload.userId });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = updateParcelSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn("Validation failed", { route: `/api/parcels/${id}`, method: "PATCH", ip, errors: parsed.error.flatten() });
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
      logger.warn("Parcel not found", { route: `/api/parcels/${id}`, method: "PATCH", ip, parcelId: id });
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    logger.api.response("PATCH", `/api/parcels/${id}`, 200, Date.now() - start, {
      userId: payload.userId,
      parcelId: id,
      updatedFields: Object.keys(parsed.data),
    });

    return NextResponse.json({
      parcel: {
        id: parcel.publicId,
        trackingId: parcel.trackingId,
        customerName: parcel.customerName,
        status: parcel.status,
        updatedAt: parcel.updatedAt,
      },
    });
  } catch (error) {
    logger.api.error("PATCH", `/api/parcels/${id}`, error, { ip });
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
  const start = Date.now();
  const ip = getClientIP(req);
  const { id } = await params;
  logger.api.request("DELETE", `/api/parcels/${id}`, { ip });

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      logger.warn("Unauthorized request - no token", { route: `/api/parcels/${id}`, method: "DELETE", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      logger.warn("Unauthorized request - invalid token", { route: `/api/parcels/${id}`, method: "DELETE", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const parcel = await Parcel.findOneAndDelete({ publicId: id });

    if (!parcel) {
      logger.warn("Parcel not found for deletion", { route: `/api/parcels/${id}`, method: "DELETE", ip, parcelId: id });
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    logger.api.response("DELETE", `/api/parcels/${id}`, 200, Date.now() - start, {
      userId: payload.userId,
      parcelId: id,
      trackingId: parcel.trackingId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.api.error("DELETE", `/api/parcels/${id}`, error, { ip });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
