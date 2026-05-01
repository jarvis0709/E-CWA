import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCEL_REQUESTED", "CANCELLED"], default: "PENDING" }
}, { timestamps: true });

export const Order = models.Order || model("Order", OrderSchema);
