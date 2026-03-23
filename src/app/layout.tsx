import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://waitlist.hyperkitlabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hyperkit Studio | AI-Powered Solidity & DeFi Development Platform",
    template: "%s | Hyperkit Studio",
  },
  description:
    "Join the Hyperkit waitlist. Build secure multi-chain DeFi apps with AI. Generate Solidity smart contracts, audit, test, and deploy to Skale Base, Metis, Mantle & Avalanche in under 30 minutes.",
  keywords: [
    "Solidity AI",
    "AI smart contract generator",
    "DeFi development studio",
    "multi-chain DeFi",
    "Web3 AI development",
    "Hyperkit Studio",
    "smart contract builder",
    "AI Solidity generator",
    "generate smart contracts with AI",
    "DeFi app builder",
    "Skale Base",
    "Metis DeFi",
    "Mantle DeFi",
    "Avalanche DeFi",
    "Ethereum DeFi tools",
    "AI contract auditor",
    "secure DeFi apps",
    "blockchain development platform",
  ],
  authors: [{ name: "Hyperkit Toolkit" }],
  creator: "Hyperkit Toolkit",
  publisher: "Hyperkit Toolkit",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Hyperkit Studio",
    title: "Hyperkit Studio | AI-Powered Solidity & DeFi Development Platform",
    description:
      "Build secure multi-chain DeFi apps with AI. Generate Solidity smart contracts, audit, test, and deploy to Skale Base, Metis, Mantle & Avalanche.",
    images: [
      {
        url: "/logo/brand/hyperkit/Hyperkit-logo.png",
        width: 512,
        height: 512,
        alt: "Hyperkit Studio - AI Solidity & DeFi Development",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyperkit Studio | AI Solidity & DeFi Development",
    description: "Build secure multi-chain DeFi apps with AI. Generate, audit & deploy smart contracts fast.",
    images: ["/logo/brand/hyperkit/Hyperkit-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
  classification: "Web3, DeFi, Blockchain, AI Development",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hyperkit Studio",
  description:
    "AI-powered Solidity and DeFi development platform. Generate smart contracts with AI, audit, test, and deploy to Skale Base, Metis, Mantle & Avalanche.",
  url: siteUrl,
  applicationCategory: "DeveloperApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI Solidity generator",
    "Smart contract builder",
    "Multi-chain DeFi deployment",
    "Skale Base, Metis, Mantle, Avalanche support",
    "AI contract auditor",
    "DeFi app development",
  ],
  operatingSystem: "Web",
  author: {
    "@type": "Organization",
    name: "Hyperkit Toolkit",
  },
  keywords:
    "Solidity AI, AI smart contract generator, DeFi development, Web3 AI, Hyperkit Studio, multi-chain DeFi",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
