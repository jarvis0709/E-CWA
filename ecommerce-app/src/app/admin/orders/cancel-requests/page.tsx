"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ManageCancelRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/");
      }
    }, 100);
    return () => clearTimeout(timer);

    if (user) {
      fetch("/api/admin/orders/cancel-requests")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRequests(data);
          } else {
            setRequests([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, router]);

  const handleAction = async (orderId: string, action: "CANCELLED" | "PENDING") => {
    if (!confirm(`Are you sure you want to ${action === 'CANCELLED' ? 'approve' : 'deny'} this request?`)) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action })
      });

      if (res.ok) {
        setRequests(requests.filter(req => req._id !== orderId));
      } else {
        alert("Failed to process request");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing request");
    }
  };

  if (!user || loading) return <div style={{ textAlign: "center", marginTop: "4rem" }}>Loading requests...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="title">Manage Cancel Requests</h1>
      <p className="subtitle">Review customer requests to cancel their orders.</p>

      {requests.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>No pending cancellation requests at the moment.</div>
      ) : (
        <div className="grid" style={{ gap: "1.5rem" }}>
          {requests.map(order => (
            <div key={order._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div>
                  <strong style={{ display: "block", marginBottom: "0.25rem" }}>Order ID: {order._id}</strong>
                  <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                    Customer: {order.user?.name || "Unknown"} ({order.user?.email || "N/A"})
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Total Amount</div>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>${order.totalAmount.toFixed(2)}</div>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Items:</h4>
                {order.items && order.items.map((item: any, idx: number) => (
                  <div key={idx} style={{ fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                    <span>{item.quantity}x {item.product?.name || "Product Name"}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleAction(order._id, "PENDING")}
                >
                  Deny Request
                </button>
                <button 
                  className="btn btn-primary"
                  style={{ backgroundColor: "var(--danger, #ef4444)", border: "none" }}
                  onClick={() => handleAction(order._id, "CANCELLED")}
                >
                  Approve Cancellation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
