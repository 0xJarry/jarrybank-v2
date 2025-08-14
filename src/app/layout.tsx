import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JarryBank - Web3 Portfolio Tracker",
  description:
    "Track your DeFi portfolio, manage positions, and claim rewards across Avalanche protocols",
  keywords: "DeFi, Portfolio, Avalanche, Web3, Crypto, Trader Joe, GMX, Benqi",
  authors: [{ name: "JarryBank Team" }],
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Web3Provider>
            <div className="min-h-screen bg-background">
              <Header />
              {children}
            </div>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
