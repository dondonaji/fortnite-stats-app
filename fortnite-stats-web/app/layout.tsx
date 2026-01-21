import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Luxury Sans
import "./globals.css";

import { DevModeBadge } from "@/components/DevModeBadge";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Fortnite Stats Pro",
    template: "%s | FN.PRO"
  },
  description: "Elite performance tracking for Fortnite players. Visual analytics, detailed history, and pro-level insights.",
  keywords: ["Fortnite", "Stats", "Tracker", "Dashboard", "Gaming", "Competitive"],
  authors: [{ name: "Don" }],
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FN.PRO",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://fortnite-stats-pro.vercel.app", // Fallback URL
    title: "Fortnite Stats Pro | Elite Dashboard",
    description: "Analyze your performance with pro-level visuals. Track wins, K/D, and survival trends.",
    siteName: "Fortnite Stats Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortnite Stats Pro",
    description: "Elite performance tracking for Fortnite players.",
  }
};

export const viewport: Viewport = {
  themeColor: "#050505", // Updated to Luxury Black
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DevModeBadge />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
