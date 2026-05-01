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

export async function PATCH(req: Request, context: any) {
  try {
    const userPayload = getUserFromToken(req);
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (status !== "CANCELLED" && status !== "CANCEL_REQUESTED") {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Handle both Next.js 14 and 15 params API (promise or object)
    const params = await context.params;
    const orderId = params.id;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Ensure the user owns the order, unless they are an admin
    if (order.user.toString() !== userPayload.userId && userPayload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (order.status !== "PENDING" && order.status !== "PAID") {
      return NextResponse.json({ error: "Order cannot be cancelled at this stage" }, { status: 400 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
