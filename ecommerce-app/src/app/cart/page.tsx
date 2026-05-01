"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          })),
          totalAmount: total
        })
      });

      if (res.ok) {
        clearCart();
        router.push("/orders");
      } else {
        alert("Checkout failed");
      }
    } catch (e) {
      alert("Error during checkout");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="card animate-fade-in" style={{ textAlign: "center", padding: "4rem" }}>
        <h2 className="title" style={{ fontSize: "2rem" }}>Your cart is empty</h2>
        <p className="subtitle">Looks like you haven't added anything yet.</p>
        <button className="btn btn-primary" onClick={() => router.push("/products")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="title">Shopping Cart</h1>
      
      <div className="card" style={{ padding: "0" }}>
        {cart.map((item) => (
          <div key={item.product._id} className="cart-item">
            <div className="cart-item-info">
              <img 
                src={item.product.imageUrl || `https://source.unsplash.com/100x100/?${item.product.category || 'product'}`} 
                alt={item.product.name} 
                className="cart-item-img"
              />
              <div>
                <h4 style={{ fontSize: "1.1rem" }}>{item.product.name}</h4>
                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                  ${item.product.price.toFixed(2)} x {item.quantity}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => removeFromCart(item.product._id)}
                className="btn btn-danger"
                style={{ padding: "0.5rem" }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div style={{ color: "#94a3b8", marginBottom: "0.5rem" }}>Total Amount</div>
        <div className="cart-total">${total.toFixed(2)}</div>
        <button 
          className="btn btn-primary" 
          style={{ width: "100%", fontSize: "1.1rem", padding: "1rem" }}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : (user ? "Proceed to Checkout" : "Login to Checkout")}
        </button>
      </div>
    </div>
  );
}
