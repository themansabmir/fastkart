import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";
import { verifyAuthTokenEdge } from "@/lib/auth-edge";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [total, statusCounts, recentParcels, dailyCounts] = await Promise.all(
      [
        Parcel.countDocuments(),
        Parcel.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Parcel.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select("publicId trackingId customerName status createdAt")
          .lean(),
        Parcel.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]
    );

    const statusMap: Record<string, number> = {
      PENDING: 0,
      PICKED_UP: 0,
      IN_TRANSIT: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      RETURNED: 0,
    };

    for (const item of statusCounts) {
      if (item._id && item._id in statusMap) {
        statusMap[item._id] = item.count;
      }
    }

    return NextResponse.json({
      total,
      byStatus: statusMap,
      recentParcels: recentParcels.map((p) => ({
        id: p.publicId,
        trackingId: p.trackingId,
        customerName: p.customerName,
        status: p.status,
        createdAt: p.createdAt,
      })),
      dailyCounts: dailyCounts.map((d) => ({
        date: d._id,
        count: d.count,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
