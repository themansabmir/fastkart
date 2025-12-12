import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Customer } from "@/lib/models/Customer";
import { verifyAuthTokenEdge } from "@/lib/auth-edge";
import { logger } from "@/lib/logger";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function GET(req: NextRequest) {
  const start = Date.now();
  const ip = getClientIP(req);
  logger.api.request("GET", "/api/customers", { ip });

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      logger.warn("Unauthorized request - no token", { route: "/api/customers", method: "GET", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      logger.warn("Unauthorized request - invalid token", { route: "/api/customers", method: "GET", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "100");

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query)
      .sort({ name: 1 })
      .limit(limit)
      .lean();

    logger.api.response("GET", "/api/customers", 200, Date.now() - start, { 
      userId: payload.userId, 
      count: customers.length 
    });

    return NextResponse.json({
      customers: customers.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        phone: c.phone,
        address: c.address,
        businessName: c.businessName,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });
  } catch (error) {
    logger.api.error("GET", "/api/customers", error, { ip });
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const ip = getClientIP(req);
  logger.api.request("POST", "/api/customers", { ip });

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      logger.warn("Unauthorized request - no token", { route: "/api/customers", method: "POST", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      logger.warn("Unauthorized request - invalid token", { route: "/api/customers", method: "POST", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { name, phone, address, businessName } = body;

    if (!name || !phone || !address) {
      logger.warn("Validation failed - missing required fields", { route: "/api/customers", method: "POST" });
      return NextResponse.json(
        { error: "Name, phone, and address are required" },
        { status: 400 }
      );
    }

    const customer = await Customer.create({
      name,
      phone,
      address,
      businessName: businessName || undefined,
      createdBy: payload.userId,
    });

    logger.api.response("POST", "/api/customers", 201, Date.now() - start, { 
      userId: payload.userId,
      customerId: customer._id.toString()
    });

    return NextResponse.json(
      {
        customer: {
          id: customer._id.toString(),
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          businessName: customer.businessName,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.api.error("POST", "/api/customers", error, { ip });
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
