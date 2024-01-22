import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const API_BASE_URL = "http://localhost:1929"

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Flixnet",
  description: "My Full-Stack Netflix clone",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
