"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Package, Users, Truck, Plane, Train as TrainIcon, Loader2 } from "lucide-react";

const COLORS = ["#ff7a00", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

interface AnalyticsData {
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalParcels: number;
    deliveredParcels: number;
    inTransit: number;
    avgDeliveryTime: number;
  };
  monthlyDeliveries: Array<{ month: string; count: number }>;
  byMode: Array<{ mode: string; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
  topCustomers: Array<{ id: string; name: string; count: number; phone: string }>;
  dailyTrends: Array<{ day: string; count: number }>;
  modeByMonth: Array<{ month: string; AIR: number; TRAIN: number; TRUCK: number }>;
}

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default dates (1 month ago to today)
  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(oneMonthAgo.toISOString().split("T")[0]);
  }, []);

  // Fetch data when dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalytics();
    }
  }, [startDate, endDate]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/analytics?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError("Failed to load analytics. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "AIR":
        return <Plane className="h-4 w-4" />;
      case "TRAIN":
        return <TrainIcon className="h-4 w-4" />;
      case "TRUCK":
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your parcel delivery operations
          </p>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Date Range</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total Parcels</p>
              </div>
              <p className="text-3xl font-bold">{data.summary.totalParcels}</p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {data.summary.deliveredParcels}
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-muted-foreground">In Transit</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {data.summary.inTransit}
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <p className="text-sm text-muted-foreground">Avg Delivery</p>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {data.summary.avgDeliveryTime}
                <span className="text-sm font-normal ml-1">days</span>
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Deliveries - Line Chart */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Deliveries Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyDeliveries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#ff7a00"
                    strokeWidth={2}
                    name="Parcels"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Parcels by Mode - Pie Chart */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Parcels by Transport Mode</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.byMode}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.mode}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.byMode.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Trends - Bar Chart */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Parcel Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ff7a00" name="Parcels" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Mode by Month - Stacked Bar Chart */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Transport Mode Breakdown by Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.modeByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="AIR" stackId="a" fill="#3b82f6" name="Air" />
                  <Bar dataKey="TRAIN" stackId="a" fill="#10b981" name="Train" />
                  <Bar dataKey="TRUCK" stackId="a" fill="#f59e0b" name="Truck" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Customers Table */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Top 10 Customers</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium">Rank</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Customer Name</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Phone</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Total Parcels</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.topCustomers.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary">#{index + 1}</span>
                      </td>
                      <td className="px-4 py-3 font-medium">{customer.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {customer.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                          {customer.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Parcel Status Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {data.byStatus.map((item, index) => (
                <div
                  key={item.status}
                  className="p-4 rounded-lg border border-border"
                  style={{ borderLeftWidth: "4px", borderLeftColor: COLORS[index % COLORS.length] }}
                >
                  <p className="text-sm text-muted-foreground mb-1">
                    {item.status.replace(/_/g, " ")}
                  </p>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
