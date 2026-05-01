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

export async function POST(req: Request) {
  try {
    const userPayload = getUserFromToken(req);
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, totalAmount } = await req.json();

    if (!items || items.length === 0 || !totalAmount) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.create({
      user: userPayload.userId,
      items,
      totalAmount,
      status: "PENDING"
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const userPayload = getUserFromToken(req);
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // If admin, they could fetch all orders, but let's stick to user's orders for simplicity
    const orders = await Order.find({ user: userPayload.userId }).sort({ createdAt: -1 }).populate("items.product");
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
