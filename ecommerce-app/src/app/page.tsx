import Link from "next/link";

export default function Home() {
  return (
    <div className="hero-section animate-fade-in">
      <h1 className="hero-title">Welcome to Aurora Store</h1>
      <p className="hero-subtitle">
        Discover premium products with a seamless, next-generation shopping experience. 
        High performance, stunning design, and exceptional quality.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Link href="/products" className="btn btn-primary">
          Explore Catalog
        </Link>
        <Link href="/login" className="btn btn-outline">
          Sign In
        </Link>
      </div>
      
      <div className="grid grid-cols-3" style={{ marginTop: "4rem", textAlign: "left" }}>
        <div className="card">
          <h3>⚡ Lightning Fast</h3>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>Built with Next.js App Router for unparalleled performance.</p>
        </div>
        <div className="card">
          <h3>🎨 Premium Design</h3>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>Vibrant colors, dark mode, and smooth glassmorphism effects.</p>
        </div>
        <div className="card">
          <h3>🛒 Seamless Checkout</h3>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>An integrated cart and order management system.</p>
        </div>
      </div>
    </div>
  );
}
