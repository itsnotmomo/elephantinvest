import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elephant Invest",
  description: "Shaping tomorrow's capital.",
  metadataBase: new URL("https://elephantinvest.de"),
  openGraph: {
    title: "Elephant Invest",
    description: "Shaping tomorrow's capital.",
    url: "https://elephantinvest.de",
    siteName: "Elephant Invest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Elephant Invest",
    description: "Shaping tomorrow's capital.",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
