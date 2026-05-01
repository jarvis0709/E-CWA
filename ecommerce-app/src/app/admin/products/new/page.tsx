"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function NewProduct() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    stock: "10"
  });

  useEffect(() => {
    // Basic protection - ideal would be server-side or middleware
    if (user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      });

      if (res.ok) {
        router.push("/products");
      } else {
        alert("Failed to create product");
      }
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="auth-container animate-fade-in" style={{ maxWidth: "600px" }}>
      <h2 className="title" style={{ fontSize: "2rem", textAlign: "center" }}>Add Product</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            name="description" 
            className="form-input" 
            rows={3} 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Price ($)</label>
            <input type="number" step="0.01" name="price" className="form-input" value={formData.price} onChange={handleChange} required />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Stock</label>
            <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <input type="text" name="category" className="form-input" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input type="url" name="imageUrl" className="form-input" value={formData.imageUrl} onChange={handleChange} />
          <small style={{ color: "#94a3b8" }}>Leave blank to use a generated placeholder.</small>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Create Product
        </button>
      </form>
    </div>
  );
}
