import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce_turbopack";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const SEED_PRODUCTS = [
  {
    title: "Aura Pro Wireless Noise-Cancelling Headphones",
    description: "Engineered with 40mm beryllium drivers, active noise cancellation up to 42dB, transparency mode, and up to 45 hours of ultra-long battery life with rapid USB-C charging.",
    price: 24999,
    category: "Audio",
    stock: 24,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    featured: true,
  },
  {
    title: "Vortex Mech65 RGB Mechanical Keyboard",
    description: "Compact 65% hot-swappable mechanical keyboard featuring CNC aluminum chassis, pre-lubed Gateron Pro switches, PBT dye-sub keycaps, and customizable per-key RGB backlighting.",
    price: 12499,
    category: "Accessories",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    featured: true,
  },
  {
    title: "Chronos Ultra Smartwatch Series 9",
    description: "Sapphire crystal display, aerospace titanium case, comprehensive ECG and SpO2 health tracking, dual-frequency GPS, and 100m water resistance.",
    price: 32999,
    category: "Wearables",
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    featured: true,
  },
  {
    title: "Minimalist Ergonomic Commuter Backpack",
    description: "Weather-resistant 1000D Cordura ballistic nylon exterior, dedicated 16-inch padded laptop sleeve, magnetic Fidlock buckles, and hidden passport security pocket.",
    price: 4499,
    category: "Bags",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    featured: false,
  },
  {
    title: "Lumina Smart Ambient Desk Lamp",
    description: "Stepless dimming, 2700K-6500K color temperature adjustment, Apple HomeKit and Google Home integration, with integrated 15W Qi wireless phone charger in the base.",
    price: 2999,
    category: "Smart Home",
    stock: 42,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    featured: false,
  },
  {
    title: "StudioPulse True Wireless Gaming Earbuds",
    description: "Ultra-low 35ms latency mode, dual MEMS beamforming microphones with AI environmental noise suppression, and wireless charging case.",
    price: 3999,
    category: "Audio",
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    featured: false,
  },
];

async function seed() {
  console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash("Admin@123", salt);
  const customerPassword = await bcrypt.hash("Customer@123", salt);

  await User.findOneAndUpdate(
    { email: "admin@ecommerce.com" },
    { name: "Admin User", email: "admin@ecommerce.com", password: adminPassword, role: "admin" },
    { upsert: true, new: true }
  );
  console.log("Admin account created: admin@ecommerce.com / Admin@123");

  await User.findOneAndUpdate(
    { email: "customer@ecommerce.com" },
    { name: "Aarav Customer", email: "customer@ecommerce.com", password: customerPassword, role: "customer" },
    { upsert: true, new: true }
  );
  console.log("Customer account created: customer@ecommerce.com / Customer@123");

  for (const item of SEED_PRODUCTS) {
    await Product.findOneAndUpdate(
      { title: item.title },
      { ...item },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${SEED_PRODUCTS.length} products with INR currency.`);

  await mongoose.disconnect();
  console.log("Database seed completed successfully.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
