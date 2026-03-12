/**
 * Seed script to create an initial admin user.
 * Run with: npm run db:seed
 * Requires MONGODB_URI in .env
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME;

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "MONGODB_URI is required. Add it to .env (copy from .env.example)",
    );
    process.exit(1);
  }

  await mongoose.connect(uri);

  const existing = await AdminUser.findOne({
    email: ADMIN_EMAIL.toLowerCase(),
  });
  if (existing) {
    console.log("Admin user already exists:", ADMIN_EMAIL);
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await AdminUser.create({
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    name: ADMIN_NAME,
  });

  console.log("Admin user created:", ADMIN_EMAIL);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
