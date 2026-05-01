import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const email = "admin@admin.com";
    const plainPassword = "admin";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    let adminUser = await User.findOne({ email });

    if (adminUser) {
      // Update existing admin password
      adminUser.password = hashedPassword;
      adminUser.role = "ADMIN";
      await adminUser.save();
      return NextResponse.json({ message: "Admin password reset successfully to: admin" });
    } else {
      // Create new admin user
      adminUser = await User.create({
        name: "Admin User",
        email,
        password: hashedPassword,
        role: "ADMIN"
      });
      return NextResponse.json({ message: "Admin account created successfully with password: admin" });
    }
  } catch (error) {
    console.error("Error resetting admin:", error);
    return NextResponse.json({ error: "Failed to reset admin" }, { status: 500 });
  }
}
