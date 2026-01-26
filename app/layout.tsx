import React from "react";
import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

import { AppProvider } from "@/components/providers/app-provider";

const playfair = Playfair_Display({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: 'AndreaQuality - Premium Eyewear',
  description: 'Discover our curated collection of luxury eyewear',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
