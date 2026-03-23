import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Confirmed | Hyperkit Studio Waitlist",
  description:
    "Your Hyperkit Studio waitlist spot is confirmed. You're on the list for Beta Wave 1 of our AI Solidity and DeFi development platform.",
  robots: { index: false, follow: true },
};

export default function ConfirmedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
