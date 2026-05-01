"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          Aurora <span>Store</span>
        </Link>
        <div className="nav-links">
          <Link href="/products" className="nav-item">Products</Link>
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link href="/admin" className="nav-item" style={{ fontWeight: "bold", color: "var(--primary)" }}>Admin Panel</Link>
              ) : (
                <Link href="/orders" className="nav-item">Orders</Link>
              )}
              <button onClick={logout} className="nav-item btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-item">Customer Login</Link>
              <Link href="/login" className="nav-item">Admin Login</Link>
            </>
          )}
          {user && user.role !== "ADMIN" && (
            <Link href="/cart" className="nav-cart">
              <span className="cart-icon">🛒</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
