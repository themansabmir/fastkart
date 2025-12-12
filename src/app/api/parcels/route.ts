import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";
import { verifyAuthToken } from "@/lib/auth";
import { createParcelSchema } from "@/lib/validators/parcel";
import { generatePublicId, generateTrackingId } from "@/lib/utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
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

    return NextResponse.json({
      parcels: parcels.map((p) => ({
        id: p.publicId,
        trackingId: p.trackingId,
        customerName: p.customerName,
        customerPhone: p.customerPhone,
        pickupAddress: p.pickupAddress,
        deliveryAddress: p.deliveryAddress,
        description: p.description,
        status: p.status,
        internalNotes: p.internalNotes,
        deliveryDate: p.deliveryDate,
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
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const ip = getClientIP(req);
    const rateLimitKey = getRateLimitKey(ip, "POST:/api/parcels");
    const rateLimit = checkRateLimit(rateLimitKey, {
      windowMs: 60000,
      maxRequests: 20,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = createParcelSchema.safeParse(body);

    if (!parsed.success) {
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
      deliveryDate: parsed.data.deliveryDate
        ? new Date(parsed.data.deliveryDate)
        : null,
      createdBy: payload.userId,
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
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
