"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
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
  }, [user, router]);

  // Handle loading state or non-admin user
  if (!user || user.role !== "ADMIN") {
    return <div style={{ textAlign: "center", marginTop: "4rem" }}>Checking permissions...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="title">Admin Panel</h1>
      <p className="subtitle">Manage your store's catalog and process cancel requests.</p>
      
      <div className="grid grid-cols-2" style={{ gap: "2rem", marginTop: "2rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "1rem" }}>📦 Product Management</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Create new products to expand your store's catalog.
          </p>
          <Link href="/admin/products/new" className="btn btn-primary" style={{ display: "inline-block" }}>
            Add New Product
          </Link>
        </div>
        
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "1rem" }}>📝 Cancel Requests</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Review and approve order cancellation requests from customers.
          </p>
          <Link href="/admin/orders/cancel-requests" className="btn btn-primary" style={{ display: "inline-block" }}>
            Manage Requests
          </Link>
        </div>
      </div>
    </div>
  );
}
