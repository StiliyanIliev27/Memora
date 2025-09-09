import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/stores/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memora.app";

export const metadata: Metadata = {
  title: "Memora - Share Your Memories",
  description: "An interactive world map where people can save and share their memories with others",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Memora",
    title: "Memora – Capture Every Moment on a Beautiful Map",
    description:
      "Create and share memories on an interactive world map. Photos, videos, and notes with the people you care about.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Memora – Share Your Memories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@memora",
    creator: "@memora",
    title: "Memora – Capture Every Moment on a Beautiful Map",
    description:
      "Create and share memories on an interactive world map. Photos, videos, and notes with the people you care about.",
    images: ["/og-image.png"],
  },
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
