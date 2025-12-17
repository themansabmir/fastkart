import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Parcel } from "@/lib/models/Parcel";
import { PublicParcelView } from "@/components/parcel/public-parcel-view";

async function getParcel(id: string) {
  try {
    await connectDB();
    // Try to find parcel by publicId first, then by trackingId
    let parcel = await Parcel.findOne({ publicId: id }).lean();

    if (!parcel) {
      parcel = await Parcel.findOne({ trackingId: id }).lean();
    }
    return parcel;
  } catch (error) {
    console.error("Error fetching parcel for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const parcel = await getParcel(id);

  if (!parcel) {
    return {
      title: "Parcel Not Found - FastKart",
      description: "The requested parcel tracking information could not be found.",
    };
  }

  // Cast parcel to any to access properties safely since lean returns generic object
  const p = parcel as any;
  const statusFormatted = p.status ? p.status.replace(/_/g, ' ') : 'Unknown';

  return {
    title: `Tracking ${p.trackingId} - FastKart Cargo`,
    description: `Track your package ${p.trackingId}. Status: ${statusFormatted}. Current Location: ${p.status === 'DELIVERED' ? p.deliveryAddress : 'In Transit'}.`,
    openGraph: {
      title: `Track Parcel ${p.trackingId} | FastKart`,
      description: `Track your delivery with FastKart Cargo. Current Status: ${statusFormatted}.`,
      type: "website",
      images: ['/og-tracking.png'], // Assuming a default or dynamic image could be here
    },
    twitter: {
      card: "summary_large_image",
      title: `Track Parcel ${p.trackingId} | FastKart`,
      description: `Current Status: ${statusFormatted}. Track now.`,
    },
  };
}

export default async function PublicParcelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PublicParcelView id={id} />;
}
