import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe | Hyperkit Studio Waitlist",
  description:
    "Manage your Hyperkit waitlist email preferences and marketing subscription.",
  robots: { index: false, follow: true },
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
