"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useParcels, useCreateParcel, useUpdateParcel } from "@/hooks/use-parcels";
import { useCustomers, useCreateCustomer } from "@/hooks/use-customers";
import { getStatusLabel, getStatusColor, formatDateTime } from "@/lib/utils";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Copy,
  Check,
  Loader2,
  Truck,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";

const statuses = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "RETURNED",
];

const transportModes = ["AIR", "TRUCK", "TRAIN"];

export default function ParcelsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerComboboxOpen, setCustomerComboboxOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  // Read filters from URL query params on mount
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam && statuses.includes(statusParam)) {
      setSelectedStatuses([statusParam]);
    }
    
    const customerIdParam = searchParams.get("customerId");
    if (customerIdParam) {
      setSelectedCustomerFilter(customerIdParam);
    }
  }, [searchParams]);

  const copyPublicLink = (publicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/parcel/${publicId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareViaWhatsApp = (phone: string, publicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const trackingUrl = `${window.location.origin}/parcel/${publicId}`;
    const message = `Hi! 👋\n\nYour parcel is on its way! Track your order in real-time on FastKart:\n\n${trackingUrl}\n\nThank you for choosing FastKart! 🚚`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const { data, isLoading, error } = useParcels({
    page,
    limit,
    search,
    status: selectedStatuses.join(","),
    mode: selectedModes.join(","),
    customerId: selectedCustomerFilter,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: customersData } = useCustomers({});
  const createParcel = useCreateParcel();
  const updateParcel = useUpdateParcel();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      description: "",
      weight: "",
      volume: "",
      mode: "",
      pickupDate: "",
      deliveryDate: "",
      expectedDeliveryDate: "",
      status: "PENDING" as const,
      internalNotes: "",
      assignedRider: "",
    },
  });

  const onSubmit = async (formData: Record<string, unknown>) => {
    try {
      if (!selectedCustomerId) {
        return;
      }

      const selectedCustomer = customersData?.customers.find(c => c.id === selectedCustomerId);
      if (!selectedCustomer) {
        return;
      }

      // Convert date strings to ISO datetime strings (set time to noon to avoid timezone issues)
      const pickupTime = formData.pickupDate 
        ? `${formData.pickupDate}T12:00:00` 
        : null;
      const deliveryTime = formData.deliveryDate 
        ? `${formData.deliveryDate}T12:00:00` 
        : null;
      const expectedDeliveryTime = formData.expectedDeliveryDate 
        ? `${formData.expectedDeliveryDate}T12:00:00` 
        : null;

      // Convert numeric fields and handle empty strings
      const payload = {
        ...formData,
        customerId: selectedCustomerId,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        weight: formData.weight ? parseFloat(formData.weight as string) : null,
        volume: formData.volume ? parseFloat(formData.volume as string) : null,
        mode: formData.mode || null,
        pickupTime,
        deliveryTime,
        expectedDeliveryTime,
      };
      await createParcel.mutateAsync(payload);
      setShowCreateModal(false);
      setSelectedCustomerId("");
      reset();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Parcels</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 justify-center"
        >
          <Plus className="h-5 w-5" />
          Add Parcel
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, tracking ID, address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowModeDropdown(false);
              setShowCustomerDropdown(false);
            }}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 min-w-[140px] justify-between ${
              selectedStatuses.length > 0
                ? "border-primary bg-primary/10"
                : "border-input"
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Status</span>
            </div>
            {selectedStatuses.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs text-white bg-primary">
                {selectedStatuses.length}
              </span>
            )}
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px] z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Filter by Status</span>
                {selectedStatuses.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedStatuses([]);
                      setPage(1);
                    }}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStatuses([...selectedStatuses, status]);
                        } else {
                          setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
                        }
                        setPage(1);
                      }}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{getStatusLabel(status)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mode Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowModeDropdown(!showModeDropdown);
              setShowStatusDropdown(false);
              setShowCustomerDropdown(false);
            }}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 min-w-[140px] justify-between ${
              selectedModes.length > 0
                ? "border-primary bg-primary/10"
                : "border-input"
            }`}
          >
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="text-sm">Mode</span>
            </div>
            {selectedModes.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs text-white bg-primary">
                {selectedModes.length}
              </span>
            )}
          </button>
          {showModeDropdown && (
            <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[180px] z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Filter by Mode</span>
                {selectedModes.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedModes([]);
                      setPage(1);
                    }}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {transportModes.map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedModes.includes(mode)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedModes([...selectedModes, mode]);
                        } else {
                          setSelectedModes(selectedModes.filter((m) => m !== mode));
                        }
                        setPage(1);
                      }}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCustomerDropdown(!showCustomerDropdown);
              setShowStatusDropdown(false);
              setShowModeDropdown(false);
            }}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 min-w-[140px] justify-between ${
              selectedCustomerFilter
                ? "border-primary bg-primary/10"
                : "border-input"
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Customer</span>
            </div>
            {selectedCustomerFilter && (
              <span className="px-2 py-0.5 rounded-full text-xs text-white bg-primary">
                1
              </span>
            )}
          </button>
          {showCustomerDropdown && (
            <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[250px] z-10 max-h-[300px] overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Filter by Customer</span>
                {selectedCustomerFilter && (
                  <button
                    onClick={() => {
                      setSelectedCustomerFilter("");
                      setPage(1);
                    }}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {customersData?.customers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomerFilter(customer.id);
                      setShowCustomerDropdown(false);
                      setPage(1);
                    }}
                    className={`w-full text-left p-2 rounded hover:bg-muted text-sm ${
                      selectedCustomerFilter === customer.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.phone}</div>
                  </button>
                ))}
                {(!customersData?.customers || customersData.customers.length === 0) && (
                  <div className="text-sm text-muted-foreground p-2">No customers found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedStatuses.length > 0 || selectedModes.length > 0 || selectedCustomerFilter ? (
          <button
            onClick={() => {
              setSelectedStatuses([]);
              setSelectedModes([]);
              setSelectedCustomerFilter("");
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-input hover:bg-muted transition-colors text-sm"
          >
            Clear All
          </button>
        ) : null}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading parcels...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            Failed to load parcels. Please try again.
          </div>
        ) : data?.parcels.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {search || selectedStatuses.length > 0 || selectedModes.length > 0
              ? "No parcels match your filters."
              : "No parcels yet. Create your first parcel to get started."}
          </div>
        ) : (
          <>
            {/* Pagination - Top */}
            {data && data.pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages} (
                    {data.pagination.total} total)
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Show:</label>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2 py-1 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(data.pagination.totalPages, p + 1)
                      )
                    }
                    disabled={page === data.pagination.totalPages}
                    className="p-2 rounded-lg border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Tracking ID
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Mode
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Pickup Address
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Delivery Address
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Pickup Time
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Delivery Time
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data?.parcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <span>{parcel.trackingId}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(parcel.trackingId);
                              setCopiedId(parcel.trackingId);
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
                            className="p-1 hover:bg-muted rounded transition-colors"
                            title="Copy tracking ID"
                          >
                            {copiedId === parcel.trackingId ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{parcel.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {parcel.customerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{parcel.mode || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-muted-foreground max-w-xs truncate">
                          {parcel.pickupAddress}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-muted-foreground max-w-xs truncate">
                          {parcel.deliveryAddress}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={parcel.status}
                          onChange={(e) => {
                            updateParcel.mutate({
                              id: parcel.id,
                              data: { status: e.target.value },
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          {parcel.pickupTime ? formatDateTime(parcel.pickupTime) : "Not set"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          {parcel.deliveryTime ? formatDateTime(parcel.deliveryTime) : "Not set"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setNavigatingTo(parcel.id);
                              router.push(`/parcels/${parcel.id}`);
                            }}
                            disabled={navigatingTo === parcel.id}
                            className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1"
                            title="View details"
                          >
                            {navigatingTo === parcel.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "View"
                            )}
                          </button>
                          <button
                            onClick={(e) => shareViaWhatsApp(parcel.customerPhone, parcel.publicId, e)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Share via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPublicLink(parcel.publicId, e);
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Copy public tracking link"
                          >
                            {copiedId === parcel.publicId ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden divide-y divide-border">
              {data?.parcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className="p-3 hover:bg-muted/50 transition-colors"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(parcel.trackingId);
                            setCopiedId(parcel.trackingId);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {copiedId === parcel.trackingId ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          )}
                        </button>
                        <p className="text-xs font-mono text-muted-foreground truncate">
                          {parcel.trackingId}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">{parcel.customerName}</p>
                      <p className="text-xs text-muted-foreground">{parcel.customerPhone}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(
                        parcel.status
                      )}`}
                    >
                      {getStatusLabel(parcel.status)}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <p className="text-muted-foreground">Mode</p>
                      <p className="font-medium">{parcel.mode || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pickup Time</p>
                      <p className="font-medium">{parcel.pickupTime ? formatDateTime(parcel.pickupTime).split(',')[0] : "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery Time</p>
                      <p className="font-medium">{parcel.deliveryTime ? formatDateTime(parcel.deliveryTime).split(',')[0] : "-"}</p>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="space-y-1 text-xs mb-3">
                    <div>
                      <p className="text-muted-foreground">Pickup</p>
                      <p className="text-foreground line-clamp-1">{parcel.pickupAddress}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery</p>
                      <p className="text-foreground line-clamp-1">{parcel.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setNavigatingTo(parcel.id);
                        router.push(`/parcels/${parcel.id}`);
                      }}
                      disabled={navigatingTo === parcel.id}
                      className="flex-1 px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {navigatingTo === parcel.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "View"
                      )}
                    </button>
                    <button
                      onClick={(e) => shareViaWhatsApp(parcel.customerPhone, parcel.publicId, e)}
                      className="px-3 py-1.5 text-xs border border-green-200 bg-green-50 rounded hover:bg-green-100 transition-colors"
                      title="Share via WhatsApp"
                    >
                      <MessageCircle className="h-3 w-3 text-green-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyPublicLink(parcel.publicId, e);
                      }}
                      className="px-3 py-1.5 text-xs border border-input rounded hover:bg-muted transition-colors"
                      title="Copy public link"
                    >
                      {copiedId === parcel.publicId ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages} (
                    {data.pagination.total} total)
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Show:</label>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2 py-1 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(data.pagination.totalPages, p + 1)
                      )
                    }
                    disabled={page === data.pagination.totalPages}
                    className="p-2 rounded-lg border border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Add New Parcel</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  reset();
                }}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCustomerComboboxOpen(!customerComboboxOpen)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-left flex items-center justify-between"
                  >
                    <span className={selectedCustomerId ? "text-foreground" : "text-muted-foreground"}>
                      {selectedCustomerId
                        ? customersData?.customers.find((c) => c.id === selectedCustomerId)?.name || "Select a customer"
                        : "Select a customer"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {customerComboboxOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search customers..."
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto">
                        {customersData?.customers
                          .filter((customer) =>
                            customerSearchQuery
                              ? customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                                customer.phone.includes(customerSearchQuery) ||
                                customer.businessName?.toLowerCase().includes(customerSearchQuery.toLowerCase())
                              : true
                          )
                          .map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => {
                                setSelectedCustomerId(customer.id);
                                setCustomerComboboxOpen(false);
                                setCustomerSearchQuery("");
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors ${
                                selectedCustomerId === customer.id ? "bg-primary/10" : ""
                              }`}
                            >
                              <div className="font-medium text-sm">{customer.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {customer.phone}
                                {customer.businessName && ` • ${customer.businessName}`}
                              </div>
                            </button>
                          ))}
                        {customersData?.customers.filter((customer) =>
                          customerSearchQuery
                            ? customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                              customer.phone.includes(customerSearchQuery) ||
                              customer.businessName?.toLowerCase().includes(customerSearchQuery.toLowerCase())
                            : true
                        ).length === 0 && (
                          <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                            No customers found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {!selectedCustomerId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Please select a customer from the list
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pickup Address *
                </label>
                <textarea
                  {...register("pickupAddress")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors.pickupAddress && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.pickupAddress.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Address *
                </label>
                <textarea
                  {...register("deliveryAddress")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors.deliveryAddress && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.deliveryAddress.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Package contents, special handling instructions..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("weight")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Volume (m³)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    {...register("volume")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mode *
                  </label>
                  <select
                    {...register("mode", { required: "Mode is required" })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select mode</option>
                    {transportModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode.charAt(0) + mode.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  {errors.mode && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.mode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    {...register("pickupDate")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    {...register("deliveryDate")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expected Delivery
                  </label>
                  <input
                    type="date"
                    {...register("expectedDeliveryDate")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assigned Rider
                  </label>
                  <input
                    {...register("assignedRider")}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Internal Notes
                </label>
                <textarea
                  {...register("internalNotes")}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Private notes (not visible to customers)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    reset();
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-input hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Parcel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
