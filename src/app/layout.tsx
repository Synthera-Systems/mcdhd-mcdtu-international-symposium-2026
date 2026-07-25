import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/context/ThemeContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import Providers from "@/components/providers";

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
  // %s will be replaced by child page titles automatically!
  title: {
    template: "%s | MitoCan-Symposium 2026",
    default: "MitoCan-Symposium 2026 | International Symposium on Mitochondria",
  },
  description: "International Symposium on Mitochondria, Cell Death, and Human Disease: Recent Advances in Cancer Research and Clinical Translation. November 2 - 3, 2026.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        suppressHydrationWarning
        className={`${playfair.variable} ${inter.variable} antialiased min-h-screen flex flex-col bg-background text-on-background`}
      >
        <Providers>
          <ThemeProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}