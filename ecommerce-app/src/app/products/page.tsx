"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "4rem" }}>Loading awesome products...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="title">Our Catalog</h1>
      <p className="subtitle">Discover our exclusive collection of premium items.</p>

      {products.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          No products available. Add some from the admin panel!
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="card">
              <img 
                src={product.imageUrl || `https://source.unsplash.com/400x300/?${product.category || 'product'}`} 
                alt={product.name} 
                className="product-image"
              />
              <div className="product-info">
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{product.name}</h3>
                  <span style={{ fontSize: "0.875rem", color: "#94a3b8", background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {product.category}
                  </span>
                </div>
                <div className="product-price">${product.price.toFixed(2)}</div>
              </div>
              <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                {product.description}
              </p>
              {user && user.role !== "ADMIN" ? (
                <button 
                  className="btn btn-primary" 
                  style={{ width: "100%" }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              ) : !user ? (
                <button 
                  className="btn btn-outline" 
                  style={{ width: "100%" }}
                  onClick={() => router.push("/login")}
                >
                  Login to Order
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
