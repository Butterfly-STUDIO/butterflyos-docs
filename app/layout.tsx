import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ButterflyOS — Guida ufficiale",
  description:
    "Documentazione interattiva per installare, configurare e mantenere ButterflyOS.",
  metadataBase: new URL("https://docs.butterflyos.dev"),
  openGraph: {
    title: "ButterflyOS — Guida ufficiale",
    description:
      "Passaggi chiari, soluzioni rapide e risorse avanzate per ButterflyOS.",
    type: "website",
    url: "https://docs.butterflyos.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "ButterflyOS — Guida ufficiale",
    description:
      "Installazione, configurazione e supporto avanzato per ButterflyOS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
