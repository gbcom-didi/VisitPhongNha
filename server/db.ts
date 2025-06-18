import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

const businesses = [
  {
    id: 1618,
    name: "ANARA Binh Tien Golf Club",
    description: "Premium golf course with stunning ocean views and challenging holes designed for all skill levels.",
    latitude: "11.9404",
    longitude: "109.0139",
    address: "Binh Tien Commune, Phan Rang-Thap Cham, Ninh Thuan",
    phone: "+84 259 3888 888",
    website: "https://anaraclub.com",
    hours: "6:00 AM - 6:00 PM",
    categoryId: 6,
    imageUrl: "https://images.unsplash.com/photo-1535132011086-b8818f016104?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
  {
    id: 1619,
    name: "Amanoi",
    description: "Ultra-luxury resort nestled in Vinh Hy Bay with private villas and world-class spa services.",
    latitude: "11.7500",
    longitude: "109.2167",
    address: "Vinh Hy Village, Vinh Hai Commune, Ninh Hai, Ninh Thuan",
    phone: "+84 259 3770 777",
    website: "https://amanresorts.com/amanoi",
    hours: "24/7",
    categoryId: 4,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
  {
    id: 1620,
    name: "Binh Lap",
    description: "Pristine fishing village with crystal clear waters, perfect for snorkeling and experiencing local coastal life.",
    latitude: "11.7000",
    longitude: "109.2500",
    address: "Binh Lap Village, Cam Lap Commune, Cam Ranh, Khanh Hoa",
    phone: null,
    website: null,
    hours: "Always open",
    categoryId: 6,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
  {
    id: 1621,
    name: "Binh Son Beach",
    description: "Secluded beach with golden sand dunes and excellent conditions for kitesurfing and beach recreation.",
    latitude: "11.5833",
    longitude: "109.0500",
    address: "Binh Son Commune, Ninh Phuoc, Ninh Thuan",
    phone: null,
    website: null,
    hours: "Always open",
    categoryId: 5,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
]