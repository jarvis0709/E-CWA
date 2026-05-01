import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";

const seedProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    category: "Electronics",
    stock: 50
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with tactile switches, programmable macros, and aluminum frame.",
    price: 129.50,
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop",
    category: "Gaming",
    stock: 35
  },
  {
    name: "Smart Watch Series 7",
    description: "Advanced health tracking, water resistance, and always-on retina display. Stay connected on the go.",
    price: 399.00,
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop",
    category: "Wearables",
    stock: 20
  },
  {
    name: "Ergonomic Office Chair",
    description: "Adjustable lumbar support, breathable mesh back, and 3D armrests for all-day comfort.",
    price: 249.99,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop",
    category: "Furniture",
    stock: 15
  },
  {
    name: "4K Ultra HD Smart TV",
    description: "55-inch stunning 4K display with HDR, built-in voice assistant, and seamless streaming apps integration.",
    price: 499.99,
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop",
    category: "Electronics",
    stock: 10
  },
  {
    name: "Professional Camera Lens",
    description: "50mm f/1.8 prime lens for crisp portraits, smooth bokeh, and exceptional low-light performance.",
    price: 199.00,
    imageUrl: "https://images.unsplash.com/photo-1617005082833-1eb58564089c?q=80&w=1000&auto=format&fit=crop",
    category: "Photography",
    stock: 25
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear existing products to prevent duplicates on multiple runs
    await Product.deleteMany({});
    
    // Insert new products
    const createdProducts = await Product.insertMany(seedProducts);
    
    return NextResponse.json({ message: "Database seeded successfully", count: createdProducts.length, products: createdProducts });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed products" }, { status: 500 });
  }
}
