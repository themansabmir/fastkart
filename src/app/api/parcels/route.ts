import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";
import { verifyAuthTokenEdge } from "@/lib/auth-edge";
import { createParcelSchema } from "@/lib/validators/parcel";
import { generatePublicId, generateTrackingId } from "@/lib/utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function GET(req: NextRequest) {
  const start = Date.now();
  const ip = getClientIP(req);
  logger.api.request("GET", "/api/parcels", { ip });

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      logger.warn("Unauthorized request - no token", { route: "/api/parcels", method: "GET", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      logger.warn("Unauthorized request - invalid token", { route: "/api/parcels", method: "GET", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { trackingId: { $regex: search, $options: "i" } },
        { pickupAddress: { $regex: search, $options: "i" } },
        { deliveryAddress: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const total = await Parcel.countDocuments(query);
    const parcels = await Parcel.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    logger.api.response("GET", "/api/parcels", 200, Date.now() - start, { 
      userId: payload.userId, 
      total,
      page 
    });

    return NextResponse.json({
      parcels: parcels.map((p) => ({
        id: p.publicId,
        publicId: p.publicId,
        trackingId: p.trackingId,
        customerName: p.customerName,
        customerPhone: p.customerPhone,
        pickupAddress: p.pickupAddress,
        deliveryAddress: p.deliveryAddress,
        description: p.description,
        weight: p.weight,
        volume: p.volume,
        mode: p.mode,
        pickupTime: p.pickupTime,
        deliveryTime: p.deliveryTime,
        status: p.status,
        internalNotes: p.internalNotes,
        assignedRider: p.assignedRider,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.api.error("GET", "/api/parcels", error, { ip });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const ip = getClientIP(req);
  logger.api.request("POST", "/api/parcels", { ip });

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      logger.warn("Unauthorized request - no token", { route: "/api/parcels", method: "POST", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      logger.warn("Unauthorized request - invalid token", { route: "/api/parcels", method: "POST", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(ip, "POST:/api/parcels");
    const rateLimit = checkRateLimit(rateLimitKey, {
      windowMs: 60000,
      maxRequests: 20,
    });

    if (!rateLimit.allowed) {
      logger.warn("Rate limit exceeded", { route: "/api/parcels", method: "POST", ip, userId: payload.userId });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = createParcelSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn("Validation failed", { route: "/api/parcels", method: "POST", ip, errors: parsed.error.flatten() });
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const parcel = await Parcel.create({
      ...parsed.data,
      publicId: generatePublicId(),
      trackingId: generateTrackingId(),
      pickupTime: parsed.data.pickupTime
        ? new Date(parsed.data.pickupTime)
        : null,
      deliveryTime: parsed.data.deliveryTime
        ? new Date(parsed.data.deliveryTime)
        : null,
      createdBy: payload.userId,
    });

    logger.api.response("POST", "/api/parcels", 201, Date.now() - start, {
      userId: payload.userId,
      parcelId: parcel.publicId,
      trackingId: parcel.trackingId,
    });

    return NextResponse.json(
      {
        parcel: {
          id: parcel.publicId,
          trackingId: parcel.trackingId,
          customerName: parcel.customerName,
          status: parcel.status,
          createdAt: parcel.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.api.error("POST", "/api/parcels", error, { ip });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
