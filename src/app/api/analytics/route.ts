import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Set time to start/end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Get all parcels within date range
    const parcels = await Parcel.find({
      createdAt: { $gte: start, $lte: end },
    })
      .populate("customer", "name phone")
      .lean();

    // 1. Total parcels delivered per month
    const monthlyDeliveries: Record<string, number> = {};
    parcels.forEach((parcel) => {
      const month = new Date(parcel.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      monthlyDeliveries[month] = (monthlyDeliveries[month] || 0) + 1;
    });

    // 2. Parcels by mode (Air/Train/Truck)
    const byMode: Record<string, number> = {
      AIR: 0,
      TRAIN: 0,
      TRUCK: 0,
    };
    parcels.forEach((parcel) => {
      if (parcel.mode && byMode[parcel.mode] !== undefined) {
        byMode[parcel.mode]++;
      }
    });

    // 3. Parcels by status
    const byStatus: Record<string, number> = {};
    parcels.forEach((parcel) => {
      byStatus[parcel.status] = (byStatus[parcel.status] || 0) + 1;
    });

    // 4. Top customers by parcel count
    const customerCounts: Record<string, { name: string; count: number; phone: string }> = {};
    parcels.forEach((parcel: any) => {
      if (parcel.customer) {
        const customerId = parcel.customer._id.toString();
        const customerName = parcel.customer.name || "Unknown";
        const customerPhone = parcel.customer.phone || "";
        
        if (!customerCounts[customerId]) {
          customerCounts[customerId] = { name: customerName, count: 0, phone: customerPhone };
        }
        customerCounts[customerId].count++;
      }
    });

    const topCustomers = Object.entries(customerCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 5. Daily trends (for line chart)
    const dailyTrends: Record<string, number> = {};
    parcels.forEach((parcel) => {
      const day = new Date(parcel.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyTrends[day] = (dailyTrends[day] || 0) + 1;
    });

    // 6. Mode breakdown by month
    const modeByMonth: Record<string, Record<string, number>> = {};
    parcels.forEach((parcel) => {
      const month = new Date(parcel.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      if (!modeByMonth[month]) {
        modeByMonth[month] = { AIR: 0, TRAIN: 0, TRUCK: 0 };
      }
      if (parcel.mode && modeByMonth[month][parcel.mode] !== undefined) {
        modeByMonth[month][parcel.mode]++;
      }
    });

    // 7. Average delivery time (for delivered parcels)
    const deliveredParcels = parcels.filter(
      (p: any) => p.status === "DELIVERED" && p.pickupTime && p.deliveryTime
    );
    const avgDeliveryTime =
      deliveredParcels.length > 0
        ? deliveredParcels.reduce((sum: number, p: any) => {
            const pickup = new Date(p.pickupTime!).getTime();
            const delivery = new Date(p.deliveryTime!).getTime();
            return sum + (delivery - pickup) / (1000 * 60 * 60 * 24); // days
          }, 0) / deliveredParcels.length
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
        summary: {
          totalParcels: parcels.length,
          deliveredParcels: byStatus.DELIVERED || 0,
          inTransit: byStatus.IN_TRANSIT || 0,
          avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
        },
        monthlyDeliveries: Object.entries(monthlyDeliveries).map(([month, count]) => ({
          month,
          count,
        })),
        byMode: Object.entries(byMode).map(([mode, count]) => ({
          mode,
          count,
        })),
        byStatus: Object.entries(byStatus).map(([status, count]) => ({
          status,
          count,
        })),
        topCustomers,
        dailyTrends: Object.entries(dailyTrends).map(([day, count]) => ({
          day,
          count,
        })),
        modeByMonth: Object.entries(modeByMonth).map(([month, modes]) => ({
          month,
          ...modes,
        })),
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
