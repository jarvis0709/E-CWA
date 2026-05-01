"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user, router]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCEL_REQUESTED" }),
      });

      if (res.ok) {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: "CANCEL_REQUESTED" } : order));
      } else {
        const errorData = await res.json();
        alert(`Failed to cancel order: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while cancelling the order.");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "4rem" }}>Loading orders...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="title">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="grid" style={{ gap: "1.5rem" }}>
          {orders.map(order => (
            <div key={order._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Order ID</div>
                  <div style={{ fontFamily: "monospace", fontWeight: "bold" }}>{order._id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Status</div>
                  <div style={{ 
                    color: order.status === "DELIVERED" ? "var(--success)" : order.status === "CANCELLED" ? "var(--danger, #ef4444)" : "var(--primary)",
                    fontWeight: "bold"
                  }}>
                    {order.status}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                {order.items && order.items.map((item: any, index: number) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>{item.quantity}x {item.product?.name || "Unknown Product"}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "1rem", fontWeight: "bold", fontSize: "1.2rem" }}>
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              
              {(order.status === "PENDING" || order.status === "PAID") && (
                <div style={{ marginTop: "1rem", textAlign: "right" }}>
                  <button 
                    onClick={() => handleCancelOrder(order._id)}
                    className="btn" 
                    style={{ backgroundColor: "var(--danger, #ef4444)", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "0.25rem", cursor: "pointer" }}
                  >
                    Request Cancellation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
