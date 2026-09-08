import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Revora — The Stripe-native Retention Platform",
  description:
    "Revora turns subscription cancellations into recovered revenue with personalized retention flows, offers, exit surveys, and analytics — built natively for Stripe.",
  openGraph: {
    title: "Revora — The Stripe-native Retention Platform",
    description:
      "Turn cancellations into recovered revenue. Built for subscription businesses running on Stripe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={plusJakartaSans.variable}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}