import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

function getUserFromToken(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const tokenCookie = cookieHeader.split(";").find(c => c.trim().startsWith("token="));
  if (!tokenCookie) return null;
  
  const token = tokenCookie.split("=")[1];
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userPayload = getUserFromToken(req);
    if (!userPayload || userPayload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const orders = await Order.find({ status: "CANCEL_REQUESTED" })
      .sort({ updatedAt: -1 })
      .populate("user", "name email")
      .populate("items.product");
      
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cancel requests" }, { status: 500 });
  }
}
