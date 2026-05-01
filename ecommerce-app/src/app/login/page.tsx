"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      if (isLogin) {
        login(data.user);
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/products");
        }
      } else {
        // Auto login after register for simplicity, or just switch to login mode
        setIsLogin(true);
        setError("Registration successful. Please login.");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <h2 className="title" style={{ fontSize: "2rem", textAlign: "center" }}>
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>
      
      {error && <div style={{ color: "var(--danger)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
      
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", justifyContent: "center" }}>
        <button 
          type="button"
          className="btn btn-outline" 
          onClick={() => { setEmail(""); setIsLogin(true); document.querySelector<HTMLInputElement>('input[type="email"]')?.focus(); }}
          style={{ flex: 1, padding: "0.5rem" }}
        >
          Customer Login
        </button>
        <button 
          type="button"
          className="btn btn-outline" 
          onClick={() => { setEmail("admin@admin.com"); setIsLogin(true); document.querySelector<HTMLInputElement>('input[type="password"]')?.focus(); }}
          style={{ flex: 1, padding: "0.5rem" }}
        >
          Admin Login
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            className="form-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>
      
      <p style={{ marginTop: "1.5rem", textAlign: "center", color: "#94a3b8" }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "1rem" }}
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
