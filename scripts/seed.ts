import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve } from "path";
import { Customer } from "../src/lib/models/Customer";
import { Parcel } from "../src/lib/models/Parcel";
import { v4 as uuidv4 } from "uuid";

// Load environment variables
config({ path: resolve(__dirname, "../.env") });

// Dummy data
const indianCities = [
  { city: "Mumbai", pincode: "400001" },
  { city: "Delhi", pincode: "110001" },
  { city: "Bangalore", pincode: "560001" },
  { city: "Hyderabad", pincode: "500001" },
  { city: "Chennai", pincode: "600001" },
  { city: "Kolkata", pincode: "700001" },
  { city: "Pune", pincode: "411001" },
  { city: "Ahmedabad", pincode: "380001" },
  { city: "Jaipur", pincode: "302001" },
  { city: "Lucknow", pincode: "226001" },
];

const firstNames = [
  "Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Neha",
  "Arjun", "Pooja", "Karan", "Divya", "Sanjay", "Kavita", "Rajesh", "Meera",
  "Aditya", "Ritu", "Manish", "Simran", "Deepak", "Anita", "Suresh", "Nisha",
  "Vivek", "Preeti", "Ashok", "Sunita", "Nikhil", "Swati"
];

const lastNames = [
  "Sharma", "Patel", "Kumar", "Singh", "Reddy", "Gupta", "Verma", "Joshi",
  "Mehta", "Nair", "Rao", "Iyer", "Desai", "Kulkarni", "Agarwal", "Chopra"
];

const businessNames = [
  "Tech Solutions Pvt Ltd", "Global Traders", "Sunrise Enterprises",
  "Metro Logistics", "Digital Services Co", "Prime Retail Store",
  "Elite Consultancy", "Urban Fashion House", "Smart Electronics",
  "Green Organic Foods", null, null, null, null, null // Some customers without business
];

const statuses = ["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "RETURNED"];
const modes = ["AIR", "TRAIN", "TRUCK"];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTrackingId(): string {
  const prefix = "FK";
  const numbers = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${numbers}`;
}

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }
    
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "fastkart",
    });
    console.log("✅ Connected to database");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Customer.deleteMany({});
    await Parcel.deleteMany({});
    console.log("✅ Cleared existing data");

    // Get a user ID for createdBy (dummy ObjectId for seeding)
    const dummyUserId = new mongoose.Types.ObjectId();

    // Create 30 customers
    console.log("👥 Creating 30 customers...");
    const customers = [];
    
    for (let i = 0; i < 30; i++) {
      const firstName = randomElement(firstNames);
      const lastName = randomElement(lastNames);
      const city = randomElement(indianCities);
      
      const customer = await Customer.create({
        name: `${firstName} ${lastName}`,
        phone: `+91 ${Math.floor(70000 + Math.random() * 30000)}${Math.floor(10000 + Math.random() * 90000)}`,
        address: `${Math.floor(1 + Math.random() * 999)}, ${randomElement(["MG Road", "Park Street", "Main Road", "Station Road", "Market Street"])}, ${city.city}, ${city.pincode}`,
        businessName: randomElement(businessNames) || undefined,
        createdBy: dummyUserId,
      });
      
      customers.push(customer);
    }
    console.log(`✅ Created ${customers.length} customers`);

    // Create 200 parcels with varied dates (last 3 months)
    console.log("📦 Creating 200 parcels...");
    const parcels = [];
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < 200; i++) {
      const customer = randomElement(customers);
      const pickupCity = randomElement(indianCities);
      const deliveryCity = randomElement(indianCities.filter(c => c.city !== pickupCity.city));
      const mode = randomElement(modes);
      const status = randomElement(statuses);
      
      // Generate realistic dates based on status
      const createdAt = randomDate(threeMonthsAgo, now);
      let pickupTime = null;
      let deliveryTime = null;
      let expectedDeliveryTime = null;
      
      if (status !== "PENDING") {
        pickupTime = new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000); // Within 24 hours
        
        if (status === "DELIVERED") {
          const deliveryDays = mode === "AIR" ? 2 : mode === "TRAIN" ? 4 : 5;
          deliveryTime = new Date(pickupTime.getTime() + (deliveryDays + Math.random() * 2) * 24 * 60 * 60 * 1000);
        } else {
          // For in-progress parcels, set expected delivery
          const expectedDays = mode === "AIR" ? 2 : mode === "TRAIN" ? 4 : 5;
          expectedDeliveryTime = new Date(pickupTime.getTime() + expectedDays * 24 * 60 * 60 * 1000);
        }
      } else {
        // For pending parcels, set expected delivery from creation
        const expectedDays = mode === "AIR" ? 2 : mode === "TRAIN" ? 4 : 5;
        expectedDeliveryTime = new Date(createdAt.getTime() + (expectedDays + 1) * 24 * 60 * 60 * 1000);
      }
      
      const parcel = await Parcel.create({
        publicId: uuidv4(),
        trackingId: generateTrackingId(),
        customer: customer._id,
        customerName: customer.name,
        customerPhone: customer.phone,
        pickupAddress: `${Math.floor(1 + Math.random() * 999)}, ${randomElement(["Sector", "Block", "Street", "Avenue"])} ${Math.floor(1 + Math.random() * 50)}, ${pickupCity.city}, ${pickupCity.pincode}`,
        deliveryAddress: `${Math.floor(1 + Math.random() * 999)}, ${randomElement(["Apartment", "Building", "Complex", "Tower"])} ${Math.floor(1 + Math.random() * 100)}, ${deliveryCity.city}, ${deliveryCity.pincode}`,
        description: randomElement([
          "Electronics - Laptop",
          "Documents - Legal Papers",
          "Clothing - Apparel",
          "Books - Educational Material",
          "Mobile Phone",
          "Home Appliances",
          "Gifts - Personal Items",
          "Medical Supplies",
          "Food Items - Packaged",
          "Accessories - Fashion"
        ]),
        weight: Math.round((0.5 + Math.random() * 20) * 10) / 10, // 0.5 to 20.5 kg
        volume: Math.round((0.01 + Math.random() * 0.5) * 100) / 100, // 0.01 to 0.51 cubic meters
        mode,
        pickupTime,
        deliveryTime,
        expectedDeliveryTime,
        status,
        internalNotes: randomElement([
          "Handle with care",
          "Fragile items",
          "Priority delivery",
          "Standard shipping",
          "Express delivery requested",
          undefined,
          undefined
        ]),
        proofUrls: [],
        createdBy: dummyUserId,
        createdAt,
        updatedAt: createdAt,
      });
      
      parcels.push(parcel);
      
      if ((i + 1) % 50 === 0) {
        console.log(`   📦 Created ${i + 1} parcels...`);
      }
    }
    
    console.log(`✅ Created ${parcels.length} parcels`);

    // Print summary statistics
    console.log("\n📊 Seeding Summary:");
    console.log(`   👥 Customers: ${customers.length}`);
    console.log(`   📦 Parcels: ${parcels.length}`);
    
    const statusCounts = await Parcel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    console.log("\n   Status Distribution:");
    statusCounts.forEach(s => console.log(`      ${s._id}: ${s.count}`));
    
    const modeCounts = await Parcel.aggregate([
      { $group: { _id: "$mode", count: { $sum: 1 } } }
    ]);
    console.log("\n   Mode Distribution:");
    modeCounts.forEach(m => console.log(`      ${m._id}: ${m.count}`));

    console.log("\n✅ Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from database");
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("🎉 Seeding process finished!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding process failed:", error);
    process.exit(1);
  });
