import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { DevModeBadge } from "@/components/DevModeBadge";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

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
    url: "https://fortnite-stats-pro.vercel.app",
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
  themeColor: "#050505",
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
    <html lang="es">
      <body className={`${geist.variable} font-sans antialiased`}>
        <DevModeBadge />
        {children}
      </body>
    </html>
  );
}
