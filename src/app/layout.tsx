import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import ConditionalLayout from "@/components/ConditionalLayout";

// Bind fonts to the CSS variables defined in globals.css
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MitoCan-Symposium 2026",
  description: "International Symposium on Mitochondria, Cell Death, and Human Disease: Recent Advances in Cancer Research and Clinical Translation. November 2 - 3, 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is critical here to allow next-themes/our custom script 
    // to inject the 'dark' class on the server without React complaining on the client.
    <html lang="en" suppressHydrationWarning>
        <body 
          suppressHydrationWarning
          className={`${playfair.variable} ${inter.variable} antialiased min-h-screen flex flex-col bg-background text-on-background`}
        >
        <ThemeProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}